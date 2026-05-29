# AuthPilot

Specialty clinic prior-authorization copilot.

This is a first-pass interactive MVP starter for the SaaS opportunity brief. It is intentionally narrow: a workflow command center with seeded domain records, local state, prioritization logic, status filtering, an assistant draft panel, and deployment-ready CI.

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

The repo includes a committed `docs` build for GitHub Pages. Configure Pages to serve from `main` / `docs`.

## Money path

The first sale should be a paid pilot, not a free demo.

- Pilot hook: Sell a paid clinic workflow mapping sprint before software access; convert the mapped packet checklist into the first pilot.
- Close script: Pilot offer: reduce intake-to-submission time for a defined PA class or extend implementation support at no extra fee.
- Checkout: Stripe Payment Links through `VITE_STRIPE_PILOT_URL`, `VITE_STRIPE_SCALE_URL`, and `VITE_STRIPE_ENTERPRISE_URL` at build time
- Fallback lead capture: GitHub Issues prefilled from the in-app checkout CTA when Stripe links are not configured
- Recommended first outreach: 25 hand-picked buyers with the ROI calculator screenshot and one workflow-specific audit offer

### Pricing

- Pilot: 3500/mo, 36000 annual - One specialty clinic pod
- Scale: 9600/mo, 96000 annual - Multi-location specialty groups
- Network: 22000/mo, 220000 annual - MSOs and RCM operators
