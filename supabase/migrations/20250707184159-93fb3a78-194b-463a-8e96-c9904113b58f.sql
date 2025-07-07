-- Drop the existing admin_add_event functions to resolve overloading
DROP FUNCTION IF EXISTS public.admin_add_event(event_data jsonb);
DROP FUNCTION IF EXISTS public.admin_add_event(event_data text);

-- Create a single function that handles JSON data properly
CREATE OR REPLACE FUNCTION public.admin_add_event(event_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Insert the event data into the events table
  INSERT INTO public.events 
  SELECT * FROM jsonb_populate_record(null::public.events, event_data);
END;
$function$;