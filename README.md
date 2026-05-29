# AuthPilot

Specialty clinic prior-authorization copilot.

This is a shippable static SaaS MVP for the opportunity brief. It includes the workflow command center, seeded domain records, prioritization logic, status filtering, ROI calculator, paid-pilot packaging, Stripe checkout wiring, tests, and a committed GitHub Pages build.

## MVP wedge

- Buyer: Clinic Operator and RCM Lead
- Promise: Assemble complete prior-auth packets, track payer status, and keep staff handoffs visible without making clinical decisions.
- First action: Assemble PA packet
- Integrations to prove first: FHIR, HL7, EHR, Payer APIs, Secure messaging

## Run locally

```bash
npm install
npm run test
npm run build
npm run dev
```

## Ship path

The repo serves GitHub Pages from `main` / `docs`. Use this when you update code or Stripe links:

```bash
npm run pages:build
git add -A
git commit -m "Update shipped site"
git push
```

## Money path

Checkout is Stripe-only. Buyers are not sent to GitHub Issues.

- Pilot hook: Sell a paid clinic workflow mapping sprint before software access; convert the mapped packet checklist into the first pilot.
- Close script: Pilot offer: reduce intake-to-submission time for a defined PA class or extend implementation support at no extra fee.
- Checkout links: `VITE_STRIPE_PILOT_URL`, `VITE_STRIPE_SCALE_URL`, and `VITE_STRIPE_ENTERPRISE_URL` at build time
- Recommended first outreach: 25 hand-picked buyers with the ROI calculator screenshot and one workflow-specific audit offer

Create live Stripe subscription Payment Links from the pricing table:

```bash
$env:STRIPE_SECRET_KEY="sk_live_your_key"
npm run stripe:links
npm run pages:build
git add -A
git commit -m "Ship live Stripe checkout"
git push
```

The Stripe script writes `.env.production.local` for Vite and `stripe-links.json` for your records. The secret key is never committed.

### Pricing

- Pilot: 3500/mo, 36000 annual - One specialty clinic pod
- Scale: 9600/mo, 96000 annual - Multi-location specialty groups
- Network: 22000/mo, 220000 annual - MSOs and RCM operators
