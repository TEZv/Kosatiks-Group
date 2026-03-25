# Kosatiks Group

Kosatiks Group is the umbrella site for Oksana Kolisnyk's roles, labs, case studies, and public-facing repositories.

The site is intentionally static:

- easy to host on GitHub Pages, Vercel, or Netlify
- easy to connect to a custom domain
- easy to keep public as a portfolio + research hub

## What lives here

- `Strategist` work: research, growth systems, SEO, analytics
- `Producer` work: systems, labs, case studies, learning environments
- `Creator` work: narrative, visual identity, experiments, future books
- direct links to GitHub repos, labs, and public case studies

## Structure

- `index.html` - main shell
- `assets/css/styles.css` - design system and layout
- `assets/js/main.js` - bilingual UI, filters, and rendering
- `assets/img/` - logo and favicon assets

## Hosting Recommendation

Recommended public setup:

1. Keep this repository as the source of truth.
2. Deploy it to Vercel as a static site.
3. Connect `kosatiks-group.pp.ua` to that Vercel project.
4. Keep GitHub public so people can inspect the code and linked case studies.

Why this setup:

- GitHub is best for code, history, and public research context.
- Vercel is simpler for previews, custom domains, and clean deployments.
- You do not need a backend for the site itself.

## Custom Domain

When you are ready to move `kosatiks-group.pp.ua`:

1. Import this repo into Vercel.
2. Add the custom domain in the Vercel dashboard.
3. Point the domain in `pp.ua` to the DNS records Vercel gives you.
4. Keep HTTPS enabled in Vercel.

## Public Positioning

This repo can work as:

- the main Kosatiks portal
- a routing layer to your GitHub repositories
- a front page for K-RnD links
- an entry point to the `master_prep_2026` case study

## Suggested Cross-links

- Main portfolio / portal: `Kosatiks-Group`
- Research umbrella: `K-RnD-Lab`
- Case study: `master_prep_2026`
- Specialized hubs: `K Mentorship Hub`, `SPHERE-I-SCIENCE`, future book/lab repos

## Next Recommended Additions

- screenshots for major case studies
- dedicated cards for each public hub/repo
- a public "training -> analytics -> result" story block for `master_prep_2026`
- a dedicated page for books / notes / library

## Planning Docs

- `DEPLOYMENT.md` - how to publish via Vercel and connect a custom domain
- `HUB_OPERATING_MODEL.md` - recommended hub structure, data system, and monetization logic

## Hub Pages

The main cards now support a layered routing model:

- `Hub page` - a focused landing page inside the Kosatiks umbrella
- `Live site` - external Google Site, Vercel app, or public demo
- `Repository` - technical source of truth
- `Organization` - umbrella org when relevant

This makes the portal more useful than a repo directory: each hub can have its own public explanation page without forcing everything into one hosting tool.

## Notion Operating System

See [NOTION_BLUEPRINT.md](./NOTION_BLUEPRINT.md) for the database structure that mirrors the operating setup created in Notion.
