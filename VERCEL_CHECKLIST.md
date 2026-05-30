# Vercel Checklist

Use this exact checklist for `kosatiks-group.pp.ua`.

## Project import

1. Open Vercel.
2. Click `Add New -> Project`.
3. Import `TEZv/Kosatiks-Group`.
4. If an older red project already exists, delete it first.

## Build settings

Use these exact values:

- Framework Preset: `Other`
- Root Directory: repository root
- Build Command: empty
- Install Command: empty
- Output Directory: empty

This site is static HTML/CSS/JS. It should be served directly.

## Domain connection

1. Open the new Vercel project.
2. Go to `Settings -> Domains`.
3. Add `kosatiks-group.pp.ua`.
4. Copy the DNS records Vercel gives you.
5. Add those records in the `pp.ua` panel.
6. Wait for SSL and propagation.

## K Life OS subdomain (`k-life-os.kosatiks-group.pp.ua`)

Статичні файли лежать у папці **`k-life-os/`** у цьому репо. `vercel.json` + `middleware.js` віддають їх на хості **`k-life-os.kosatiks-group.pp.ua`** (alias: `game.kosatiks-group.pp.ua`). Основний домен не змінюється.

1. Закоміть і запуш `k-life-os/` + `vercel.json` + `middleware.js` у `main`.
2. Vercel → **Settings → Domains** → **Add** → `k-life-os.kosatiks-group.pp.ua`.
3. У DNS (pp.ua або Vercel DNS Records) додай **CNAME**:
   - Name: `k-life-os`
   - Value: `cname.vercel-dns.com` (або те, що дасть Vercel)
4. Дочекайся SSL (зелена галочка в Vercel).
5. Перевір у браузері:
   - `https://k-life-os.kosatiks-group.pp.ua/` — K Life OS (не «Three roles»)
   - `https://k-life-os.kosatiks-group.pp.ua/vault.bundle.js` — ~65 KB, не 404
   - `https://kosatiks-group.pp.ua/` — як і раніше, головний портал

**Не потрібен** окремий FTP-хостинг, якщо весь домен уже на Vercel.

### Якщо `k-life-os.` відкриває головний портал (не гру)

У панелі DNS **не** став CNAME `k-life-os` → `kosatiks-group.pp.ua` (подвійне ім’я типу `kosatiks-group.pp.ua.kosatiks-group.pp.ua` теж неправильно).

Правильно (значення дивись у Vercel → Domains → `k-life-os.kosatiks-group.pp.ua`):

| Тип | Ім’я | Значення |
|-----|------|----------|
| **CNAME** | `k-life-os` | `cname.vercel-dns.com` |

Або **A** → `76.76.21.21`, якщо Vercel показує A для піддомену.

Після зміни DNS зачекай 15–60 хв, потім Ctrl+F5 на `https://k-life-os.kosatiks-group.pp.ua/` — має бути «Куди мене занесе?», не «Three roles».

### Nameservers на Vercel (`ns1.vercel-dns.com`)

Якщо в nic.ua вказані NS Vercel — зону керує **Vercel → Domains → DNS Records**.

- **`k-life-os`** — окремий CNAME на Vercel (рекомендовано).
- Wildcard **`*`** без окремого запису може віддавати **головний портал** — тоді обов’язково додай правила в `vercel.json` / `middleware.js` (вже в репо).

Якщо піддомен уже на Vercel, але все одно портал — перевір **middleware.js** (host → `/k-life-os/`), зроби **Redeploy** і Ctrl+F5.

### Legacy alias: `game.kosatiks-group.pp.ua`

Той самий контент; маршрутизація дубльована в `vercel.json`. Можна лишити або прибрати DNS-запис `game`, якщо не потрібен.

## Verification

After deploy, verify:
- the home page opens
- hub pages open from the cards
- direct links work for Google Sites and GitHub
- `404.html` renders instead of a generic Vercel failure page

## If it fails again

Check these before debugging anything else:
- the imported repository is `TEZv/Kosatiks-Group`
- the selected branch is `main`
- no build command is set
- no old root directory is cached
- `vercel.json` is the current one from `main`
