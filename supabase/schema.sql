-- ==============================================================================
-- 🪔 MOTI ATYA COSTUME CORNER - SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  costume_id TEXT NOT NULL,
  costume_name TEXT NOT NULL,
  costume_image TEXT,
  category TEXT DEFAULT 'general',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_address TEXT DEFAULT '',
  delivery_type TEXT DEFAULT 'store-pickup',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER DEFAULT 1,
  daily_rate NUMERIC DEFAULT 0,
  rental_total NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 500,
  total_amount NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'razorpay',
  payment_status TEXT DEFAULT 'paid',
  payment_id TEXT,
  status TEXT DEFAULT 'confirmed', -- 'confirmed' | 'picked-up' | 'returned' | 'overdue' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT DEFAULT '',
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TEXT,
  id_proof_url TEXT,
  id_proof_type TEXT,
  agreement_accepted BOOLEAN DEFAULT TRUE,
  deposit_refunded NUMERIC DEFAULT 0,
  deposit_deduction NUMERIC DEFAULT 0,
  inspection_notes TEXT DEFAULT '',
  returned_at TIMESTAMPTZ
);

-- Index for date overlap search & customer phone
CREATE INDEX IF NOT EXISTS idx_bookings_costume_dates ON bookings (costume_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings (customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- 2. Create Inventory Overrides Table
CREATE TABLE IF NOT EXISTS inventory_overrides (
  costume_id TEXT PRIMARY KEY,
  price NUMERIC,
  security_deposit NUMERIC,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create SMS Logs Table
CREATE TABLE IF NOT EXISTS sms_logs (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'delivered',
  gateway TEXT DEFAULT 'simulator',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_booking ON sms_logs (booking_id);

-- 4. Create Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT DEFAULT 'Moti Atya Costume Corner',
  store_phone TEXT DEFAULT '+91 98201 23456',
  store_address TEXT DEFAULT 'Shop No. 4, Ground Floor, Royal Market, Mira Bhayandar, Mumbai 401107',
  default_security_deposit NUMERIC DEFAULT 500,
  razorpay_key_id TEXT DEFAULT 'rzp_test_MotiAtyaCostumes',
  razorpay_key_secret TEXT DEFAULT 'mock_secret_key_12345',
  razorpay_test_mode BOOLEAN DEFAULT TRUE,
  upi_id TEXT DEFAULT 'motiatya@okhdfcbank',
  sms_gateway TEXT DEFAULT 'simulator',
  fast2sms_api_key TEXT DEFAULT '',
  twilio_sid TEXT DEFAULT '',
  twilio_auth_token TEXT DEFAULT '',
  twilio_from_phone TEXT DEFAULT '',
  auto_reminders_enabled BOOLEAN DEFAULT TRUE,
  reminder_hours_before INTEGER DEFAULT 24,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert default settings row if not exists
INSERT INTO admin_settings (id, store_name, store_phone, store_address)
VALUES (
  'default',
  'Moti Atya Costume Corner',
  '+91 98201 23456',
  'Shop No. 4, Ground Floor, Royal Market, Mira Bhayandar, Mumbai 401107'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Disable Row Level Security (RLS) for serverless REST access, or enable public read/write
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_overrides DISABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
