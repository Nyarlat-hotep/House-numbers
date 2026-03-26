# House Numbers — Design Document

**Date:** 2026-03-25
**Status:** Implemented

## Overview

Personal home appraisal payment tracker. Tracks monthly rental payments and ad-hoc deductions applied against a $894,000 starting appraisal total. Shows a running remaining balance as payments and adjustments accumulate.

## Problem

The user was manually tracking payments in a spreadsheet. Needed a deployed web interface to submit monthly payments, add on-the-fly payments, and adjust the total appraisal downward — all updating a single running balance.

## Architecture

Single-page React + Vite app. No backend server. Supabase (PostgreSQL) accessed directly from the browser via the Supabase JS client. Deployed to GitHub Pages via GitHub Actions on every push to main.

**Tech stack:** React 18, Vite, @supabase/supabase-js, plain CSS, GitHub Actions

## Database Schema

### `config` (single row)
- `id`: int (always 1)
- `initial_appraisal`: numeric (starts at 894000)

### `payments`
- `id`: uuid
- `date`: date (first of month, e.g. 2024-06-01)
- `amount`: numeric
- `notes`: text (nullable)
- `type`: text ('monthly' | 'adhoc')
- `created_at`: timestamptz

### `adjustments`
- `id`: uuid
- `date`: date
- `amount`: numeric (negative = reduction)
- `notes`: text (nullable)
- `created_at`: timestamptz

### `utilities`
- `id`: uuid
- `name`: text
- `monthly_cost`: numeric (user pays half)
- `notes`: text (nullable)

**Running balance formula:** `initial_appraisal - SUM(payments.amount) + SUM(adjustments.amount)`

## Security

Row Level Security (RLS) enabled on all tables. Open policies allow full access via the anon key. No login required — personal single-user tool.

## UI Panels

1. **Dashboard HUD** — large glowing cyan remaining balance, stat tiles (Starting Appraisal, Total Paid, Total Adjustments)
2. **Payments** — table of all payments, add/edit/delete, monthly/adhoc type badge
3. **Appraisal Adjustments** — table of deductions, add/edit/delete
4. **Utilities Reference** — editable reference list showing full cost and user's half-share
5. **Settings** — inline editor for the starting appraisal amount

## Design Language

Sci-fi / space HUD aesthetic: dark grid background (#080c14), cyan (#00e5ff) glowing panel borders and balance display, Space Mono monospace font, green for payments, red for adjustments.

## Deployment

- GitHub repo: https://github.com/Nyarlat-hotep/House-numbers
- GitHub Pages URL: https://nyarlat-hotep.github.io/House-numbers/
- Deploy: push to `main` → GitHub Actions builds → deploys to `gh-pages` branch

## Seeded Data

22 payments from June 2024 through March 2026, 3 appraisal adjustments, 5 utility entries imported from the user's original spreadsheet.
