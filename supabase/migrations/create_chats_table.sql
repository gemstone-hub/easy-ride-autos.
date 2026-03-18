-- Create chats table for real-time messaging
create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  sender_role text check (sender_role in ('user', 'admin')) not null,
  content text not null,
  is_read boolean default false
);

-- Enable RLS
alter table public.chats enable row level security;

-- Policies
begin;
  drop policy if exists "Users can see their own chats" on public.chats;
  create policy "Users can see their own chats" on public.chats
    for select using (auth.uid() = user_id or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ));

  drop policy if exists "Users can insert their own chats" on public.chats;
  create policy "Users can insert their own chats" on public.chats
    for insert with check (auth.uid() = user_id);
commit;

-- Add realtime support (safe version using a PL/pgSQL DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'chats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping Realtime publication modification via SQL. Please enable Realtime for "chats" in the Supabase Dashboard -> Database -> Replication.';
END $$;
