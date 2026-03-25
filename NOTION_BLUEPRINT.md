# Notion Blueprint

This document mirrors the operating setup already created in Notion under `Kosatiks Hub OS`.

## Parent Page

- `K Life Planner Build`
- workspace branch: `K Life Planner Commercial Core -> Kosatiks Hub OS`

## Databases

### Hubs
Purpose: the top-level map of every public or semi-public hub.

Suggested properties:
- `Name` (title)
- `Status` (select: Active, Building, Parked)
- `Type` (select: Umbrella, Research, Studio, Mentorship, Product)
- `Primary URL` (url)
- `Repository URL` (url)
- `Owner` (rich text)
- `Public Summary` (rich text)
- `Priority` (number)

### Offers & Services
Purpose: what can be ordered, commissioned, or requested.

Suggested properties:
- `Name` (title)
- `Hub` (relation -> Hubs)
- `Status` (select: Draft, Active, Archived)
- `Audience` (select: Founder, Team, Individual, Internal)
- `Format` (select: Audit, Build, Mentorship, Product Pack)
- `Price Note` (rich text)
- `Delivery Note` (rich text)
- `Public URL` (url)

### Intake CRM
Purpose: one intake pipeline instead of many disconnected forms.

Suggested properties:
- `Name` (title)
- `Hub` (relation -> Hubs)
- `Offer` (relation -> Offers & Services)
- `Stage` (select: New, Qualified, In Progress, Closed)
- `Source` (select: Site, GitHub, LinkedIn, Notion, Referral)
- `Contact Name` (rich text)
- `Contact URL` (url)
- `Need Summary` (rich text)
- `Next Step` (rich text)

### Projects
Purpose: active work and internal build tracking.

Suggested properties:
- `Name` (title)
- `Hub` (relation -> Hubs)
- `Status` (select: Idea, Active, Hold, Done)
- `Visibility` (select: Public, Internal, Client)
- `Repository URL` (url)
- `Live URL` (url)
- `Notes` (rich text)

### Case Studies
Purpose: proof-of-work for GitHub, portfolio, and LinkedIn.

Suggested properties:
- `Name` (title)
- `Project` (relation -> Projects)
- `Hub` (relation -> Hubs)
- `Status` (select: Draft, Building, Published)
- `Outcome` (rich text)
- `Metrics` (rich text)
- `Public URL` (url)
- `Screenshot URL` (url)

### Content Pipeline
Purpose: one queue for posts, articles, notes, and public updates.

Suggested properties:
- `Name` (title)
- `Hub` (relation -> Hubs)
- `Content Type` (select: Post, Article, Repo Update, Case Study, Note)
- `Stage` (select: Idea, Draft, Ready, Published)
- `Primary Link` (url)
- `Distribution Note` (rich text)

## Public System Logic

Recommended stack:
- `Kosatiks Group` = umbrella router and brand shell
- `GitHub` = source of truth for repos and public technical proof
- `Vercel` = deployment for the umbrella site
- `Notion` = internal operating system and CRM
- `Google Sites` = acceptable per-hub landing page when speed matters

## Hub Page Model

Each card in Kosatiks should ideally have up to four routes:
- `Hub page` = a focused landing page inside the umbrella portal
- `Live site` = Google Site, Vercel app, or public demo
- `Repository` = the technical source of truth
- `Organization` = umbrella org when relevant
