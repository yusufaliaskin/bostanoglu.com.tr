
// --- Supabase Client Initialization ---
// Lütfen SUPABASE_SETUP.md dosyasındaki adımları tamamladıktan sonra
// aldığınız URL ve KEY değerlerini buraya yapıştırın.

const SUPABASE_URL = 'https://fjgltzlroqdxnvtedxnv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wXmo_aGrLQ_Bmqbg1jYueA_0HchBXa8';

// Initialize Client using the global 'supabase' library object
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Override the global 'supabase' variable with the initialized client instance
// This allows other scripts (admin.js, collections.js) to use 'supabase.from()' directly.
window.supabase = client;

console.log('Supabase Client Initialized');
