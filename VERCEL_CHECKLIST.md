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

## Game subdomain (`game.kosatiks-group.pp.ua`)

Статичні файли лежать у папці **`game/`** у цьому репо. `vercel.json` віддає їх лише на хості `game.kosatiks-group.pp.ua` (основний домен не змінюється).

1. Закоміть і запуш `game/` + `vercel.json` у `main` (або змердж PR).
2. Vercel → **Settings → Domains** → **Add** → `game.kosatiks-group.pp.ua`.
3. У кабінеті **pp.ua** (DNS зони домену) додай запис, який покаже Vercel (зазвичай **CNAME**):
   - Name: `game`
   - Value: `cname.vercel-dns.com` (або те, що дасть Vercel у підказці)
4. Дочекайся SSL (зелена галочка в Vercel).
5. Перевір у браузері:
   - `https://game.kosatiks-group.pp.ua/` — гра
   - `https://game.kosatiks-group.pp.ua/vault.bundle.js` — ~65 KB, не 404
   - `https://kosatiks-group.pp.ua/` — як і раніше, головний портал

**Не потрібен** окремий FTP-хостинг для `game`, якщо весь домен уже на Vercel.

### Якщо `game.` відкриває головний портал (не гру)

У панелі DNS (nic.ua / хостинг) **не** став CNAME `game` → `kosatiks-group.pp.ua` (подвійне ім’я типу `kosatiks-group.pp.ua.kosatiks-group.pp.ua` теж неправильно).

Правильно (значення дивись у Vercel → Domains → `game.kosatiks-group.pp.ua`):

| Тип | Ім’я | Значення |
|-----|------|----------|
| **CNAME** | `game` | `cname.vercel-dns.com` |

Або **A** → `76.76.21.21`, якщо Vercel показує A для піддомену.

Після зміни DNS зачекай 15–60 хв, потім Ctrl+F5 на `https://game.kosatiks-group.pp.ua/` — має бути «Куди мене занесе?», не «Three roles».

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
