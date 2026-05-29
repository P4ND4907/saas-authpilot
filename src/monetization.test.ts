import { describe, expect, it } from "vitest";
import {
  calculateRoi,
  recommendPlan,
  resolveCheckoutTarget,
  type PricingPlan,
} from "./monetization";

const plans: PricingPlan[] = [
  {
    name: "Pilot",
    monthlyPrice: 1000,
    annualPrice: 12000,
    bestFor: "Design partners",
    promise: "Prove one money metric",
    features: ["One workflow", "Founder onboarding"],
  },
  {
    name: "Scale",
    monthlyPrice: 3000,
    annualPrice: 36000,
    bestFor: "Growing teams",
    promise: "Expand the workflow",
    features: ["More workflows", "Executive reporting"],
  },
];

describe("monetization helpers", () => {
  it("calculates annual savings, net return, payback, and ROI", () => {
    expect(
      calculateRoi({
        monthlyPain: 10000,
        improvementRate: 0.25,
        annualPrice: 24000,
      }),
    ).toEqual({
      annualSavings: 30000,
      annualCost: 24000,
      netReturn: 6000,
      paybackMonths: 9.6,
      roiPercent: 25,
    });
  });

  it("recommends a scale plan when savings clear the expansion threshold", () => {
    expect(recommendPlan(plans, 140000)?.name).toBe("Scale");
    expect(recommendPlan(plans, 24000)?.name).toBe("Pilot");
  });

  it("uses Stripe checkout when a payment link exists", () => {
    expect(
      resolveCheckoutTarget({
        stripeUrl: "https://buy.stripe.com/test_123",
      }),
    ).toEqual({
      href: "https://buy.stripe.com/test_123",
      label: "Checkout with Stripe",
      isStripe: true,
      disabled: false,
    });
  });

  it("does not fall back to GitHub issues when Stripe is not configured", () => {
    expect(
      resolveCheckoutTarget({
        stripeUrl: "",
      }),
    ).toEqual({
      href: "#stripe-checkout-required",
      label: "Stripe checkout required",
      isStripe: false,
      disabled: true,
    });
  });
});
