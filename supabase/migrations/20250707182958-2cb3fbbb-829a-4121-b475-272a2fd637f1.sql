-- Fix the admin_add_event function to properly handle JSON data
CREATE OR REPLACE FUNCTION public.admin_add_event(event_data text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Parse the JSON string and insert the event data into the events table
  INSERT INTO public.events 
  SELECT * FROM jsonb_populate_record(null::public.events, event_data::jsonb);
END;
$function$;