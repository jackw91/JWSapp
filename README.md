# Calgary Barbell — 16-Week Program (Phase 1: cloud sync)

This is your training app, moved from a single browser's `localStorage`
into a real Next.js app backed by Supabase — so your data now lives in
the cloud under your account, and is the same whether you open it on
your phone or your laptop.

Nothing about how the app *works* has changed. It's the same tabs, same
program data, same features — just a different place the data is saved.

## What's in here

```
app/
  layout.jsx            Root layout
  page.jsx               The main page (server-side auth check, then
                          renders the app)
  login/page.jsx          Login / sign-up screen
  api/data/[key]/route.js       Get / set / delete a single value
  api/data-list/route.js        List keys by prefix (used to load all
                                 logged sessions in one request)
components/
  CalgaryBarbellApp.jsx  The app itself — same as before, with the
                          storage layer swapped from localStorage to
                          fetch() calls against the API routes above
lib/supabase/
  client.js              Supabase client for the browser
  server.js               Supabase client for API routes / server code
proxy.js                  Refreshes the login session on every request,
                          and redirects logged-out visitors to /login
                          (Next.js 16's renamed "middleware" convention)
supabase/schema.sql      Run this once in Supabase to create the tables
```

## One-time setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

It's already filled in with your project's URL and publishable key —
nothing to edit unless you're pointing at a different Supabase project.

### 3. Create the database tables

In your Supabase project dashboard, go to the **SQL Editor**, paste in
the contents of `supabase/schema.sql`, and run it. This creates:

- `user_data` — the key-value table that holds everything (settings,
  logged sessions), with Row Level Security so each person can only
  ever see their own rows.
- `profiles` — a small table with a `role` column (`athlete` or
  `coach`), ready for Phase 3's coach dashboard. Everyone defaults to
  `athlete`.

### 4. Run it locally

```bash
npm run dev
```

Open `http://localhost:3000` — you'll be redirected to `/login`. Use
the "Need an account? Sign up" link to create your account (this is
just for you, for now — Phase 1 doesn't have an invite system yet).

### 5. Bring your existing data across

If you've been using the old version of the app, you should already
have a backup file from its Export feature (Settings → Backup &
Restore → Export). Once you're logged into the new app, the same
Import button in Settings will load that file in — it uses the same
JSON format, just now writing to your cloud account instead of
`localStorage`.

## Deploying

1. Push this project to a GitHub repo.
2. Import it into Vercel (same as before).
3. In Vercel's project settings, add the two environment variables from
   `.env.local` — or better, use the Supabase-Vercel integration (from
   the Vercel Marketplace) to sync them automatically.
4. Deploy. Every push to your main branch redeploys, same as your old
   single-file version did.

## A note on email confirmation

By default, Supabase requires a new signup to click a confirmation
link before they can log in. For a project that's just you (or you +
a few athletes you're personally adding), you may want to turn this
off: **Authentication → Providers → Email → Confirm email**. Entirely
optional — leaving it on is the safer default if you're unsure.

## What's next (not in this phase)

- A coach/admin dashboard to view athlete data (Phase 3)
- Moving the program itself (`PROGRAM_DATA`) from a hardcoded constant
  into the database, so it's editable rather than requiring a code
  change (Phase 2)
- Inviting athletes rather than open signup

This phase is deliberately just: get auth working, get your data in
the cloud, keep everything else identical.
