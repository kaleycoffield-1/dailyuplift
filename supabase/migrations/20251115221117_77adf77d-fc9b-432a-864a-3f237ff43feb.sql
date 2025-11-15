-- Add enabled/disabled columns for notification times
ALTER TABLE public.users 
ADD COLUMN notification_morning_enabled boolean DEFAULT true,
ADD COLUMN notification_feelings_enabled boolean DEFAULT true,
ADD COLUMN notification_evening_enabled boolean DEFAULT true;