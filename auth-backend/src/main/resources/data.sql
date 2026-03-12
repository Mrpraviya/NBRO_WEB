-- Seeded user: sahanrachintha@gmail.com
-- Default password: Nbro@2024 (BCrypt-encoded). This user must change their password on first login.
INSERT INTO users (id, email, password, role, created_at)
VALUES ('e0d90213-83bd-4a09-a0b2-3a50b2e64ec7', 'sahanrachintha@gmail.com', '$2b$10$tyP604CVV8fT711qCWe2j.h47qC7W17x1ir9tIyDJRY.SVOP7niZC', 'USER', NOW())
ON CONFLICT (email) DO NOTHING;
