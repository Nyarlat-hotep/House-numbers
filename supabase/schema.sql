-- Config table (single row, stores starting appraisal)
CREATE TABLE config (
  id int PRIMARY KEY DEFAULT 1,
  initial_appraisal numeric NOT NULL DEFAULT 894000
);
INSERT INTO config (id, initial_appraisal) VALUES (1, 894000)
ON CONFLICT (id) DO NOTHING;

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  amount numeric NOT NULL,
  notes text,
  type text NOT NULL DEFAULT 'monthly' CHECK (type IN ('monthly', 'adhoc')),
  created_at timestamptz DEFAULT now()
);

-- Adjustments table (negative amounts = reductions to appraisal)
CREATE TABLE adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  amount numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Utilities reference table
CREATE TABLE utilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  monthly_cost numeric NOT NULL,
  notes text
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Allow full access via anon key
CREATE POLICY "anon_all" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON adjustments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON utilities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON config FOR ALL USING (true) WITH CHECK (true);
