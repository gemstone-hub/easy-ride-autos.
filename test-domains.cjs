const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgjotyxijmhdhugwirim.supabase.co';
const supabaseAnonKey = 'sb_publishable_dkMbyWf7WbllhsT7-vadEw_byZtJnJu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDomains() {
  const { data: cars } = await supabase.from('cars').select('image');
  const { data: gallery } = await supabase.from('gallery_items').select('before_image, after_image');
  
  const urls = [
    ...(cars || []).map(c => c.image),
    ...(gallery || []).flatMap(g => [g.before_image, g.after_image])
  ].filter(u => u);

  const domains = [...new Set(urls.map(u => {
    try {
      return new URL(u).hostname;
    } catch {
      return null;
    }
  }).filter(Boolean))];

  console.log("Found domains:", domains);
}

checkDomains();
