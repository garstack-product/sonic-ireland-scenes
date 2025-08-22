-- Fix search_path warnings for existing SECURITY DEFINER functions
-- (Our has_role function already has SET search_path = public, pg_temp)

-- 1) Update admin_add_event function
CREATE OR REPLACE FUNCTION public.admin_add_event(event_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Insert the event data into the events table
  INSERT INTO public.events 
  SELECT * FROM jsonb_populate_record(null::public.events, event_data);
END;
$function$;

-- 2) Update update_cache_metadata function
CREATE OR REPLACE FUNCTION public.update_cache_metadata(cache_id text, source text, count integer DEFAULT 0, status text DEFAULT 'success'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Insert or update cache metadata
  INSERT INTO public.cache_metadata (id, last_updated, source, record_count, status)
  VALUES (cache_id, now(), source, count, status)
  ON CONFLICT (id) 
  DO UPDATE SET 
    last_updated = now(),
    source = EXCLUDED.source,
    record_count = EXCLUDED.count,
    status = EXCLUDED.status;
END;
$function$;

-- 3) Update should_update_cache function
CREATE OR REPLACE FUNCTION public.should_update_cache(cache_id text, interval_hours integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  last_updated TIMESTAMP WITH TIME ZONE;
  current_time TIMESTAMP WITH TIME ZONE := now();
  interval_threshold INTERVAL := (interval_hours || ' hours')::INTERVAL;
BEGIN
  -- Get the last updated timestamp
  SELECT cm.last_updated INTO last_updated
  FROM public.cache_metadata cm
  WHERE cm.id = cache_id;
  
  -- If no record exists or the update interval has passed, return true
  -- Fixed: Use proper timestamp comparison with INTERVAL arithmetic
  RETURN (last_updated IS NULL OR current_time > (last_updated + interval_threshold));
END;
$function$;