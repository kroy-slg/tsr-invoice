/*
  # Invoice Generator Schema

  ## Overview
  Complete database schema for an invoice management system with clients, invoices, and line items.

  ## New Tables
  
  ### 1. clients
  Stores client/customer information
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Client/company name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `address` (text) - Street address
  - `city` (text) - City
  - `state` (text) - State/province
  - `zip` (text) - ZIP/postal code
  - `country` (text) - Country
  - `created_at` (timestamptz) - Record creation timestamp
  - `user_id` (uuid) - Owner of the client record

  ### 2. invoices
  Main invoice records
  - `id` (uuid, primary key) - Unique identifier
  - `invoice_number` (text, unique) - Human-readable invoice number
  - `client_id` (uuid, foreign key) - Reference to clients table
  - `issue_date` (date) - Date invoice was issued
  - `due_date` (date) - Payment due date
  - `status` (text) - Status: 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  - `subtotal` (decimal) - Sum before tax
  - `tax_rate` (decimal) - Tax percentage (e.g., 10 for 10%)
  - `tax_amount` (decimal) - Calculated tax amount
  - `total` (decimal) - Final amount due
  - `notes` (text) - Additional notes or terms
  - `created_at` (timestamptz) - Record creation timestamp
  - `user_id` (uuid) - Owner of the invoice

  ### 3. invoice_items
  Line items for each invoice
  - `id` (uuid, primary key) - Unique identifier
  - `invoice_id` (uuid, foreign key) - Reference to invoices table
  - `description` (text) - Item/service description
  - `quantity` (decimal) - Quantity of items
  - `rate` (decimal) - Price per unit
  - `amount` (decimal) - Calculated total (quantity × rate)
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own records
  - Policies for SELECT, INSERT, UPDATE, DELETE operations
  - All tables restricted to authenticated users only

  ## Important Notes
  1. All monetary values use decimal type for precision
  2. Invoice numbers are unique across the system
  3. Foreign keys ensure data integrity
  4. Cascading deletes remove related records when parent is deleted
  5. Default values prevent null issues in calculations
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  country text DEFAULT 'USA',
  created_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal decimal(10,2) DEFAULT 0,
  tax_rate decimal(5,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity decimal(10,2) DEFAULT 1,
  rate decimal(10,2) DEFAULT 0,
  amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Invoice items policies
CREATE POLICY "Users can view invoice items for own invoices"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create invoice items for own invoices"
  ON invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invoice items for own invoices"
  ON invoice_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete invoice items for own invoices"
  ON invoice_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);