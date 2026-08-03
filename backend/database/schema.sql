-- ====================================================================
-- FounderOS Supabase PostgreSQL Database Schema
-- Tables: Organizations, Users, Customers, Meetings, Emails,
--         Slack_Messages, Tasks, Invoices, Chat_History, Integrations
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- Helper Trigger Function: Auto-update updated_at timestamp
-- ====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 1. ORGANIZATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    plan_tier VARCHAR(50) DEFAULT 'pro',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 2. USERS TABLE (Linked to Supabase Auth auth.users if available)
-- ====================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Supabase Auth reference (auth.users.id)
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'founder', -- 'founder', 'admin', 'member'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 3. CUSTOMERS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'at-risk', 'churned', 'prospect'
    mrr NUMERIC(12, 2) DEFAULT 0.00,
    last_contact_at TIMESTAMPTZ,
    replied BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 4. MEETINGS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    participant VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    meeting_time VARCHAR(100) NOT NULL, -- e.g. "10:00 AM - 10:45 AM"
    meeting_date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'customer', -- 'demo', 'investor', 'customer', 'team'
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 5. EMAILS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    sender VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    snippet TEXT,
    body TEXT,
    unread BOOLEAN DEFAULT true,
    needs_reply BOOLEAN DEFAULT false,
    days_unreplied INTEGER DEFAULT 0,
    received_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
CREATE TRIGGER update_emails_updated_at
    BEFORE UPDATE ON emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 6. SLACK_MESSAGES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS slack_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    channel VARCHAR(100) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    has_mention BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_slack_messages_updated_at ON slack_messages;
CREATE TRIGGER update_slack_messages_updated_at
    BEFORE UPDATE ON slack_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 7. TASKS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    completed BOOLEAN DEFAULT false,
    source_app VARCHAR(50) DEFAULT 'Notion', -- 'Linear', 'Jira', 'Notion', 'Gmail'
    assignee VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 8. INVOICES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'paid', 'overdue', 'pending'
    days_overdue INTEGER DEFAULT 0,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 9. CHAT_HISTORY TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT gen_random_uuid(),
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
    text TEXT NOT NULL,
    suggested_action JSONB, -- { label, actionType, targetId }
    data_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 10. INTEGRATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Slack", "Gmail", "Stripe", "Linear"
    category VARCHAR(100) NOT NULL, -- "Communication", "Finance", "DevOps"
    description TEXT,
    icon_name VARCHAR(100),
    connected BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'syncing'
    credentials JSONB, -- Encrypted connection tokens or parameters
    last_synced TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_org_integration UNIQUE (organization_id, name)
);

DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_customers_org ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_meetings_org ON meetings(organization_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_emails_org ON emails(organization_id);
CREATE INDEX IF NOT EXISTS idx_emails_unread ON emails(unread, needs_reply);
CREATE INDEX IF NOT EXISTS idx_slack_org ON slack_messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_chat_org_session ON chat_history(organization_id, session_id);
CREATE INDEX IF NOT EXISTS idx_integrations_org ON integrations(organization_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ====================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE slack_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Default Permissive Policy for Development Mode (Allows All Service/Anon Access)
DROP POLICY IF EXISTS "Public Read/Write for Organizations" ON organizations;
DROP POLICY IF EXISTS "Public Read/Write for Users" ON users;
DROP POLICY IF EXISTS "Public Read/Write for Customers" ON customers;
DROP POLICY IF EXISTS "Public Read/Write for Meetings" ON meetings;
DROP POLICY IF EXISTS "Public Read/Write for Emails" ON emails;
DROP POLICY IF EXISTS "Public Read/Write for Slack Messages" ON slack_messages;
DROP POLICY IF EXISTS "Public Read/Write for Tasks" ON tasks;
DROP POLICY IF EXISTS "Public Read/Write for Invoices" ON invoices;
DROP POLICY IF EXISTS "Public Read/Write for Chat History" ON chat_history;
DROP POLICY IF EXISTS "Public Read/Write for Integrations" ON integrations;

CREATE POLICY "Public Read/Write for Organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Users" ON users FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Customers" ON customers FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Meetings" ON meetings FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Emails" ON emails FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Slack Messages" ON slack_messages FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Chat History" ON chat_history FOR ALL USING (true);
CREATE POLICY "Public Read/Write for Integrations" ON integrations FOR ALL USING (true);
