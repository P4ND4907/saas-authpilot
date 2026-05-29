import type { WorkItem } from "./domain";

export const product = {
  "name": "AuthPilot",
  "short": "AuthPilot",
  "tagline": "Specialty clinic prior-authorization copilot",
  "buyer": "Clinic Operator and RCM Lead",
  "accent": "#d94a4a",
  "accentSoft": "#fdecec",
  "accentDark": "#9a2d2d",
  "icon": "Stethoscope",
  "mission": "Assemble complete prior-auth packets, track payer status, and keep staff handoffs visible without making clinical decisions.",
  "primaryAction": "Assemble PA packet",
  "heroStat": "13.5 staff hours saved",
  "insights": [
    "Documentation gaps create the longest intake-to-submission delays.",
    "Human approval is required before all submissions and appeals.",
    "Next integration: payer API status polling where available."
  ],
  "integrations": [
    "FHIR",
    "HL7",
    "EHR",
    "Payer APIs",
    "Secure messaging"
  ],
  "repo": "saas-authpilot",
  "githubOwner": "P4ND4907",
  "pricingPlans": [
    {
      "name": "Pilot",
      "monthlyPrice": 3500,
      "annualPrice": 36000,
      "bestFor": "One specialty clinic pod",
      "promise": "Reduce packet assembly time for one high-friction service line.",
      "features": [
        "PA intake queue",
        "Packet checklist",
        "Appeal draft workflow"
      ]
    },
    {
      "name": "Scale",
      "monthlyPrice": 9600,
      "annualPrice": 96000,
      "bestFor": "Multi-location specialty groups",
      "promise": "Standardize payer handoffs and denial visibility.",
      "features": [
        "FHIR-first workflow",
        "Payer analytics",
        "Staff workload reporting"
      ]
    },
    {
      "name": "Network",
      "monthlyPrice": 22000,
      "annualPrice": 220000,
      "bestFor": "MSOs and RCM operators",
      "promise": "Operate prior auth across specialties without losing auditability.",
      "features": [
        "BAA-ready controls",
        "Custom EHR connectors",
        "Implementation program"
      ]
    }
  ],
  "money": {
    "painLabel": "Monthly admin and delayed-revenue pain",
    "improvementLabel": "Expected staff-time or delay reduction",
    "defaultMonthlyPain": 65000,
    "minMonthlyPain": 10000,
    "maxMonthlyPain": 500000,
    "painStep": 5000,
    "defaultImprovementRate": 0.22,
    "proof": "Sell a paid clinic workflow mapping sprint before software access; convert the mapped packet checklist into the first pilot.",
    "guarantee": "Pilot offer: reduce intake-to-submission time for a defined PA class or extend implementation support at no extra fee."
  }
};

export const initialRecords: WorkItem[] = [
  {
    "id": "PA-7729",
    "title": "Infusion therapy documentation gap",
    "owner": "Cam",
    "status": "In review",
    "priority": "Critical",
    "value": 12600,
    "ageHours": 38,
    "signal": "Missing lab result and step-therapy note before payer submission.",
    "channel": "FHIR",
    "stage": "Packet check"
  },
  {
    "id": "PA-7711",
    "title": "MRI authorization status stalled",
    "owner": "Rae",
    "status": "Queued",
    "priority": "High",
    "value": 5100,
    "ageHours": 19,
    "signal": "Payer portal has no status update after SLA threshold.",
    "channel": "Payer portal",
    "stage": "Follow-up queue"
  },
  {
    "id": "APL-109",
    "title": "Orthopedics denial appeal draft",
    "owner": "Mika",
    "status": "Ready",
    "priority": "Medium",
    "value": 7400,
    "ageHours": 9,
    "signal": "Appeal letter has coverage criteria citations for human review.",
    "channel": "EHR",
    "stage": "Appeal review"
  },
  {
    "id": "PA-7660",
    "title": "Cardiology approval recorded",
    "owner": "Lee",
    "status": "Resolved",
    "priority": "Low",
    "value": 2900,
    "ageHours": 4,
    "signal": "Approval number stored and appointment released.",
    "channel": "HL7",
    "stage": "Approved"
  }
];
