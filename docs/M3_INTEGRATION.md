# M3 Integration — Setup Notes

## What changed (2026-06-04)

- `scripts/generate-questions.js`: added provider abstraction (M3 primary, Groq fallback)
- `.github/workflows/generate-questions.yml`: passes `M3_API_KEY` + `GROQ_API_KEY` secrets
- Backup branch: `backup/groq-original` (restore with `git checkout backup/groq-original`)

## How to enable M3

### 1. Top up MiniMax account

- Go to https://MiniMax.io → Account → Billing
- Top up $1-2 (pay-per-use API)
- Generate an API key at https://MiniMax.io/basic-information/api-key
  - Or check the MiniMax Code desktop app for the API key

### 2. Add to GitHub Secrets

- Go to https://github.com/TEZv/Kosatiks-Group/settings/secrets/actions
- Click **New repository secret**:
  - Name: `M3_API_KEY`
  - Value: your M3 API key (starts with `eyJ...`)
- Existing `GROQ_API_KEY` secret stays as fallback (don't remove it)

### 3. Trigger the workflow

- Go to https://github.com/TEZv/Kosatiks-Group/actions/workflows/generate-questions.yml
- Click **Run workflow** → **Run workflow**
- Watch the logs to confirm M3 is used (look for `Primary provider: m3`)

## Cost estimate

| Metric | Value |
|--------|-------|
| Daily requests | 24 (12 spheres × UA + EN) |
| Monthly requests | ~720 |
| Tokens per request | ~1.2K (input 200 + output 1000) |
| Monthly tokens | ~860K |
| M3 API price | ~$0.50/1M mixed tokens |
| **Monthly cost** | **~$0.43** |
| With 5× price increase | ~$2.15 |
| With 10× price increase | ~$4.30 |

$1-2 top-up lasts **1-3 months** even in worst case.

## Provider selection

Default is M3 → falls back to Groq if M3 fails or returns empty. To force Groq temporarily:
- Set `LLM_PROVIDER: groq` in the workflow env (or remove M3_API_KEY from secrets)

## Rollback

```bash
git checkout backup/groq-original
# or via GitHub UI: switch default branch to backup/groq-original
```

## Notes

- M3 API endpoint: `https://api.MiniMax.chat/v1/text/chatcompletion_v2`
- M3 may return errors via `base_resp` field (handled in code)
- Each generated question is tagged with `_provider` field for cost analysis
