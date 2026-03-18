const supabaseUrl = 'https://mgjotyxijmhdhugwirim.supabase.co';
const supabaseAnonKey = 'sb_publishable_dkMbyWf7WbllhsT7-vadEw_byZtJnJu';

async function testFetch() {
  const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      name: 'Fetch Test',
      email: 'fetch@test.com',
      phone: '123456789',
      message: '[General Inquiry]\n\nTest message body'
    })
  });

  const responseText = await response.text();
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  console.log('Response:', responseText);
}

testFetch();
