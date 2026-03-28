# Auth — Design Document

**Date:** 2026-03-28
**Status:** Approved, pending implementation

## Overview

Add Supabase Auth (email/password) to lock the app to a single authenticated user. Anonymous access is removed entirely via updated RLS policies.

## Auth Flow

1. App loads → check for active Supabase session
2. No session → render `Login.jsx` (email + password form)
3. Successful sign-in → session stored in browser, app renders normally
4. Session persists across refreshes via Supabase token handling
5. "Sign out" button in the dashboard header clears session → returns to login

## Components

- `src/components/Login.jsx` + `Login.css` — sci-fi HUD styled login form
- `src/App.jsx` — session check, renders Login or app

## RLS Policy Changes

Old open policies replaced with authenticated-only:

```sql
DROP POLICY "anon_all" ON payments;
DROP POLICY "anon_all" ON adjustments;
DROP POLICY "anon_all" ON utilities;
DROP POLICY "anon_all" ON config;

CREATE POLICY "auth_only" ON payments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_only" ON adjustments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_only" ON utilities FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_only" ON config FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
```

## Supabase Steps (completed by user)

1. Authentication → Users → Add user (email + password)
2. Authentication → Settings → Disable signups
3. Run RLS SQL above in SQL Editor
