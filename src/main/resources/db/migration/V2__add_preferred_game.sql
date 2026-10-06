-- Add preferred_game column and remove phone/confirmed columns

ALTER TABLE participant ADD COLUMN preferred_game VARCHAR(100);
ALTER TABLE participant DROP COLUMN IF EXISTS phone;
ALTER TABLE participant DROP COLUMN IF EXISTS confirmed;
