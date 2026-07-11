const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const auth = require('../middleware/auth');
const { publicLimiter } = require('../middleware/rateLimit');

// @route   POST /api/visitors/log
// @desc    Log a page view visit
// @access  Public (Rate-limited)
router.post('/log', publicLimiter(), async (req, res) => {
  const { path, referrer } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!path) {
    return res.status(400).json({ message: 'Path is required' });
  }

  try {
    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24-hour window
    
    // Look for an existing visitor session from the same IP + Agent in the last 24 hours
    let visitor = await Visitor.findOne({
      ip,
      userAgent,
      lastVisitedAt: { $gte: timeLimit }
    });

    if (visitor) {
      // Update session
      visitor.pageViews += 1;
      visitor.pagesVisited.push({ path });
      visitor.lastVisitedAt = new Date();
      if (referrer && !visitor.referrer) {
        visitor.referrer = referrer;
      }
      await visitor.save();
    } else {
      // Create new session
      visitor = new Visitor({
        ip,
        userAgent,
        pagesVisited: [{ path }],
        pageViews: 1,
        referrer: referrer || '',
        lastVisitedAt: new Date()
      });
      await visitor.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error logging visit:', error);
    // Silent fail to client so analytic errors don't disrupt user experience
    res.status(200).json({ success: false, message: 'Visit logged internally with error' });
  }
});

// @route   GET /api/visitors
// @desc    Get all visitor sessions and aggregates (Admin-only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ lastVisitedAt: -1 });

    let totalPageViews = 0;
    const pageCounts = {};

    visitors.forEach(v => {
      totalPageViews += v.pageViews || 0;
      if (v.pagesVisited) {
        v.pagesVisited.forEach(p => {
          if (p.path) {
            pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
          }
        });
      }
    });

    // Sort page counts to find the top 5 most visited pages
    const popularPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats = {
      totalPageViews,
      uniqueVisitors: visitors.length,
      averageViewsPerSession: visitors.length > 0 ? parseFloat((totalPageViews / visitors.length).toFixed(1)) : 0,
      popularPages
    };

    res.json({
      visitors,
      stats
    });
  } catch (error) {
    console.error('Error getting visitors:', error);
    res.status(500).json({ message: 'Server error retrieving visitor logs' });
  }
});

module.exports = router;
