-- Fix the should_update_cache function to properly handle timestamp arithmetic
CREATE OR REPLACE FUNCTION public.should_update_cache(cache_id text, interval_hours integer)
 RETURNS boolean
 LANGUAGE plpgsql
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