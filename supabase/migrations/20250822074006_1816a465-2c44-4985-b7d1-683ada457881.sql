-- Fix remaining SECURITY DEFINER functions

-- 1) Update set_featured_artist trigger function
CREATE OR REPLACE FUNCTION public.set_featured_artist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  featured_artists TEXT[] := ARRAY[
    'Anastacia',
    'Primal Scream',
    'Hozier',
    'U2'
    -- Your artists here
  ];
BEGIN
  IF NEW.artist = ANY(featured_artists) THEN
    NEW.is_featured := TRUE;
  END IF;
  RETURN NEW;
END;
$function$;

-- 2) Update hide_specific_events trigger function
CREATE OR REPLACE FUNCTION public.hide_specific_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Update for Park Entry tickets
  UPDATE events
  SET is_hidden = TRUE
  WHERE id = NEW.id AND title = 'Park Entry And Train Tickets';
  
  -- Update for GAA events
  UPDATE events
  SET is_hidden = TRUE
  WHERE id = NEW.id AND (genre = 'GAA' OR subgenre = 'GAA');
  
  RETURN NEW;
END;
$function$;

-- 3) Update delete_gaa_events trigger function
CREATE OR REPLACE FUNCTION public.delete_gaa_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  DELETE FROM events WHERE artist IN ('Bord Bia Bloom')
  AND id = NEW.id;
  
  RETURN NEW;
END;
$function$;

-- 4) Update delete_specific_title_events trigger function
CREATE OR REPLACE FUNCTION public.delete_specific_title_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  DELETE FROM events
  WHERE title IN ('Park Entry And Train Tickets', 'Joe''s Farm Easter Trail 2025')
  AND id = NEW.id;
  
  RETURN NEW;
END;
$function$;

-- 5) Update update_modified_timestamp trigger function  
CREATE OR REPLACE FUNCTION public.update_modified_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$function$;