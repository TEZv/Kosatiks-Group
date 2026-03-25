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
