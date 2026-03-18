const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgjotyxijmhdhugwirim.supabase.co';
const supabaseAnonKey = 'sb_publishable_dkMbyWf7WbllhsT7-vadEw_byZtJnJu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSubmit() {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      name: 'Test Name 2',
      email: 'testw@example.com',
      phone: '1234567890',
      message: 'Test Message 2'
    }]).select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testSubmit();
