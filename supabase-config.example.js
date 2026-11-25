/* ========================================================
   SUPABASE CONFIGURATION TEMPLATE
   Copy this file to `supabase-config.local.js` and fill in
   your project values. Never commit `supabase-config.local.js`.
   ======================================================== */

const SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY"
};

if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
