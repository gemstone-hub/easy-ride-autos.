-- SAFE SCHEMA UPDATE SCRIPT
-- This script uses IF NOT EXISTS to avoid errors if some tables already exist.

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS safely
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'profiles' AND n.nspname = 'public' AND c.relrowsecurity = true) THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policies safely (dropping first to ensure they are updated)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  price TEXT,
  year TEXT,
  transmission TEXT,
  mileage TEXT,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Incoming', 'Sold')),
  image TEXT,
  description TEXT,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cars are viewable by everyone." ON public.cars;
CREATE POLICY "Cars are viewable by everyone." ON public.cars FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify car data." ON public.cars;
CREATE POLICY "Only admins can modify car data." ON public.cars FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() 
      AND public.profiles.role = 'admin'
    )
);

-- 3. Gallery table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  before_image TEXT,
  after_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery is viewable by everyone." ON public.gallery_items;
CREATE POLICY "Gallery is viewable by everyone." ON public.gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify gallery items." ON public.gallery_items;
CREATE POLICY "Only admins can modify gallery items." ON public.gallery_items FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() 
      AND public.profiles.role = 'admin'
    )
);

-- 4. Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit messages." ON public.contact_messages;
CREATE POLICY "Public can submit messages." ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can read messages." ON public.contact_messages;
CREATE POLICY "Only admins can read messages." ON public.contact_messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() 
      AND public.profiles.role = 'admin'
    )
);

-- 5. Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own favorites." ON public.favorites;
CREATE POLICY "Users can view their own favorites." ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites." ON public.favorites;
CREATE POLICY "Users can insert their own favorites." ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites." ON public.favorites;
CREATE POLICY "Users can delete their own favorites." ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- AUTOMATIC PROFILE CREATION: Create a profile whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
