# ChekIt Routine Blueprint

ChekIt Routine Blueprint is a planned lead-generation quiz and routine recommendation layer for ChekIt Core.

The goal is to let an esthetician or AI site builder create a simple, attractive frontend that asks 10 or fewer questions, submits answers to the ChekIt backend, and receives a plain-English skincare routine blueprint.

## Product Goals

- Keep the frontend simple enough for AI-assisted site builders to understand.
- Keep the backend responsible for scoring, tie-breaking, lead payload shape, and optional delivery.
- Keep access free and avoid requiring email in exchange for results.
- Capture optional email, phone, Instagram, or other socials when users want follow-up or client-ready next steps.
- Avoid database, email provider, or CRM complexity in v1.
- Use Zapier Webhooks as the assumed setup path for non-technical estheticians.
- Keep delivery generic under the hood so estheticians can also route leads to Make, Shopify through an automation tool, a CRM, email tools, or their own webhook endpoint.
- Let the frontend decide whether the user sees results immediately, after confirmation, by email only, or both.

## Working Name

Preferred name: ChekIt Routine Blueprint.

Avoid leading with "diagnostic" in public copy unless carefully framed, because it can sound medical. "Routine Blueprint" feels useful, friendly, and non-clinical.

## Standard Questions

V1 should use standard questions only. Custom questions can come later after the scoring model is stable.

1. By midday, your skin usually feels...
   - Tight or flaky
   - Shiny or oily
   - Oily in the T-zone but dry or normal elsewhere
   - Comfortable and balanced
   - Unpredictable or reactive

2. After cleansing, your skin usually feels...
   - Comfortable
   - Tight
   - Greasy again quickly
   - Stingy, hot, or red
   - It depends on the cleanser

3. What are your top concerns? Pick up to 3.
   - Breakouts
   - Clogged pores
   - Texture
   - Dark spots or post-breakout marks
   - Redness
   - Dryness
   - Fine lines
   - Sensitivity

4. How often do you break out?
   - Rarely
   - Around my cycle or occasionally
   - Weekly
   - Most days

5. Do products often sting, burn, or cause redness?
   - No
   - Sometimes
   - Often
   - Only when I use active products

6. Do you have flaking, tightness, roughness, or a "nothing moisturizes enough" feeling?
   - No
   - Mild
   - Moderate
   - Severe

7. What are you currently using? Select all that apply.
   - Cleanser
   - Moisturizer
   - Sunscreen
   - Exfoliant or acids
   - Retinoid
   - Benzoyl peroxide
   - Vitamin C
   - None or not sure

8. How often do you use exfoliants, retinoids, benzoyl peroxide, or other strong active products?
   - Never
   - 1-2 times per week
   - 3-4 times per week
   - Daily
   - Multiple active products daily

9. How often do you wear sunscreen in the morning?
   - Daily
   - Most days
   - Only when I will be outside
   - Rarely
   - Never

10. What kind of help are you looking for?
   - A simple starter routine
   - Acne-focused routine support
   - Calming or barrier support
   - Brightening or tone support
   - A professional consultation

## Lead Fields

Routine submissions should not require lead fields in v1. The free result is the value hook.

Recommended optional fields:

- `lead.name`
- `lead.email`
- `lead.phone`
- `lead.instagram`
- `lead.source`
- `lead.consentToContact`

If all lead fields are missing, the backend should still return the Routine Blueprint and mark the lead as a free user.

## Scoring Buckets

Each answer should add signals to a small set of known scoring buckets.

- Skin type: `dry`, `oily`, `combination`, `balanced`, `sensitive`
- Concerns: `acne`, `clogged_pores`, `texture`, `hyperpigmentation`, `redness`, `dryness`, `fine_lines`, `sensitivity`
- Barrier health: `stable`, `watch`, `compromised`
- Routine gaps: `cleanser`, `moisturizer`, `sunscreen`, `active_overuse`
- Sun exposure: `protected`, `inconsistent`, `unprotected`
- Lead intent: `starter`, `acne`, `barrier`, `brightening`, `consultation`

## Tie-Breaking

Avoid ambiguous "ties" by using deterministic tie-breakers.

Recommended approach:

1. Use weighted answer signals instead of single-point scoring.
2. If two skin type buckets tie, choose the safer/more conservative routine path.
3. Barrier concerns outrank actives. If barrier score is high, recommend calming and repair before exfoliation, retinoids, or acne actives.
4. Sunscreen gaps outrank brightening recommendations. If SPF is inconsistent, make SPF the first brightening step.
5. If acne and sensitivity both score high, recommend gentle acne support and professional consultation rather than aggressive active use.
6. If confidence is low, label the result as a starter blueprint and recommend consultation.

## Blueprint Output

The backend should return a structured result that any frontend can render.

Example shape:

```json
{
  "resultId": "routine_blueprint_v1",
  "summary": "Your answers suggest combination-leaning skin with clogged pores and a possible barrier watch-out.",
  "skinProfile": {
    "type": "combination",
    "concerns": ["clogged_pores", "texture"],
    "barrier": "watch",
    "sunProtection": "inconsistent"
  },
  "routine": {
    "morning": [
      "Gentle cleanser or rinse",
      "Lightweight moisturizer",
      "Broad-spectrum sunscreen"
    ],
    "evening": [
      "Gentle cleanser",
      "Barrier-supporting moisturizer"
    ],
    "weekly": [
      "Introduce active products slowly after the routine feels stable"
    ]
  },
  "flags": [
    "Prioritize daily sunscreen before brightening products",
    "Avoid stacking multiple strong active products"
  ],
  "leadScore": "qualified",
  "recommendedNextStep": "Book a consultation for a personalized acne-safe routine.",
  "disclaimer": "Educational only. Not medical advice."
}
```

## Confirmation And Results Flow

Frontend builders should be told to include a confirmation page after submission.

Suggested flow:

1. User answers the quiz.
2. User may enter email/social/contact details before submission, but this is optional.
3. Frontend submits answers to the backend.
4. Backend generates the routine blueprint.
5. Backend sends a delivery payload if an outbound destination is configured.
6. Frontend shows a confirmation page.
7. Depending on configuration, frontend may also show the user their results immediately.

Recommended confirmation copy:

"Your Routine Blueprint is ready. We sent your answers and recommendation details to the skincare professional connected to this form."

If user-visible results are enabled:

"You can review your starter blueprint below. If you asked for follow-up, your esthetician may send personalized recommendations."

## Webhook Delivery

Webhook delivery should be the primary v1 lead routing path.

Zapier should be the assumed tutorial path because it is familiar, approachable, and good enough for a warm lead tool. ChekIt should still implement a generic webhook POST, not a Zapier-specific integration.

Recommended simple env vars:

```bash
ROUTINE_WEBHOOK_URL=
ROUTINE_RESULT_VISIBILITY=show_results
```

`ROUTINE_WEBHOOK_URL` is the only integration variable most users should need. It can be a Zapier Catch Hook URL, Make webhook URL, Pipedream URL, n8n webhook URL, Activepieces webhook URL, or custom endpoint.

`ROUTINE_RESULT_VISIBILITY` controls what the frontend should show after submit:

- `show_results`: default. Show the user their free routine blueprint after submit.
- `confirmation_only`: show a success/confirmation page only.

Webhook payloads should include:

- lead fields
- raw answers
- scored profile
- routine blueprint
- flags
- lead score
- recommended next step
- result visibility
- timestamp
- source/widget id if supplied

This lets estheticians send data to services such as:

- Zapier
- Make
- Shopify
- CRM systems
- email marketing tools
- custom endpoints

Zapier note as of 2026-08-15: Zapier's official pricing and help docs list Webhooks by Zapier as available on Professional plans and higher, not the Free plan. ChekIt should document Zapier as an easy webhook option, but not promise that webhook-based routing works on Zapier Free.

## Zapier Tutorial Plan

Add a dedicated tutorial after v1 works:

1. Create a Zap.
2. Choose Webhooks by Zapier.
3. Select Catch Hook.
4. Copy the webhook URL.
5. Paste it into Render as `ROUTINE_WEBHOOK_URL`.
6. Set `ROUTINE_RESULT_VISIBILITY=confirmation_only` unless the esthetician wants users to see results.
7. Submit a test quiz from the frontend.
8. Confirm Zapier receives name, email, answers, routine blueprint, and lead score.
9. Add an action such as Gmail, Google Sheets, Shopify, HubSpot, Mailchimp, or Slack.
10. Turn the Zap on.

The tutorial should include screenshots later. The first implementation only needs clear docs and a predictable payload.

## Frontend Builder Expectations

The backend should do the heavy lifting. The frontend should be easy for an AI-assisted builder to create.

Frontend examples should support:

- Simple Typeform-like single-question flow by default
- Full-page or embedded usage
- required email collection
- optional name and phone fields
- progress indicator
- loading state
- confirmation page
- optional immediate result display
- easy color, font, button, and border-radius customization
- clear error handling if the backend is unavailable

The default frontend example should look clean and calm for estheticians: simple typography, generous spacing, soft but not childish styling, and no busy dashboard UI.

## Future AI Enhancement

AI analysis should not be required in v1.

Recommended future env vars:

```bash
ROUTINE_AI_ENABLED=false
OPENAI_API_KEY=
```

If enabled, the backend can generate a more polished plain-English summary from the same scored result. The frontend should never hold an AI API key.
