import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, Edit2, Trash2, FolderPlus, Upload, X, Check, Loader, 
  AlertTriangle, Sparkles, Phone, MessageSquare, Users, Mail,
  Home, Zap, Sun, FolderOpen, LogOut, LayoutDashboard, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, categoryService, designService, teamService, inquiryService } from '../services/api';
import { API_BASE_URL } from '../constants';
import { createLuminanceDepthMap } from '../utils/depthMapGenerator';

const getWhatsAppLink = (phone) => {
  if (!phone) return '#';
  const cleanNumber = phone.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    return `https://wa.me/91${cleanNumber}`;
  }
  return `https://wa.me/${cleanNumber}`;
};

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // View States
  const [activeTab, setActiveTab] = useState('interior'); // 'interior' | 'electrical' | 'lighting' | 'team' | 'categories' | 'inquiries'
  const [showDesignForm, setShowDesignForm] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  // Team Form States
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamRoleTe, setTeamRoleTe] = useState('');
  const [teamExp, setTeamExp] = useState('');
  const [teamFile, setTeamFile] = useState(null);

  // Design Form States
  const [designTitleEn, setDesignTitleEn] = useState('');
  const [designTitleTe, setDesignTitleTe] = useState('');
  const [designCategory, setDesignCategory] = useState('');
  const [designDescEn, setDesignDescEn] = useState('');
  const [designDescTe, setDesignDescTe] = useState('');
  const [designFiles, setDesignFiles] = useState([]);
  const [existingImagesToKeep, setExistingImagesToKeep] = useState([]);
  const [designWorkType, setDesignWorkType] = useState('interior'); // 'interior' | 'electrical' | 'lighting'

  // 4D AI Vision states
  const [depthMapBase64, setDepthMapBase64] = useState('');
  const [depthMapLoading, setDepthMapLoading] = useState(false);

  // Auto-generate depth map when designFiles change (takes the primary image)
  useEffect(() => {
    if (designFiles && designFiles.length > 0) {
      setDepthMapLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const depthUrl = await createLuminanceDepthMap(event.target.result);
          setDepthMapBase64(depthUrl || '');
        } catch (err) {
          console.error('Error generating depth map:', err);
        } finally {
          setDepthMapLoading(false);
        }
      };
      reader.readAsDataURL(designFiles[0]);
    }
  }, [designFiles]);

  // Translation States and Handlers
  const [translatingFields, setTranslatingFields] = useState({});

  const translateText = async (text, setter, fieldName) => {
    if (!text || !text.trim()) return;
    setTranslatingFields(prev => ({ ...prev, [fieldName]: true }));
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(text.trim())}`
      );
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        setter(data[0][0][0]);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslatingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  // Category Form States
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameTe, setCatNameTe] = useState('');
  const [catFile, setCatFile] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catWorkType, setCatWorkType] = useState('interior');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all'); // 'all' | 'interior' | 'electrical' | 'lighting'

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, ds, team, inqs] = await Promise.all([
        categoryService.getAll(),
        designService.getAll(),
        teamService.getAll(),
        inquiryService.getAll()
      ]);
      setCategories(cats);
      setDesigns(ds);
      setTeamMembers(team);
      setInquiries(inqs);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to retrieve records from the API.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Design Actions
  const handleEditInit = (design) => {
    setEditingDesign(design);
    setDesignTitleEn(design.title_en);
    setDesignTitleTe(design.title_te);
    setDesignCategory(design.category?._id || design.category || '');
    setDesignDescEn(design.description_en || '');
    setDesignDescTe(design.description_te || '');
    setDesignFiles([]);
    setExistingImagesToKeep(design.images || []);
    setDepthMapBase64(design.depthMap || '');
    setDesignWorkType(design.workType || 'interior');
    setShowDesignForm(true);
  };

  const handleDesignCancel = () => {
    setShowDesignForm(false);
    setEditingDesign(null);
    setDesignTitleEn('');
    setDesignTitleTe('');
    setDesignCategory('');
    setDesignDescEn('');
    setDesignDescTe('');
    setDesignFiles([]);
    setExistingImagesToKeep([]);
    setDepthMapBase64('');
    setDesignWorkType(activeTab === 'electrical' ? 'electrical' : activeTab === 'lighting' ? 'lighting' : 'interior');
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImagesToKeep(existingImagesToKeep.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDesignSubmit = async (e) => {
    e.preventDefault();
    if (!designTitleEn || !designTitleTe || !designCategory) {
      setFeedback({ type: 'error', message: 'English/Telugu Titles and Category are required.' });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('title_en', designTitleEn);
    formData.append('title_te', designTitleTe);
    formData.append('category', designCategory);
    formData.append('description_en', designDescEn);
    formData.append('description_te', designDescTe);
    formData.append('workType', designWorkType);

    // Append newly selected files
    for (let i = 0; i < designFiles.length; i++) {
      formData.append('images', designFiles[i]);
    }

    if (depthMapBase64) {
      formData.append('depthMap', depthMapBase64);
    }

    try {
      if (editingDesign) {
        // Pass existing images that we want to keep
        formData.append('existingImages', JSON.stringify(existingImagesToKeep));
        await designService.update(editingDesign._id, formData);
        setFeedback({ type: 'success', message: 'Design portfolio updated successfully.' });
      } else {
        if (designFiles.length === 0) {
          throw new Error('Please select at least one design image to upload.');
        }
        await designService.create(formData);
        setFeedback({ type: 'success', message: 'New design portfolio created successfully.' });
      }
      handleDesignCancel();
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to submit design portfolio.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDesignDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this design from portfolio?')) {
      return;
    }

    setActionLoading(true);
    try {
      await designService.delete(id);
      setFeedback({ type: 'success', message: 'Design removed successfully.' });
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to delete design.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Category Actions
  const handleCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setCatNameEn(cat.name_en);
    setCatNameTe(cat.name_te);
    setCatWorkType(cat.workType || 'interior');
    setCatFile(null);
    setShowCategoryForm(true);
  };

  const handleCategoryCancel = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCatNameEn('');
    setCatNameTe('');
    setCatFile(null);
    setCatWorkType('interior');
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catNameEn || !catNameTe) {
      setFeedback({ type: 'error', message: 'Both English and Telugu category names are required.' });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('name_en', catNameEn);
    formData.append('name_te', catNameTe);
    formData.append('workType', catWorkType);
    if (catFile) {
      formData.append('image', catFile);
    }

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
        setFeedback({ type: 'success', message: 'Category details updated successfully.' });
      } else {
        if (!catFile) {
          throw new Error('Please select a cover banner image for this category.');
        }
        await categoryService.create(formData);
        setFeedback({ type: 'success', message: 'New design category created successfully.' });
      }
      handleCategoryCancel();
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save category.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete category? WARNING: This will also unassign/affect designs using this category.')) {
      return;
    }

    setActionLoading(true);
    try {
      await categoryService.delete(id);
      setFeedback({ type: 'success', message: 'Category removed successfully.' });
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to delete category.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Team Actions
  const handleTeamEdit = (member) => {
    setEditingTeamMember(member);
    setTeamName(member.name);
    setTeamRole(member.role);
    setTeamRoleTe(member.role_te || '');
    setTeamExp(member.exp || '');
    setTeamFile(null);
    setShowTeamForm(true);
  };

  const handleTeamCancel = () => {
    setShowTeamForm(false);
    setEditingTeamMember(null);
    setTeamName('');
    setTeamRole('');
    setTeamRoleTe('');
    setTeamExp('');
    setTeamFile(null);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamName || !teamRole || !teamRoleTe || !teamExp) {
      setFeedback({ type: 'error', message: 'All fields are required to build team profile.' });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('name', teamName);
    formData.append('role', teamRole);
    formData.append('role_te', teamRoleTe);
    formData.append('exp', teamExp);
    if (teamFile) {
      formData.append('image', teamFile);
    }

    try {
      if (editingTeamMember) {
        await teamService.update(editingTeamMember._id, formData);
        setFeedback({ type: 'success', message: 'Team member details updated.' });
      } else {
        if (!teamFile) {
          throw new Error('Please select a portrait image for the team member.');
        }
        await teamService.create(formData);
        setFeedback({ type: 'success', message: 'New team member profile created.' });
      }
      handleTeamCancel();
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save team member profile.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInquiryReply = async (id) => {
    try {
      await inquiryService.update(id, { replied: true });
      setFeedback({ type: 'success', message: 'Inquiry marked as replied.' });
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to update inquiry.' });
    }
  };

  const handleInquiryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) {
      return;
    }

    try {
      await inquiryService.delete(id);
      setFeedback({ type: 'success', message: 'Inquiry deleted successfully.' });
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to delete inquiry.' });
    }
  };

  const handleTeamDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    setActionLoading(true);
    try {
      await teamService.delete(id);
      setFeedback({ type: 'success', message: 'Team member removed successfully.' });
      loadData();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to delete team member.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getLocalizedName = (item) => {
    if (!item) return '';
    return i18n.language === 'te' ? item.name_te : item.name_en;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80';
    if (imagePath.startsWith('/uploads')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen relative overflow-hidden bg-dots">
      {/* Ambient background light blobs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-forest/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-wood/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Dashboard Header */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4 z-10">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-slate-550 text-sm mt-1">Manage designs, categories, and client inquiry requests</p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => {
              handleCategoryCancel();
              let defaultType = 'interior';
              if (['interior', 'electrical', 'lighting'].includes(activeTab)) {
                defaultType = activeTab;
              } else if (activeTab === 'categories' && ['interior', 'electrical', 'lighting'].includes(activeCategoryTab)) {
                defaultType = activeCategoryTab;
              }
              setCatWorkType(defaultType);
              setShowCategoryForm(true);
              setShowDesignForm(false);
              setShowTeamForm(false);
            }}
            className="bg-white border border-slate-200 hover:border-slate-350 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <FolderPlus className="w-4 h-4 text-wood" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => {
              setShowTeamForm(true);
              setShowDesignForm(false);
              setShowCategoryForm(false);
            }}
            className="bg-white border border-slate-200 hover:border-slate-350 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-forest" />
            <span>Add Team Member</span>
          </button>
          
          <button
            onClick={() => {
              handleDesignCancel();
              setDesignWorkType(
                activeTab === 'electrical' ? 'electrical' :
                activeTab === 'lighting' ? 'lighting' : 'interior'
              );
              setShowDesignForm(true);
              setEditingDesign(null);
              setShowCategoryForm(false);
              setShowTeamForm(false);
            }}
            className="bg-forest hover:bg-forest-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-forest/15 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'electrical' ? 'Add Electrical Work' :
               activeTab === 'lighting' ? 'Add Lighting Work' :
               'Add Interior Work'}
            </span>
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback.message && (
        <div className={`p-4 rounded-xl text-sm font-semibold border flex items-center justify-between animate-fade-in z-10 relative ${
          feedback.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="text-current hover:opacity-80 transition-opacity font-bold p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        <div className="glass-card p-5 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-4 hover:scale-[1.02] transition-premium">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-slate-450 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">Total Designs</span>
            <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-outfit">{designs.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-4 hover:scale-[1.02] transition-premium">
          <div className="p-3 bg-forest/10 rounded-xl text-forest">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-450 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">Categories</span>
            <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-outfit">{categories.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-4 hover:scale-[1.02] transition-premium">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-450 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">Inquiries</span>
            <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-outfit">
              {inquiries.filter(i => !i.replied).length} <span className="text-xs text-slate-400 font-semibold">pending</span>
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-4 hover:scale-[1.02] transition-premium">
          <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-450 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">Team Members</span>
            <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-outfit">{teamMembers.length}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex gap-x-6 gap-y-2 border-b border-slate-200 pb-px overflow-x-auto scrollbar-hide relative z-10">
        <button
          onClick={() => { setActiveTab('interior'); handleDesignCancel(); setShowCategoryForm(false); setShowTeamForm(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-1 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'interior' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Home className="w-4 h-4 text-amber-500" />
          <span>Interior ({designs.filter(d => d.workType === 'interior' || !d.workType).length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('electrical'); handleDesignCancel(); setShowCategoryForm(false); setShowTeamForm(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-1 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'electrical' ? 'border-yellow-500 text-yellow-605' : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Zap className="w-4 h-4 text-yellow-550" />
          <span>Electrical ({designs.filter(d => d.workType === 'electrical').length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('lighting'); handleDesignCancel(); setShowCategoryForm(false); setShowTeamForm(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-1 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'lighting' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Sun className="w-4 h-4 text-blue-500" />
          <span>Lighting ({designs.filter(d => d.workType === 'lighting').length})</span>
        </button>

        <span className="border-l border-slate-200 my-2 self-stretch"></span>

        <button
          onClick={() => { setActiveTab('team'); handleDesignCancel(); setShowCategoryForm(false); setShowTeamForm(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-1 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'team' ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Users className="w-4 h-4 text-forest" />
          <span>Our Team ({teamMembers.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('categories'); handleDesignCancel(); setShowCategoryForm(false); setShowTeamForm(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-1 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'categories' ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-wood" />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('inquiries'); handleDesignCancel(); setShowCategoryForm(false); setShowTeamForm(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-1 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'inquiries' ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Mail className="w-4 h-4 text-blue-550" />
          <span>Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* Team Member Creation/Edit Form Modal */}
      <AnimatePresence>
        {showTeamForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-5">
                <h2 className="font-outfit font-extrabold text-lg text-slate-900">
                  {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
                </h2>
                <button onClick={handleTeamCancel} className="text-slate-400 hover:text-slate-655 p-1 rounded-lg hover:bg-slate-50 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTeamSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Raja Sekhar"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Experience (e.g. 15+ Years)</label>
                    <input
                      type="text"
                      value={teamExp}
                      onChange={(e) => setTeamExp(e.target.value)}
                      placeholder="e.g. 15+ Years"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Role / Designation (English)</label>
                    <input
                      type="text"
                      value={teamRole}
                      onChange={(e) => setTeamRole(e.target.value)}
                      onBlur={(e) => { if (!teamRoleTe.trim()) translateText(e.target.value, setTeamRoleTe, 'teamRole'); }}
                      placeholder="e.g. Chief Architect"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600">Role / Designation (Telugu)</label>
                      <button
                        type="button"
                        onClick={() => translateText(teamRole, setTeamRoleTe, 'teamRole')}
                        disabled={translatingFields['teamRole']}
                        className="text-[10px] font-bold text-forest hover:text-forest-dark transition-smooth hover:underline disabled:opacity-50"
                      >
                        {translatingFields['teamRole'] ? 'Translating...' : '✨ Auto-Translate'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={teamRoleTe}
                      onChange={(e) => setTeamRoleTe(e.target.value)}
                      placeholder="ఉదా: ప్రధాన ఆర్కిటెక్ట్"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Portrait Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-xl px-4 py-6 text-center text-slate-500 text-xs flex flex-col items-center gap-1.5 w-full bg-slate-50/30 transition-all">
                      <Upload className="w-6 h-6 text-slate-400" />
                      <span className="font-semibold text-slate-700">Choose portrait photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTeamFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {teamFile && (
                      <div className="text-xs space-y-1 shrink-0 p-3 border border-slate-200 rounded-xl bg-slate-50 shadow-inner">
                        <span className="font-bold text-slate-900 block truncate max-w-[8rem]">{teamFile.name}</span>
                        <span className="text-slate-450 block">{(teamFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleTeamCancel}
                    className="bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-forest hover:bg-forest-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-smooth hover:scale-[1.02] active:scale-95"
                  >
                    {actionLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Team Member</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Creation Form Modal */}
      <AnimatePresence>
        {showCategoryForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-5">
                <h2 className="font-outfit font-extrabold text-lg text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={handleCategoryCancel} className="text-slate-400 hover:text-slate-655 p-1 rounded-lg hover:bg-slate-50 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Category Name (English)</label>
                    <input
                      type="text"
                      value={catNameEn}
                      onChange={(e) => setCatNameEn(e.target.value)}
                      onBlur={(e) => { if (!catNameTe.trim()) translateText(e.target.value, setCatNameTe, 'categoryName'); }}
                      placeholder="e.g. Modular Kitchen"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600">Category Name (Telugu)</label>
                      <button
                        type="button"
                        onClick={() => translateText(catNameEn, setCatNameTe, 'categoryName')}
                        disabled={translatingFields['categoryName']}
                        className="text-[10px] font-bold text-forest hover:text-forest-dark transition-smooth hover:underline disabled:opacity-50"
                      >
                        {translatingFields['categoryName'] ? 'Translating...' : '✨ Auto-Translate'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={catNameTe}
                      onChange={(e) => setCatNameTe(e.target.value)}
                      placeholder="ఉదా: మోడ్యులర్ కిచెన్"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Work Division Type</label>
                  <select
                    value={catWorkType}
                    onChange={(e) => setCatWorkType(e.target.value)}
                    className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth cursor-pointer"
                  >
                    <option value="interior">🏠 Interior Works</option>
                    <option value="electrical">⚡ Electrical Works</option>
                    <option value="lighting">💡 Lighting Works</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Cover Banner Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-xl px-4 py-6 text-center text-slate-500 text-xs flex flex-col items-center gap-1.5 w-full bg-slate-50/30 transition-all">
                      <Upload className="w-6 h-6 text-slate-400" />
                      <span className="font-semibold text-slate-700">Choose banner photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCatFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {catFile && (
                      <div className="text-xs space-y-1 shrink-0 p-3 border border-slate-200 rounded-xl bg-slate-50 shadow-inner">
                        <span className="font-bold text-slate-900 block truncate max-w-[8rem]">{catFile.name}</span>
                        <span className="text-slate-450 block">{(catFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCategoryCancel}
                    className="bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-forest hover:bg-forest-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-smooth hover:scale-[1.02] active:scale-95"
                  >
                    {actionLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Design Creation & Edit Form Modal */}
      <AnimatePresence>
        {showDesignForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-4xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-5">
                <h2 className="font-outfit font-extrabold text-lg text-slate-900">
                  {editingDesign ? `Edit Design (${editingDesign.designId})` : 'Create New Design Portfolio'}
                </h2>
                <button onClick={handleDesignCancel} className="text-slate-400 hover:text-slate-655 p-1 rounded-lg hover:bg-slate-50 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDesignSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Titles */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Design Title (English)</label>
                    <input
                      type="text"
                      value={designTitleEn}
                      onChange={(e) => setDesignTitleEn(e.target.value)}
                      onBlur={(e) => { if (!designTitleTe.trim()) translateText(e.target.value, setDesignTitleTe, 'designTitle'); }}
                      placeholder="e.g. Modern TV unit with backlights"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600">Design Title (Telugu)</label>
                      <button
                        type="button"
                        onClick={() => translateText(designTitleEn, setDesignTitleTe, 'designTitle')}
                        disabled={translatingFields['designTitle']}
                        className="text-[10px] font-bold text-forest hover:text-forest-dark transition-smooth hover:underline disabled:opacity-50"
                      >
                        {translatingFields['designTitle'] ? 'Translating...' : '✨ Auto-Translate'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={designTitleTe}
                      onChange={(e) => setDesignTitleTe(e.target.value)}
                      placeholder="e.g. బ్యాక్‌లైట్‌లతో కూడిన ఆధునిక టీవీ యూనిట్"
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Category</label>
                    <select
                      value={designCategory}
                      onChange={(e) => setDesignCategory(e.target.value)}
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth cursor-pointer"
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories
                        .filter(cat => cat.workType === designWorkType)
                        .map(cat => (
                          <option key={cat._id} value={cat._id}>{getLocalizedName(cat)}</option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Work Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Work Type</label>
                    <select
                      value={designWorkType}
                      onChange={(e) => {
                        setDesignWorkType(e.target.value);
                        setDesignCategory('');
                      }}
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth cursor-pointer"
                    >
                      <option value="interior">🏠 Interior Works</option>
                      <option value="electrical">⚡ Electrical Works</option>
                      <option value="lighting">💡 Lighting Works</option>
                    </select>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Description (English)</label>
                    <textarea
                      value={designDescEn}
                      onChange={(e) => setDesignDescEn(e.target.value)}
                      onBlur={(e) => { if (!designDescTe.trim()) translateText(e.target.value, setDesignDescTe, 'designDesc'); }}
                      rows="4"
                      placeholder="Describe design features, materials, custom specs, etc."
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600">Description (Telugu)</label>
                      <button
                        type="button"
                        onClick={() => translateText(designDescEn, setDesignDescTe, 'designDesc')}
                        disabled={translatingFields['designDesc']}
                        className="text-[10px] font-bold text-forest hover:text-forest-dark transition-smooth hover:underline disabled:opacity-50"
                      >
                        {translatingFields['designDesc'] ? 'Translating...' : '✨ Auto-Translate'}
                      </button>
                    </div>
                    <textarea
                      value={designDescTe}
                      onChange={(e) => setDesignDescTe(e.target.value)}
                      rows="4"
                      placeholder="డిజైన్ లక్షణాలు, ముగింపులు, ఇతర సమాచారం..."
                      className="w-full bg-slate-50/50 focus:bg-white text-slate-800 text-sm p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 focus:shadow-md transition-smooth resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Image Files Uploader */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-600 block">Design Images (Upload Multiple)</label>
                  
                  {/* Existing Images Display */}
                  {editingDesign && existingImagesToKeep.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs text-slate-450 font-bold uppercase tracking-wider block">Keep current images:</span>
                      <div className="flex flex-wrap gap-3">
                        {existingImagesToKeep.map((imgUrl, idx) => (
                          <div key={idx} className="relative w-20 h-16 rounded-xl overflow-hidden group shadow-sm border border-slate-250">
                            <img src={imgUrl} alt="Existing" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(idx)}
                              className="absolute inset-0 bg-red-655/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all p-1 animate-fade-in"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-xl px-4 py-8 text-center text-slate-550 text-xs flex flex-col items-center gap-2 w-full bg-slate-50/30 transition-all">
                      <Upload className="w-6 h-6 text-slate-400" />
                      <span className="font-semibold text-slate-700">Drag & Drop or Choose Image Files</span>
                      <span className="text-[10px] text-slate-450">Supports multiple JPG, PNG, WEBP files</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setDesignFiles(Array.from(e.target.files))}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Selected Files preview */}
                  {designFiles.length > 0 && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-2 shadow-inner">
                      <span className="text-xs font-bold text-slate-800 block">Selected Files to upload:</span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {designFiles.map((f, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span className="truncate max-w-[20rem] font-medium">{f.name}</span>
                            <span className="text-slate-450">{(f.size / 1024).toFixed(1)} KB</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Depth Map Status & Preview */}
                  {(depthMapBase64 || depthMapLoading) && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-inner">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Sparkles className="w-4 h-4 text-wood" />
                        <span>AI Depth Estimation Model</span>
                      </div>
                      {depthMapLoading ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Loader className="w-3.5 h-3.5 animate-spin text-wood" />
                          <span>Generating luminance depth map...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="w-24 h-18 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                            {designFiles.length > 0 && (
                              <img 
                                src={URL.createObjectURL(designFiles[0])} 
                                alt="Original Preview" 
                                className="w-full h-full object-cover" 
                              />
                            )}
                          </div>
                          <div className="text-slate-350 font-bold">&rarr;</div>
                          <div className="w-24 h-18 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative">
                            <img 
                              src={depthMapBase64} 
                              alt="AI Depth Map" 
                              className="w-full h-full object-cover filter brightness-110" 
                            />
                            <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[7px] text-wood-light font-extrabold uppercase">
                              Depth Map
                            </span>
                          </div>
                          <div className="text-xs text-slate-550 max-w-xs leading-normal">
                            <strong>AI Integration:</strong> A grayscale heightmap has been computed. This will be stored in MongoDB and served to render the 4D parallax depth effect.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={handleDesignCancel}
                    className="bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-smooth"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-forest hover:bg-forest-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-smooth hover:scale-[1.02] active:scale-95"
                  >
                    {actionLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{editingDesign ? 'Update Design' : 'Create Design'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Work Portfolio Listing — shared across interior / electrical / lighting tabs */}
      {(activeTab === 'interior' || activeTab === 'electrical' || activeTab === 'lighting') && (() => {
        const typeMap = {
          interior: { label: '🏠 Interior Works', emptyMsg: "No Interior Works yet. Click 'Add Interior Work' to begin.", filterFn: (d) => d.workType === 'interior' || !d.workType },
          electrical: { label: '⚡ Electrical Works', emptyMsg: "No Electrical Works yet. Click 'Add Electrical Work' to begin.", filterFn: (d) => d.workType === 'electrical' },
          lighting: { label: '💡 Lighting Works', emptyMsg: "No Lighting Works yet. Click 'Add Lighting Work' to begin.", filterFn: (d) => d.workType === 'lighting' },
        };
        const { label, emptyMsg, filterFn } = typeMap[activeTab];
        const filtered = designs.filter(filterFn);

        return (
          <div className="glass-card rounded-3xl border border-slate-100 shadow-premium overflow-hidden relative z-10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-outfit font-extrabold text-lg text-slate-900">{label}</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">{filtered.length} Entries</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-wood" />
                <span>Loading records...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400 italic">{emptyMsg}</div>
            ) : (
              <>
                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-5">ID</th>
                        <th className="p-5">Preview</th>
                        <th className="p-5">Title (English)</th>
                        <th className="p-5">Category</th>
                        <th className="p-5">Images</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filtered.map((design) => (
                        <tr key={design._id} className="hover:bg-slate-50/40 transition-smooth">
                          <td className="p-5 font-extrabold text-slate-900">{design.designId}</td>
                          <td className="p-5">
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                              <img
                                src={design.images[0] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=80&q=80'}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-5 font-semibold text-slate-900">{design.title_en}</td>
                          <td className="p-5">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100/80 text-slate-655 border border-slate-150">
                              {design.category ? getLocalizedName(design.category) : 'Unassigned'}
                            </span>
                          </td>
                          <td className="p-5 text-xs text-slate-500 font-bold">{design.images?.length || 0} images</td>
                          <td className="p-5 text-right space-x-1">
                            <button
                              onClick={() => handleEditInit(design)}
                              className="p-2 rounded-lg text-slate-400 hover:text-wood hover:bg-wood/10 transition-all inline-flex"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDesignDelete(design._id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/10 transition-all inline-flex"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (Card List) */}
                <div className="md:hidden divide-y divide-slate-100">
                  {filtered.map((design) => (
                    <div key={design._id} className="p-5 flex gap-4 hover:bg-slate-50/40 transition-smooth">
                      <div className="w-20 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                        <img
                          src={design.images[0] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=80&q=80'}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow space-y-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-extrabold text-forest">{design.designId}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 truncate max-w-[8rem]">
                            {design.category ? getLocalizedName(design.category) : 'Unassigned'}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm truncate">{design.title_en}</h3>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-450 font-bold">{design.images?.length || 0} images</span>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => handleEditInit(design)}
                              className="p-2 rounded-lg text-slate-500 hover:text-wood hover:bg-wood/10 transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDesignDelete(design._id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50/10 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* Team Members Listing */}
      {activeTab === 'team' && (
        <div className="glass-card rounded-3xl border border-slate-100 shadow-premium overflow-hidden relative z-10">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-outfit font-extrabold text-lg text-slate-900">Meet Our Team Members</h2>
            <span className="text-xs bg-slate-100 text-slate-655 px-3 py-1 rounded-full font-bold">{teamMembers.length} Members</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 animate-spin text-wood" />
              <span>Loading database records...</span>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic">
              No team members found. Click 'Add Team Member' to begin.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-5">Photo</th>
                      <th className="p-5">Name</th>
                      <th className="p-5">Role (English)</th>
                      <th className="p-5">Role (Telugu)</th>
                      <th className="p-5">Experience</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {teamMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-slate-50/40 transition-smooth">
                        <td className="p-5">
                          <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img 
                              src={getImageUrl(member.image)} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-5 font-bold text-slate-900">{member.name}</td>
                        <td className="p-5 font-semibold text-slate-800">{member.role}</td>
                        <td className="p-5 font-medium text-slate-550">{member.role_te}</td>
                        <td className="p-5 text-xs text-slate-450 font-bold">{member.exp}</td>
                        <td className="p-5 text-right space-x-1">
                          <button
                            onClick={() => handleTeamEdit(member)}
                            className="p-2 rounded-lg text-slate-400 hover:text-wood hover:bg-wood/10 transition-all inline-flex"
                            title="Edit team member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTeamDelete(member._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-55/10 transition-all inline-flex"
                            title="Delete team member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-slate-100">
                {teamMembers.map((member) => (
                  <div key={member._id} className="p-5 flex gap-4 hover:bg-slate-50/40 transition-smooth">
                    <div className="w-14 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                      <img 
                        src={getImageUrl(member.image)} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{member.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-slate-105 text-slate-655 text-[9px] font-extrabold uppercase shrink-0">
                          {member.exp}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{member.role}</p>
                      <p className="text-[10px] text-slate-450 italic truncate">{member.role_te}</p>
                      
                      <div className="flex justify-end gap-1 pt-1.5">
                        <button
                          onClick={() => handleTeamEdit(member)}
                          className="p-2 rounded-lg text-slate-500 hover:text-wood hover:bg-wood/10 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTeamDelete(member._id)}
                          className="p-2 rounded-lg text-slate-550 hover:text-red-500 hover:bg-red-50/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Categories Listing */}
      {activeTab === 'categories' && (() => {
        const filteredCategories = categories.filter(cat => {
          if (activeCategoryTab === 'all') return true;
          return cat.workType === activeCategoryTab;
        });

        return (
          <div className="glass-card rounded-3xl border border-slate-100 shadow-premium overflow-hidden relative z-10">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-outfit font-extrabold text-lg text-slate-900">Manage Design Categories</h2>
                <p className="text-slate-450 text-xs mt-1">Showing {filteredCategories.length} categories</p>
              </div>

              {/* Sub-tabs for filtering categories */}
              <div className="flex flex-wrap gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {['all', 'interior', 'electrical', 'lighting'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveCategoryTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCategoryTab === t
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-150'
                        : 'text-slate-550 hover:text-slate-900'
                    }`}
                  >
                    {t === 'all' ? '🌐 All' : t === 'interior' ? '🏠 Interior' : t === 'electrical' ? '⚡ Electrical' : '💡 Lighting'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-wood" />
                <span>Loading database records...</span>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-12 text-center text-slate-400 italic">
                No categories found matching this filter. Click 'Add Category' to create one.
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-5">Cover Photo</th>
                        <th className="p-5">English Name</th>
                        <th className="p-5">Telugu Name</th>
                        <th className="p-5">Work Type</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredCategories.map((cat) => (
                        <tr key={cat._id} className="hover:bg-slate-50/40 transition-smooth">
                          <td className="p-5">
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                              <img 
                                src={getImageUrl(cat.image)} 
                                alt={cat.name_en} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-5 font-bold text-slate-900">{cat.name_en}</td>
                          <td className="p-5 font-medium text-slate-700">{cat.name_te}</td>
                          <td className="p-5">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              cat.workType === 'electrical' ? 'bg-yellow-50 text-yellow-750 border-yellow-205' :
                              cat.workType === 'lighting' ? 'bg-blue-50 text-blue-755 border-blue-205' :
                              'bg-amber-50 text-amber-750 border-amber-205'
                            }`}>
                              {cat.workType === 'electrical' ? '⚡ Electrical' :
                               cat.workType === 'lighting' ? '💡 Lighting' :
                               '🏠 Interior'}
                            </span>
                          </td>
                          <td className="p-5 text-right space-x-1">
                            <button
                              onClick={() => handleCategoryEdit(cat)}
                              className="p-2 rounded-lg text-slate-400 hover:text-forest hover:bg-forest-light/10 transition-all inline-flex"
                              title="Edit category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(cat._id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-505 hover:bg-red-55/10 transition-all inline-flex"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden divide-y divide-slate-100">
                  {filteredCategories.map((cat) => (
                    <div key={cat._id} className="p-5 flex gap-4 hover:bg-slate-50/40 transition-smooth">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-205 shrink-0 bg-slate-50">
                        <img 
                          src={getImageUrl(cat.image)} 
                          alt={cat.name_en} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow space-y-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{cat.name_en}</h3>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                            cat.workType === 'electrical' ? 'bg-yellow-100 text-yellow-805' :
                            cat.workType === 'lighting' ? 'bg-blue-100 text-blue-805' :
                            'bg-amber-100 text-amber-805'
                          }`}>
                            {cat.workType === 'electrical' ? 'Electrical' :
                             cat.workType === 'lighting' ? 'Lighting' :
                             'Interior'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-455 truncate">{cat.name_te}</p>
                        
                        <div className="flex justify-end gap-1 pt-1">
                          <button
                            onClick={() => handleCategoryEdit(cat)}
                            className="p-2 rounded-lg text-slate-500 hover:text-wood hover:bg-wood/10 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(cat._id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* Inquiries Tab Panel */}
      {activeTab === 'inquiries' && (
        <div className="glass-card rounded-3xl border border-slate-100 shadow-premium overflow-hidden relative z-10">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-outfit font-extrabold text-lg text-slate-900">Contact Inquiries</h2>
            <span className="text-xs bg-slate-100 text-slate-655 px-3 py-1 rounded-full font-bold">{inquiries.length} Messages</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 animate-spin text-wood" />
              <span>Loading inquiries...</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic">
              No contact inquiries yet. Customers can submit messages from the Contact page.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inquiries.map((inq) => (
                <div key={inq._id} className={`p-6 flex flex-col md:flex-row md:items-start gap-5 transition-smooth ${inq.replied ? 'bg-slate-50/10' : 'bg-white'}`}>
                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      inq.replied 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {inq.replied ? '✓ Replied' : '● Pending'}
                    </span>
                  </div>

                  {/* Inquiry details */}
                  <div className="flex-grow space-y-3 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                      <div><span className="font-bold text-slate-500">Name:</span> <span className="text-slate-800 font-semibold">{inq.name}</span></div>
                      <div>
                        <span className="font-bold text-slate-500">Phone:</span>{' '}
                        <a href={`tel:${inq.phone}`} className="text-forest hover:underline font-semibold" title="Click to call mobile number">
                          {inq.phone}
                        </a>
                      </div>
                      <div className="truncate"><span className="font-bold text-slate-500">Email:</span> <span className="text-slate-800 font-semibold">{inq.email}</span></div>
                      <div><span className="font-bold text-slate-500">Service:</span> <span className="text-slate-850 font-bold capitalize">{inq.service}</span></div>
                    </div>
                    
                    <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-xl p-4 border border-slate-100 shadow-sm whitespace-pre-wrap">
                      {inq.message}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
                      Received: {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="shrink-0 flex md:flex-col gap-2.5 self-end md:self-start">
                    <a
                      href={`tel:${inq.phone}`}
                      className="p-2.5 rounded-xl border border-slate-205 text-slate-600 hover:text-forest hover:bg-forest/10 hover:border-forest/20 transition-all inline-flex items-center justify-center bg-white shadow-sm"
                      title="Call User"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href={getWhatsAppLink(inq.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-205 text-slate-600 hover:text-whatsapp hover:bg-whatsapp/10 hover:border-whatsapp/20 transition-all inline-flex items-center justify-center bg-white shadow-sm"
                      title="WhatsApp User"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    {!inq.replied && (
                      <button
                        onClick={() => handleInquiryReply(inq._id)}
                        className="p-2.5 rounded-xl border border-slate-205 text-slate-605 hover:text-green-600 hover:bg-green-50 hover:border-green-200 transition-all inline-flex items-center justify-center bg-white shadow-sm"
                        title="Mark as Replied"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleInquiryDelete(inq._id)}
                      className="p-2.5 rounded-xl border border-slate-205 text-slate-655 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all inline-flex items-center justify-center bg-white shadow-sm"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
