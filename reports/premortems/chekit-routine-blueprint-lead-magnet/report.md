# Premortem Report: ChekIt Routine Blueprint as Aquila Lead Magnet

Date: 2026-08-16
Failure horizon: 12 months

## Context

- Plan: Use ChekIt Routine Blueprint as a free/open lead magnet that helps estheticians collect client leads and creates Aquila demand.
- Audience/customer: Estheticians, acne clinics, med spas, beauty founders, and AI-assisted site builders.
- Success criteria: Qualified Aquila conversations, ChekIt installs, backlinks/mentions, completed esthetician setups, reliable lead delivery, and a clear path from free tool to paid implementation.
- Constraints: Small team, open-source expectations, simple Render deploy, webhook-first lead storage, no v1 admin dashboard, skincare trust/compliance sensitivity.
- Key assumptions: Estheticians will value the tool enough to set it up, required contact will not crush completion, Zapier/Sheets is approachable, and free usage can convert into Aquila services.

## Executive Summary

- Most likely failure: The tool gets interest but not activation. Estheticians say it is cool, then stall at setup, webhook configuration, or frontend embedding.
- Most dangerous failure: It captures client leads for estheticians but does not create Aquila leads. The end-user funnel works, while Aquila remains invisible.
- Biggest hidden assumption: A valuable free tool automatically becomes a business-development engine. It does not unless the installer/buyer journey is designed.
- Highest-leverage change: Ship a hosted demo plus a "done-for-you setup" path for estheticians before treating GitHub/open-source interest as success.

## Failure Modes

### 1. Wrong Lead Captured

- Failure story: Consumers complete quizzes. Estheticians receive leads. Aquila gets no business-owner contacts, no setup requests, and no implementation conversations. Twelve months later, the tool has usage but no agency pipeline.
- Hidden assumption: End-user lead capture and Aquila lead capture are the same funnel.
- Early warning signs: Many quiz submissions but few esthetician setup requests; repo traffic without consultation inquiries; people ask "can I use this?" but not "can you install/customize this?"
- Prevention: Add an explicit installer/buyer CTA in docs, demo pages, and examples: "Want this installed on your site?" Route that to Aquila. Separate consumer lead capture from business-owner lead capture.
- Contingency: If quiz usage rises without Aquila inquiries after 30-60 days, add a hosted setup request form and a packaged implementation offer.
- Owner: Josh/Aquila.

### 2. Setup Friction Kills Adoption

- Failure story: The open-source setup is technically simple for developers but still too much for estheticians. Render, env vars, webhook URLs, Zapier, Google Sheets, and frontend embed steps create abandonment.
- Hidden assumption: "Simple for us" means "simple for an esti."
- Early warning signs: Repeated questions about Render envs, Zapier setup, CORS, frontend embedding, or where leads go; few completed test submissions; users ask for "a video" before trying.
- Prevention: Create a one-page setup guide, a Zapier-to-Sheets tutorial, a sample Google Sheet, and a hosted demo with copyable settings.
- Contingency: If fewer than 5 non-team users complete setup unaided, sell/offer "Aquila installs this for you" instead of pushing self-serve.
- Owner: Aquila, with Josh owning the setup narrative.

### 3. Distribution Does Not Compound

- Failure story: The tool launches once in a community, gets some compliments, then fades. No search traffic, no template marketplace presence, no partner examples, no recurring content.
- Hidden assumption: A launch post is a distribution strategy.
- Early warning signs: Traffic spikes only after manual posting; no backlinks; no steady GitHub/referral traffic; no repeated mentions from estheticians.
- Prevention: Plan three channels before launch: esthetician community posts, SEO/tutorial content, and public examples/templates. Turn setup questions into content.
- Contingency: If traffic is flat after 45 days, stop adding features and run a distribution sprint with 10 direct outreach targets and 3 public tutorials.
- Owner: Josh/Aquila.

### 4. Results Are Not Trusted Enough To Share

- Failure story: Users enter contact info, receive a generic routine, and either distrust it or feel it is too bland to be worth handing to clients. Estheticians hesitate to embed it because it might make them look careless.
- Hidden assumption: Deterministic scoring plus disclaimers are enough to feel professional.
- Early warning signs: Estheticians ask "who wrote these recommendations?"; requests for customization before adoption; low share/save rates; feedback that language feels generic.
- Prevention: Make the result conservative, esthetician-friendly, and explicitly starter-level. Add a professional review CTA. Get 3-5 estheticians to critique result copy before broader launch.
- Contingency: If trust is the blocker, add editable copy templates and a "review before sending" mode before adding AI.
- Owner: Aquila plus esthetician reviewers.

### 5. No Conversion Ladder To Aquila Work

- Failure story: The free tool is useful, but the next step is vague. Users do not know Aquila can customize, install, host, brand, or extend it. ChekIt becomes a helpful artifact, not a sales asset.
- Hidden assumption: People will infer the paid offer.
- Early warning signs: Positive comments but no booked calls; people ask for features in GitHub issues instead of asking for paid help; no repeatable sales language.
- Prevention: Define a small paid ladder:
  - Free: open-source Routine Blueprint.
  - Low-friction: done-for-you install/setup.
  - Mid: branded quiz plus Zapier/CRM integration.
  - High: custom skincare/clinic product workflow.
- Contingency: If no paid inquiries after initial launch, add pricing anchors or "starting at" language for setup/customization.
- Owner: Josh/Aquila.

### 6. Privacy And Compliance Ambiguity Slows Serious Users

- Failure story: Because the quiz collects skin concerns and contact info, serious clinics worry about privacy, consent, and data handling. The open-source project says "not medical advice," but the implementation story is vague.
- Hidden assumption: A disclaimer is enough.
- Early warning signs: Questions about where data is stored, who owns submissions, whether ChekIt sees client info, and whether consent is required.
- Prevention: Document the privacy model clearly: ChekIt Core does not store submissions in v1; webhook destination is controlled by the deployer; deployers are responsible for consent and privacy language.
- Contingency: If privacy questions dominate, add a consent-copy snippet and example privacy text.
- Owner: Aquila.

### 7. Zapier-Only Storage Fails Operationally

- Failure story: Webhook delivery is configured incorrectly, Zapier plan limitations surprise users, spreadsheet columns do not map cleanly, and leads silently fail to arrive. Estheticians blame the tool.
- Hidden assumption: Zapier-to-Sheets is obvious and reliable enough.
- Early warning signs: Delivery `failed` statuses; users cannot find webhook payloads; confusion about Zapier plan requirements; malformed spreadsheet rows.
- Prevention: Provide a test payload, screenshots, expected Google Sheet columns, and a troubleshooting checklist. Make delivery status visible in API responses and docs.
- Contingency: If webhook setup repeatedly fails, add a basic "send test webhook" endpoint or CLI/doc command.
- Owner: Aquila/dev.

### 8. Open-Source Support Burden Exceeds Lead Value

- Failure story: The repo attracts setup questions, feature requests, and support needs from people who will never buy. The team spends time maintaining a free tool while client work suffers.
- Hidden assumption: Open-source attention is cheap.
- Early warning signs: Issues skew toward beginner setup help; repeated custom integration requests without budget; support time is not tracked.
- Prevention: Keep scope tight, document boundaries, use issue templates, and point custom setup requests to Aquila's paid offer.
- Contingency: If support exceeds 2-3 hours/week without qualified leads, freeze features and move support into paid setup or community-only responses.
- Owner: Josh/Aquila.

## Revised Plan

1. Keep the current v1 technical direction: required lead contact, webhook-first delivery, no SQLite submission storage.
2. Add a hosted demo before launch so estheticians can experience the result without deploying anything.
3. Add a "done-for-you setup" CTA everywhere an esthetician would hit friction: README, demo, setup guide, Zapier tutorial, and footer copy.
4. Build the Zapier-to-Google-Sheets tutorial as part of launch, not after. Include a sample sheet and expected columns.
5. Validate result trust with 3-5 estheticians before public push. Ask whether they would embed it on their site and what copy would make them comfortable.
6. Define success metrics before launch:
   - 20 esthetician/business-owner contacts in first 60 days.
   - 5 successful non-team setups or 5 setup calls booked.
   - 2 qualified Aquila conversations from ChekIt in first 90 days.
   - Less than 2 hours/week support burden after docs are published.
7. Add a decision gate after 60 days:
   - If setup friction is the blocker, package paid setup.
   - If result trust is the blocker, improve copy/templates.
   - If distribution is the blocker, pause features and run outreach/content.
   - If Aquila conversion is the blocker, redesign the CTA and offer.

## Pre-Launch Checklist

- [ ] Hosted demo exists — owner: Aquila — evidence: public URL with working Routine Blueprint flow.
- [ ] Lead contact gate is tested — owner: dev — evidence: missing contact returns `400`; email/social submission returns result.
- [ ] Zapier-to-Google-Sheets tutorial exists — owner: Aquila — evidence: screenshot walkthrough plus sample payload.
- [ ] Sample Google Sheet columns are defined — owner: Aquila — evidence: copyable sheet or column list.
- [ ] Delivery failure behavior is documented — owner: dev — evidence: docs show skipped/failed/sent examples.
- [ ] Esthetician review is complete — owner: Josh — evidence: 3-5 reviewers give specific feedback on result language.
- [ ] Aquila conversion CTA exists — owner: Josh/Aquila — evidence: demo/docs include "done-for-you setup/customization" path.
- [ ] Success metrics are written down — owner: Josh — evidence: 60/90-day targets tracked somewhere visible.
- [ ] Support boundary is clear — owner: Aquila — evidence: README says what is free support vs paid implementation.
- [ ] Privacy model is documented — owner: Aquila — evidence: docs explain webhook-owned data, no local submission storage, and deployer responsibility.

## Open Questions

- Is the primary paid conversion "done-for-you install," "custom branded quiz," or broader beauty/clinic product work?
- Will Aquila host a public demo, or should each esthetician deploy their own?
- Should the contact gate require consent, or only recommend it?
- What is the first launch channel: esthetician community, ChekIt audience, GitHub/open-source, or direct outreach?
- Who owns follow-up when someone asks for setup help?

## Appendix: Notes And Assumptions

- This report assumes the current `feature/routine-blueprint` branch is the beta candidate.
- This report treats Zapier/Google Sheets as the v1 lead storage strategy.
- This report assumes the failure horizon is 12 months, as requested.
- The core warning: a lead magnet has to capture the right lead. End-user skincare leads help estheticians. Aquila needs an explicit business-owner/installer funnel.
