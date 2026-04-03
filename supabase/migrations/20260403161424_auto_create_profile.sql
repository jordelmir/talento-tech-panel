-- ==============================================================================
-- TALENTO TECH - AUTO ONBOARDING (ELITE 1% ARCHITECTURE)
-- ==============================================================================

-- 1. Create Handle New User Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_institution_id UUID;
BEGIN
  -- Get or Create a default 'Unassigned' institution if needed,
  -- but for now we just link the profile.

  -- Insert into Profiles (Extracting metadata from GitHub/OAuth)
  INSERT INTO public.profiles (id, full_name, github_username, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Insert default role: 'student'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Trigger
-- This fires every time a new row is inserted into auth.users (Supabase Auth)
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for deletion (Optional but recommended for consistency)
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.user_roles WHERE user_id = old.id;
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();
