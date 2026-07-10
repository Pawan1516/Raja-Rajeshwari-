/**
 * Fetch one representative Pixabay image URL per category.
 * Usage: node scripts/fetch-pixabay-images.mjs
 * Requires: PIXABAY_API_KEY in environment, or pass as first arg.
 *
 * Falls back to Pixabay free key demo endpoint.
 */

const API_KEY = process.argv[2] || process.env.PIXABAY_API_KEY || '47366424-f4f5d3e3a02c89c2f7b1d9a6f'; // replace with your key

const categories = [
  // Interior Works
  { id: 'cat_living_room',          q: 'luxury modern living room sofa LED lighting' },
  { id: 'cat_modular_kitchen',      q: 'modern modular kitchen white cabinets' },
  { id: 'cat_bedroom',              q: 'luxury bedroom king size bed wooden wall panel' },
  { id: 'cat_dining_room',          q: 'modern dining room pendant lights wooden flooring' },
  { id: 'cat_false_ceiling',        q: 'gypsum false ceiling design cove LED strip' },
  { id: 'cat_tv_unit',              q: 'modern TV unit wooden panel floating shelves LED' },
  { id: 'cat_wardrobe',             q: 'modern wardrobe sliding doors mirror modular' },
  { id: 'cat_office_interior',      q: 'modern office interior design workstations' },
  { id: 'cat_commercial_interior',  q: 'luxury showroom interior display shelves' },
  { id: 'cat_restaurant_cafe',      q: 'cozy modern cafe interior design' },
  { id: 'cat_pooja_room',           q: 'modern pooja room mandir wooden marble design' },
  { id: 'cat_bathroom',             q: 'luxury bathroom design marble vanity mirror' },
  // Electrical Works
  { id: 'cat_wiring',               q: 'electrician installing home wiring switchboard' },
  { id: 'cat_commercial_electrical',q: 'commercial office electrical panel wiring' },
  { id: 'cat_industrial_electrical',q: 'industrial electrical control panel equipment' },
  { id: 'cat_panel_board',          q: 'electrical distribution panel circuit breakers' },
  { id: 'cat_generator',            q: 'commercial generator installation outdoor' },
  { id: 'cat_inverter',             q: 'home inverter battery system installation' },
  { id: 'cat_automation',           q: 'smart home wall switch panel touch' },
  { id: 'cat_cctv',                 q: 'professional CCTV camera installation building' },
  { id: 'cat_fire_alarm',           q: 'commercial fire alarm detection panel' },
  { id: 'cat_network_cabling',      q: 'structured network cabling server room' },
  { id: 'cat_solar_electrical',     q: 'solar panel installation rooftop electrical' },
  { id: 'cat_electrical_maintenance',q: 'electrician testing maintenance equipment' },
  // Lighting Solutions
  { id: 'cat_decorative_lighting',  q: 'luxury decorative lighting living space interior' },
  { id: 'cat_led_ceiling',          q: 'LED strip false ceiling lighting design' },
  { id: 'cat_chandeliers',          q: 'large crystal chandelier luxury interior' },
  { id: 'cat_pendant_lighting',     q: 'modern pendant lights above dining table' },
  { id: 'cat_wall_lighting',        q: 'decorative wall mounted lights interior' },
  { id: 'cat_cove_lighting',        q: 'hidden cove LED lighting ceiling' },
  { id: 'cat_landscape_lighting',   q: 'garden pathway lighting night landscape' },
  { id: 'cat_facade_lighting',      q: 'architectural building facade lighting exterior night' },
  { id: 'cat_office_lighting',      q: 'professional office ceiling lighting design' },
  { id: 'cat_retail_lighting',      q: 'retail store display accent lighting' },
  { id: 'cat_street_lighting',      q: 'LED street lights urban road night' },
  { id: 'cat_smart_lighting_systems',q: 'smart lighting app controlled home' },
];

async function fetchImage(q) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&min_width=800`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗ HTTP ${res.status} for query: ${q}`);
    return null;
  }
  const data = await res.json();
  if (data.hits && data.hits.length > 0) {
    // prefer largeImageURL, fall back to webformatURL
    const hit = data.hits[0];
    return hit.largeImageURL || hit.webformatURL;
  }
  console.error(`  ✗ No results for query: ${q}`);
  return null;
}

async function main() {
  console.log('Fetching Pixabay images for all 36 categories...\n');
  const results = [];
  for (const cat of categories) {
    process.stdout.write(`  [${cat.id}] "${cat.q}" ... `);
    try {
      const url = await fetchImage(cat.q);
      if (url) {
        console.log('✓');
        results.push({ id: cat.id, q: cat.q, url });
      } else {
        results.push({ id: cat.id, q: cat.q, url: null });
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      results.push({ id: cat.id, q: cat.q, url: null });
    }
    // Pixabay rate limit: ~100 req/min — add small delay
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n=== RESULTS ===\n');
  results.forEach(r => {
    console.log(`${r.id}: ${r.url || 'FAILED'}`);
  });

  // Output as JS object for easy copy-paste
  console.log('\n=== JS MAP ===\n');
  console.log('const pixabayImages = {');
  results.forEach(r => {
    console.log(`  "${r.id}": "${r.url || ''}",`);
  });
  console.log('};');
}

main().catch(console.error);
