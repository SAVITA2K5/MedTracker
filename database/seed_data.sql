-- Seed data for development/testing
-- Requires schema.sql to have been run first

INSERT INTO users (full_name, email, hashed_password, phone, gender, is_active)
VALUES
  ('Demo User', 'demo@medtrack.ai', '$2b$12$placeholder_hash', '+91-9000000000', 'Male', TRUE)
ON CONFLICT (email) DO NOTHING;
