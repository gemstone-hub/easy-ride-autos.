-- Fix RLS policy to allow admins to send messages
-- Run this in your Supabase SQL Editor

begin;
  drop policy if exists "Users can insert their own chats" on public.chats;
  
  create policy "Anyone authorized can insert chats" on public.chats
    for insert with check (
      auth.uid() = user_id OR 
      exists (
        select 1 from public.profiles 
        where id = auth.uid() and role = 'admin'
      )
    );
commit;
