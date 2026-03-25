# Hub Operating Model

## Core Recommendation

Use one public portal and one operational system.

Do not try to make GitHub, Notion, Discord, forms, talent pool, and automations all behave like the same layer.

Split responsibilities clearly:

- `Kosatiks Group` = public umbrella portal
- `GitHub` = source of truth for public repos, case studies, and project code
- `Vercel` = deployment layer for public sites
- `Notion` = operational system for intake, CRM, services, projects, and content planning
- `Discord` = optional community layer later, not the core system now
- `n8n` = automation only after there is enough real volume to justify it

## Recommended Hub Structure

### 1. Kosatiks Group

Use this as the umbrella shell.

Purpose:

- show your roles
- route visitors to the right hub or repo
- present case studies
- present selected services
- hold the brand language and structure together

### 2. K-RnD Hub

Use this as the research and experimentation umbrella.

Purpose:

- public experiments
- analytical systems
- technical or cross-disciplinary case studies
- links to research repos and lab artifacts

### 3. K Venture AI Studio

Use this as the build / automation / AI / startup tooling hub.

Purpose:

- productized service offers
- automation systems
- AI pipeline demos
- startup support work

Status right now: `building`

### 4. K Mentorship Hub

Do not force this into a full Discord-first ecosystem now.

Better near-term position:

- public beta / parked hub
- clear explanation of the concept
- one waitlist or intake form
- no heavy community operations yet

Status right now: `parked`

## Revenue-Friendly Structure

Do not frame this as a classic agency unless you really want an agency model.

A better structure for now:

- `What I do` = your capability map
- `Selected collaborations` = what people can hire you for
- `Projects and labs` = what you are building
- `Research and case studies` = proof that you can think and execute

This keeps the site honest and flexible.

## What Should Live in GitHub

Yes, use GitHub for:

- each real public project or hub repo
- static sites and case studies
- technical demos
- public documentation
- blog-like markdown if you want SEO and discoverability

Do not use GitHub as:

- your CRM
- your lead database
- your talent pool database
- your internal operations dashboard

## Recommended Data System

Use one Notion workspace, not separate disconnected systems per hub.

Recommended core databases:

1. `Hubs`
- hub name
- status
- owner
- public URL
- repo URL
- main offer type

2. `Offers / Services`
- offer name
- related hub
- delivery mode
- starting scope
- status
- public description

3. `Intake / CRM`
- incoming request title
- person / company
- email
- hub selected
- service selected
- budget range
- timeline
- source
- status

4. `Projects`
- project name
- related hub
- type: self / client / research
- repo
- live URL
- status
- linked case study

5. `Case Studies`
- title
- project
- short summary
- problem
- approach
- result
- publication status

6. `Content Pipeline`
- idea
- format
- hub
- status
- publish URL

### Optional Later

7. `Talent Pool`

Only create this when there is actual recurring need.

Right now it is likely premature.

## Intake Recommendation

Use one master intake form first.

Required fields:

- name
- email
- what are you interested in
- hub
- service / request type
- budget range
- deadline
- extra context

Best starting destination:

- a Notion database, directly or through a simple form layer

Do not build separate intake flows for every hub yet.

## Forms and Automation

Start simple:

- one public intake form
- one Notion CRM database
- optional email notification

Only add `n8n` when you actually need:

- auto-routing by hub
- auto-tagging by service type
- notifications to email / Discord / Telegram
- database sync between tools

## Discord Recommendation

Discord should be optional and later.

Do not make it the primary home of your knowledge system.

Why:

- it is harder to index and discover
- harder to present professionally on a public site
- harder to maintain if the community is not active yet

Use the website and GitHub for public discoverability.

If a community truly forms later, then add Discord as the social layer.

## Best Near-Term Execution Plan

### Now

- keep `Kosatiks Group` as the umbrella portal
- keep `K-RnD Hub` active
- show `K Venture AI Studio` as building
- keep `K Mentorship Hub` parked / beta
- use one Notion-based intake / CRM system
- use GitHub for public repos and proof of work

### Next

- deploy the portal to Vercel
- connect `kosatiks-group.pp.ua`
- add live case-study screenshots
- add one public service page or section

### Not Now

- full Discord ecosystem
- talent pool operations
- too many separate forms
- complex n8n orchestration before demand exists
