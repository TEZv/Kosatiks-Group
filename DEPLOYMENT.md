# Deployment Guide

## Recommended Setup

Use this repository as the source of truth and deploy it to Vercel.

Why:

- GitHub keeps the code, history, and public credibility.
- Vercel gives clean previews and simple custom-domain support.
- The site is fully static, so there is no backend requirement.

## Vercel Steps

1. Import `TEZv/Kosatiks-Group` into Vercel.
2. Framework preset: `Other`.
3. Build command: leave empty.
4. Output directory: leave empty.
5. Deploy.

## Custom Domain

To connect `kosatiks-group.pp.ua`:

1. Open the Vercel project settings.
2. Add `kosatiks-group.pp.ua` as a domain.
3. Copy the DNS records Vercel gives you.
4. Add those records in the `pp.ua` control panel.
5. Wait for SSL issuance.

## Public GitHub + LinkedIn Positioning

Recommended presentation:

- `Kosatiks-Group` = main portal
- `master_prep_2026` = featured case study
- `K-RnD-Lab` = research umbrella

When posting publicly, show:

- one screenshot of the portal
- one screenshot of the featured case study
- one sentence explaining the system logic: `training -> analytics -> public case study`

## Future Upgrade Path

If you later want dynamic content:

- keep the public portal static
- add content APIs separately
- do not mix portfolio hosting with experimental backend logic unless needed
