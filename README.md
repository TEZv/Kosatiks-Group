# Kosatiks Group

Static umbrella-site for Kosatiks Group.

## Current structure
- Old-style card + modal interface restored from the original `kosatiks-group` direction.
- Three role filters: `Strategist / Producer / Creator`.
- Mode filters: `For hire / Self & Supply only / Project`.
- Hub logos now live in `assets/img/hubs`.
- Media clips now live in `assets/video`.
- `Master Trainer / магістерська підготовка` is not a standalone main hub here. It is routed inside `K-RnD Lab` as a research/project layer.

## Edit points
- Main content and routing: `assets/js/main.js`
- Main styling: `assets/css/styles.css`
- Main markup shell: `index.html`
- Hub logos: `assets/img/hubs`
- Background / modal videos: `assets/video`

## How to add a new hub
1. Add a new object to the `HUBS` array in `assets/js/main.js`.
2. Pick a `role`: `strategist`, `producer`, or `creator`.
3. Pick `modes`: any of `hire`, `self`, `project`.
4. Add `title`, `summary`, `overview`, `bullets`, `format`, `links`, and `media`.
5. Copy or assign a logo in `assets/img/hubs`.

## Social links
Footer chips are also generated from `assets/js/main.js` via `socialLinks`.
If a link is not ready yet, keep it in draft mode instead of linking to a broken URL.

## Local preview
```powershell
cd "C:\Users\...\Kosatiks-Group-repo"
python -m http.server 8031
```

## Vercel
This repo is static. In Vercel use:
- Framework Preset: `Other`
- Build Command: empty
- Install Command: empty
- Output Directory: empty
- Root Directory: repo root
