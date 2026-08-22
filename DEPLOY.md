# Deploying to Vercel via GitHub

This guide covers self-hosting the Sultan Haramain Gresik site on Vercel,
with the code synced from a GitHub repository. The app keeps using the
**Lovable Cloud** backend (database, auth, storage) — Vercel only runs the
frontend + server functions, which talk to the same Lovable Cloud database.

---

## 1. Connect the project to GitHub

1. In the Lovable editor, open the **Plus (+)** menu in the chat input →
   **GitHub** → **Connect project**.
2. Authorize the Lovable GitHub App and pick the GitHub account/organization.
3. Click **Create Repository** — Lovable creates a repo and starts two-way sync.
   Every change you make in Lovable pushes to GitHub, and pushes to GitHub sync
   back to Lovable.

> Need the code as a ZIP instead? Open the Code Editor → **Download codebase**
> (paid workspaces). Database data is exported separately from
> **Cloud → Advanced settings → Export data**.

---

## 2. Import the repo into Vercel

1. Go to <https://vercel.com/new> and sign in with the same GitHub account.
2. **Import** the repository Lovable just created.
3. Vercel auto-detects **Bun** (from `bun.lock`). Framework may show as Vite —
   that's fine; leave it. The build is handled by Nitro, not the Vite static
   preset.

**Build settings** (Vercel auto-fills most of these):
- **Install Command:** `bun install`
- **Build Command:** `vite build`  (same as `npm run build`)
- **Output Directory:** leave default — Nitro emits `.vercel/output`, which
  Vercel consumes automatically via the Build Output API. Do **not** point it
  at `dist`.

The production build is pinned to the Vercel target in `vite.config.ts`
(`nitro: { preset: "vercel" }`). This only affects builds **outside** the
Lovable sandbox — the Lovable preview/publish still builds for Cloudflare, so
your in-editor preview is unchanged.

---

## 3. Add environment variables in Vercel

Add these in **Vercel → Project → Settings → Environment Variables**
(apply to Production + Preview). Values come from your Lovable Cloud project.

### Client (build-time, inlined by Vite)
| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://hneqcitfaghtvubmtgad.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` (publishable key — safe to commit) |
| `VITE_SUPABASE_PROJECT_ID` | `hneqcitfaghtvubmtgad` |

### Server (runtime, read by server functions)
| Name | Value |
| --- | --- |
| `SUPABASE_URL` | `https://hneqcitfaghtvubmtgad.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | same publishable key as above |
| `SUPABASE_SERVICE_ROLE_KEY` | **not available on Lovable Cloud** — see note below |

> The publishable key is public by design (it's the anon/publishable key).
> It is already committed in `.env`. The **service-role key is never exposed**
> by Lovable Cloud and must NOT be invented or pasted.

### What works without the service-role key

The homepage (`getHomeContent`) and all **admin CRUD** (packages, site content,
gallery) run on the publishable key + the signed-in user's session, governed by
Row-Level Security. Admin verification uses `checkIsAdmin`, which reads the
user's own `user_roles` row via RLS — no service role needed.

### What needs the service-role key (one-time only)

The **first-admin bootstrap** (`claimFirstAdmin`) calls a SQL function
restricted to the service role. Do this **once from the Lovable preview**:

1. Open the Lovable preview, go to `/auth`, and sign in / register.
2. Go to `/admin` and click **Klaim Akses Admin**.
   (This works because the Lovable runtime has the service-role key.)
3. The admin row is now stored in the shared Lovable Cloud database.

After that, the same user is recognized as admin on Vercel too (same database,
same session) — no service-role key required on Vercel.

---

## 4. Deploy

Click **Deploy** in Vercel. The first build runs `bun install` → `vite build`,
emits `.vercel/output`, and Vercel serves it. Subsequent pushes to the GitHub
`main` branch redeploy automatically (two-way sync with Lovable keeps the repo
current).

Your live URL will be `https://<your-repo>.vercel.app`. Add a custom domain in
**Vercel → Project → Settings → Domains**.

---

## Troubleshooting

- **`Missing Supabase environment variable(s)`** in server logs → you forgot to
  add `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (runtime, not just the `VITE_`
  ones) to Vercel env vars.
- **Admin page says "belum memiliki akses admin"** → claim admin once from the
  Lovable preview (step 3 above). The row then persists for Vercel.
- **`claim_first_admin` fails on Vercel** → expected; that path needs the
  service-role key, which Lovable Cloud doesn't expose. Use the Lovable preview
  for the one-time claim.
- **404 on deep links / refresh** → ensure the Vercel project built successfully
  (`.vercel/output` present). TanStack Start routing needs no extra config.

---

## 5. Custom domain (live)

Production domain: **https://www.sultanharamaingresik.com/**

- Added in **Vercel → Project → Settings → Domains**, with `sultanharamaingresik.com`
  redirecting to the `www` host.
- The canonical URL is centralised in `src/lib/site.ts` (`SITE.url`) and used for
  `<link rel="canonical">`, `og:url`, and the `TravelAgency` JSON-LD on the homepage.
- `public/robots.txt` points crawlers at `https://www.sultanharamaingresik.com/sitemap.xml`,
  and `public/sitemap.xml` lists the homepage.

If the domain ever changes, update `SITE.url`, `public/robots.txt`, and
`public/sitemap.xml` — nothing else hardcodes the host.

> The Lovable preview and `sultanharamaincabanggresik.lovable.app` keep working; they
> just declare the Vercel domain as canonical so Google indexes one URL only.

---

## 6. Sync checklist (Lovable → GitHub → Vercel)

Everything below is verified in the current codebase; use it as the go-live check.

| Layer | Source of truth | Notes |
| --- | --- | --- |
| Database (packages, site_content, gallery_images, user_roles) | Lovable Cloud | Shared by the Lovable preview *and* Vercel — one dataset, no copies. |
| Public content reads | `src/lib/content.functions.ts` (`getHomeContent`) | Publishable key only, via public `SELECT` policies. |
| CMS writes | `/admin` (browser client + RLS) | Admin-only policies check `user_roles`. |
| Auth / login | `/auth` (email + password) | Sessions are stored per browser; the same credentials work on both domains. |
| Admin credential | first account that clicks **Klaim Akses Admin** in the Lovable preview | Row persists in the database, so the same login is admin on Vercel. |
| Frontend pages/components | `src/routes/*`, `src/components/site/*` | Single codebase — GitHub two-way sync pushes it to Vercel. |
| Canonical host | `src/lib/site.ts` → `SITE.url` | Also drives `robots.txt` + `sitemap.xml`. |
| Search Console tags | `src/routes/__root.tsx` (`RootShell`) | Two literal `<meta name="google-site-verification">` tags (custom domain + Lovable domain). |

### Environment variables win over `.env`

The repo contains a Lovable-managed `.env`. Values you set in
**Vercel → Settings → Environment Variables** override it at build and runtime,
so always set the six variables from step 3 in Vercel explicitly instead of
relying on the committed file.

> Keep the GitHub repository **private**: the Lovable-managed `.env` is committed
> and may contain server-side keys.

### After every Lovable change

1. Lovable pushes to GitHub `main` automatically (two-way sync).
2. Vercel builds that commit and updates `https://www.sultanharamaingresik.com/`.
3. Content edited in `/admin` needs **no** redeploy — it is read from the
   database on every request.
