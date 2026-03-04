# LetsWorkOut — Setup Guide

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic API key](https://console.anthropic.com)

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Configure environment variables

Copy `.env.local` and fill in your real values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find these:**
- Supabase: Project Settings → API
- Anthropic: https://console.anthropic.com/account/keys

---

## 3. Set up Supabase database

In your Supabase project, go to **SQL Editor** and run these files **in order**:

1. `supabase/schema.sql` — creates all tables, RLS policies, triggers
2. `supabase/seed_exercises.sql` — seeds 40+ exercises

---

## 4. Enable Google OAuth (optional)

In Supabase → Authentication → Providers → Google:
- Add your Google OAuth Client ID and Secret
- Redirect URL: `https://yourproject.supabase.co/auth/v1/callback`

---

## 5. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── (app)/
│   │   ├── layout.tsx      # Authenticated app layout + nav
│   │   ├── dashboard/      # Home dashboard
│   │   ├── onboarding/     # 5-step profile setup
│   │   ├── workouts/       # Workout list, detail, new, log
│   │   ├── exercises/      # Exercise library with filters
│   │   └── progress/       # Progress charts + PRs
│   ├── api/
│   │   ├── auth/callback   # Supabase OAuth callback
│   │   ├── exercises/      # Exercise CRUD
│   │   ├── workouts/       # Workout plan CRUD + AI generate
│   │   ├── logs/           # Workout log CRUD
│   │   └── progress/       # Progress summary endpoint
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Button, Card, Input, etc.
│   └── layout/             # AppNav
├── lib/
│   └── supabase/           # Server + client Supabase helpers
├── types/                  # TypeScript interfaces
└── middleware.ts            # Auth-protected routing
supabase/
├── schema.sql              # Database schema + RLS
└── seed_exercises.sql      # Exercise library seed data
```

---

## Phase 1 Features ✅

- [x] Landing page
- [x] Email + Google OAuth signup/login
- [x] 5-step onboarding (demographics, goals, equipment)
- [x] Exercise library (40+ exercises, filter by muscle/equipment/difficulty)
- [x] AI workout builder (natural language → Claude → structured plan)
- [x] Manual workout builder (search + add exercises, sets/reps/rest)
- [x] Workout plan detail view
- [x] Live workout logging (check sets, log weight/reps, rest timer)
- [x] Progress dashboard (streak, weekly volume chart, personal records)

## Phase 2 (Next)

- [ ] AI Coaching — adaptive suggestions based on logs
- [ ] AI Chat Coach — contextual fitness Q&A
- [ ] Workout history calendar view
- [ ] Body weight tracking
