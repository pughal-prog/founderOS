-- ====================================================================
-- FounderOS Supabase PostgreSQL Seed Data
-- Populate Organizations, Users, Customers, Meetings, Emails,
-- Slack_Messages, Tasks, Invoices, Chat_History, and Integrations
-- ====================================================================

DO $$
DECLARE
    org_id UUID;
    user_id UUID;
    cust1_id UUID;
    cust2_id UUID;
    cust3_id UUID;
BEGIN
    -- Clear existing demo data for clean re-seeding
    DELETE FROM chat_history;
    DELETE FROM tasks;
    DELETE FROM meetings;
    DELETE FROM emails;
    DELETE FROM slack_messages;
    DELETE FROM invoices;
    DELETE FROM integrations;
    DELETE FROM customers;
    DELETE FROM users;
    DELETE FROM organizations;

    -- 1. Insert Demo Organization
    INSERT INTO organizations (name, slug, domain, plan_tier)
    VALUES ('Acme Corp Startup', 'acme-corp', 'acme.io', 'pro')
    RETURNING id INTO org_id;

    -- 2. Insert Demo Founder User
    INSERT INTO users (organization_id, email, full_name, role)
    VALUES (org_id, 'founder@acme.io', 'Alex Mercer', 'founder')
    RETURNING id INTO user_id;

    -- 3. Insert Demo Customers
    INSERT INTO customers (organization_id, name, company, email, status, mrr, last_contact_at, replied, notes)
    VALUES
        (org_id, 'Sarah Jenkins', 'Acme Inc.', 'sarah@acme.com', 'at-risk', 4500.00, NOW() - INTERVAL '9 days', false, 'No reply for 9 days after security questionnaire sent.'),
        (org_id, 'Michael Chen', 'Starlight Labs', 'mchen@starlight.io', 'active', 12000.00, NOW() - INTERVAL '1 day', true, 'Upgraded to Enterprise tier last week.'),
        (org_id, 'Elena Rostova', 'Apex Cloud', 'elena@apexcloud.net', 'at-risk', 2800.00, NOW() - INTERVAL '14 days', false, 'Payment failed twice in Stripe. High churn risk.');

    SELECT id INTO cust1_id FROM customers WHERE email = 'sarah@acme.com' LIMIT 1;
    SELECT id INTO cust2_id FROM customers WHERE email = 'mchen@starlight.io' LIMIT 1;
    SELECT id INTO cust3_id FROM customers WHERE email = 'elena@apexcloud.net' LIMIT 1;

    -- 4. Insert Demo Meetings
    INSERT INTO meetings (organization_id, user_id, customer_id, title, participant, company, meeting_time, meeting_date, type, link)
    VALUES
        (org_id, user_id, NULL, 'Series A Investor Catchup', 'Alex Vance (Sequoia Capital)', 'Sequoia Capital', '10:00 AM - 10:45 AM', CURRENT_DATE, 'investor', 'https://meet.google.com/abc-defg-hij'),
        (org_id, user_id, cust1_id, 'Acme Enterprise Demo & Security Review', 'Sarah Jenkins (VP Tech)', 'Acme Inc.', '02:00 PM - 03:00 PM', CURRENT_DATE, 'customer', 'https://zoom.us/j/123456789');

    -- 5. Insert Demo Emails
    INSERT INTO emails (organization_id, user_id, customer_id, sender, sender_email, subject, snippet, body, unread, needs_reply, days_unreplied, received_at)
    VALUES
        (org_id, user_id, cust1_id, 'Sarah Jenkins', 'sarah@acme.com', 'Security Questionnaire & Renewal Terms', 'Hi Alex, following up on our SOC2 report and contract renewal terms for next quarter...', 'Hi Alex, following up on our SOC2 report and contract renewal terms for next quarter. Let me know when we can review.', true, true, 4, NOW() - INTERVAL '4 days'),
        (org_id, user_id, cust3_id, 'Stripe Billing Alert', 'support@stripe.com', 'Failed Charge: Apex Cloud ($2,800)', 'Payment invoice INV-2026-001 failed charge attempt.', 'Payment invoice INV-2026-001 failed charge attempt. Customer credit card declined.', true, true, 2, NOW() - INTERVAL '2 days');

    -- 6. Insert Demo Slack Messages
    INSERT INTO slack_messages (organization_id, channel, sender, message, has_mention, sent_at)
    VALUES
        (org_id, '#general', 'Marcus (Lead Dev)', 'Production deployment complete for v2.4. All automated integration tests passed!', false, NOW() - INTERVAL '2 hours'),
        (org_id, '#cust-support', 'Priya (CS)', '@Alex heads up, Apex Cloud emailed asking about their failed invoice. Can we issue a updated link?', true, NOW() - INTERVAL '30 minutes');

    -- 7. Insert Demo Tasks
    INSERT INTO tasks (organization_id, user_id, customer_id, title, due_date, priority, completed, source_app, assignee)
    VALUES
        (org_id, user_id, cust1_id, 'Send SOC2 Audit Compliance Report to Sarah', CURRENT_DATE + INTERVAL '1 day', 'high', false, 'Gmail', 'Alex Mercer'),
        (org_id, user_id, cust3_id, 'Retry charge for Apex Cloud invoice INV-2026-001', CURRENT_DATE + INTERVAL '2 days', 'high', false, 'Notion', 'Alex Mercer'),
        (org_id, user_id, cust2_id, 'Prepare Q3 roadmap overview deck for Starlight Labs', CURRENT_DATE + INTERVAL '5 days', 'medium', false, 'Linear', 'Alex Mercer');

    -- 8. Insert Demo Invoices
    INSERT INTO invoices (organization_id, customer_id, invoice_number, customer_name, amount, due_date, status, days_overdue)
    VALUES
        (org_id, cust3_id, 'INV-2026-001', 'Apex Cloud', 5600.00, CURRENT_DATE - INTERVAL '14 days', 'overdue', 14),
        (org_id, cust1_id, 'INV-2026-002', 'Nexus Dynamics', 12000.00, CURRENT_DATE - INTERVAL '6 days', 'overdue', 6),
        (org_id, cust2_id, 'INV-2026-003', 'Starlight Labs', 12000.00, CURRENT_DATE + INTERVAL '15 days', 'pending', 0);

    -- 9. Insert Demo Chat History
    INSERT INTO chat_history (organization_id, user_id, sender, text, suggested_action)
    VALUES
        (org_id, user_id, 'user', 'Who are my top at-risk accounts right now?', NULL),
        (org_id, user_id, 'ai', 'You have 2 accounts at risk: Sarah Jenkins (Acme Inc.) hasn''t replied in 9 days, and Elena Rostova (Apex Cloud) has an overdue invoice of $5,600.', '{"label": "Send Email to Sarah", "actionType": "email", "targetId": "c1"}'::jsonb);

    -- 10. Insert Demo Integrations
    INSERT INTO integrations (organization_id, name, category, description, icon_name, connected, status, last_synced)
    VALUES
        (org_id, 'Gmail', 'Communication', 'Sync emails, customer inquiries, and action items', 'Mail', true, 'connected', NOW() - INTERVAL '10 minutes'),
        (org_id, 'Slack', 'Communication', 'Real-time alert sync, team mentions, and channels', 'MessageSquare', true, 'connected', NOW() - INTERVAL '5 minutes'),
        (org_id, 'Stripe', 'Finance', 'Automated MRR tracking, invoice statuses, and churn detection', 'CreditCard', true, 'connected', NOW() - INTERVAL '1 hour'),
        (org_id, 'Google Calendar', 'Productivity', 'Sync founder meetings, customer demos, and investor calls', 'Calendar', true, 'connected', NOW() - INTERVAL '15 minutes'),
        (org_id, 'Linear', 'Engineering', 'Sync dev tasks, feature releases, and issue trackers', 'CheckSquare', false, 'disconnected', NULL);

END $$;
