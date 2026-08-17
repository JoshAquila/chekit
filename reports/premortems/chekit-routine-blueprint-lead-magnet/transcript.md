# Premortem Transcript: ChekIt Routine Blueprint as Aquila Lead Magnet

Date: 2026-08-16
Failure horizon: 12 months
Branch reviewed: `feature/routine-blueprint`
Current commits reviewed: `3434384`, `6fb4fae`, `3bb726e`, `31455b3`, `4989912`

## Prompt

Josh asked:

> Can you run the Premorteum skill on this version of ChekIt? If we use it as a lead magnet for Aquila, why does it fail in 12 months?

## Context Reviewed

- `docs/routine-blueprint.md`
- `README.md`
- `src/routine-blueprint.js`
- `src/server.js`
- Current branch status and commit history

## Current Plan As Understood

ChekIt Routine Blueprint is a public/open-source lead-generation quiz and routine recommendation layer for ChekIt Core.

The current branch adds:

- Standard Routine Blueprint quiz questions.
- `GET /routine-blueprint/questions`.
- `POST /api/routine-blueprint`.
- Required lead contact before returning results.
- Accepted contact fields: email, phone, Instagram, or social alias.
- Optional webhook delivery through `ROUTINE_WEBHOOK_URL`.
- No Routine Blueprint submission storage in SQLite for v1.
- Webhook-to-Zapier/Google Sheets as the v1 lead storage path.
- Render env docs and frontend client helpers.

## Assumptions

- Aquila wants this to create goodwill, backlinks, authority, ChekIt usage, and ultimately Aquila implementation or product work.
- The intended adopter is an esthetician, med spa, acne clinic, beauty founder, or AI-assisted site builder.
- The tool may be used in two ways:
  - End users complete a skin routine quiz and become leads for an esthetician.
  - Estheticians/business owners discover ChekIt and become leads for Aquila.
- The 12-month success standard is not just GitHub stars or quiz submissions. It is qualified business demand for Aquila or ChekIt.
- V1 should avoid a database/admin dashboard and keep the setup story simple.

## Broad Failure Modes Generated

- The tool attracts skincare consumers, but not the business owners Aquila needs.
- The contact gate depresses completion enough that the tool underperforms.
- Estheticians like the idea but cannot complete Render plus Zapier setup.
- Zapier webhook setup breaks, costs money, or quietly fails.
- Results feel generic, and users do not trust the recommendation.
- "Routine Blueprint" drifts too close to medical/skincare advice and creates trust/compliance anxiety.
- The open-source audience forks or copies it without ever contacting Aquila.
- Distribution depends on Josh/team posting once, then momentum dies.
- The lead magnet has no next step, so captured interest goes nowhere.
- ChekIt captures leads for estheticians but not leads for Aquila.
- Lack of hosted demo makes the thing too abstract.
- No examples/templates means AI builders still have to stitch too much together.
- Support burden from open-source setup eats agency time.
- No measurement tells the team whether the lead magnet is working.
- The product gets stuck as a neat API instead of a sellable business workflow.

## Top Risks Selected For Deep Dive

1. Wrong lead captured.
2. Setup friction kills adoption.
3. Distribution does not compound.
4. Results are not trusted enough to share.
5. No conversion ladder from free tool to Aquila work.
6. Privacy/compliance ambiguity slows serious users.
7. Zapier-only storage fails operationally.
8. Open-source support burden exceeds lead value.

## Notes

The strongest hidden assumption is that "valuable free tool" naturally becomes "Aquila lead magnet." That is not automatic. The product needs two loops:

- The consumer loop: quiz result creates value for the end user and lead value for the esthetician.
- The Aquila loop: esthetician/business owner sees ChekIt, trusts Aquila, and has an obvious next step to get it installed/customized.

If the Aquila loop is not designed, the tool can succeed for estheticians while failing for Aquila.
