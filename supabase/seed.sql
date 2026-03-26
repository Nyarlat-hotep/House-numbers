-- Seed payments
INSERT INTO payments (date, amount, type, notes) VALUES
  ('2024-06-01', 2000, 'monthly', NULL),
  ('2024-07-01', 2000, 'monthly', NULL),
  ('2024-08-01', 2000, 'monthly', NULL),
  ('2024-09-01', 2000, 'monthly', NULL),
  ('2024-10-01', 2000, 'monthly', NULL),
  ('2024-11-01', 2000, 'monthly', NULL),
  ('2024-12-01', 2000, 'monthly', NULL),
  ('2025-01-01', 2000, 'monthly', NULL),
  ('2025-02-01', 2000, 'monthly', NULL),
  ('2025-03-01', 2200, 'monthly', NULL),
  ('2025-04-01', 2200, 'monthly', NULL),
  ('2025-05-01', 2200, 'monthly', NULL),
  ('2025-06-01', 2200, 'monthly', NULL),
  ('2025-07-01', 2200, 'monthly', NULL),
  ('2025-08-01', 2200, 'monthly', NULL),
  ('2025-09-01', 2200, 'monthly', NULL),
  ('2025-10-01', 2200, 'monthly', NULL),
  ('2025-11-01', 2200, 'monthly', NULL),
  ('2025-12-01', 1800, 'monthly', NULL),
  ('2026-01-01', 1000, 'adhoc', 'Car port'),
  ('2026-02-01', 2200, 'monthly', NULL),
  ('2026-03-01', 2200, 'monthly', NULL);

-- Seed adjustments
INSERT INTO adjustments (date, amount, notes) VALUES
  ('2024-07-01', -204.00, 'Att bill Vietnam 2026'),
  ('2024-08-01', -92.00, 'Att bill Vietnam 2026'),
  ('2024-09-01', -800.00, 'Francisco payment corner house, roof 2026');

-- Seed utilities
INSERT INTO utilities (name, monthly_cost, notes) VALUES
  ('Internet', 232, NULL),
  ('Power', 248, NULL),
  ('Water', 20, NULL),
  ('Phones', 220, NULL),
  ('Green Heating', 275, 'per year');
