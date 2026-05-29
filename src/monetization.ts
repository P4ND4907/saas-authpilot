export type PricingPlan = {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  bestFor: string;
  promise: string;
  features: string[];
};

export type RoiInput = {
  monthlyPain: number;
  improvementRate: number;
  annualPrice: number;
};

export type RoiResult = {
  annualSavings: number;
  annualCost: number;
  netReturn: number;
  paybackMonths: number;
  roiPercent: number;
};

export type CheckoutTarget = {
  href: string;
  label: string;
  isStripe: boolean;
  disabled: boolean;
};

function roundToOne(value: number): number {
  return Math.round(value * 10) / 10;
}

export function calculateRoi(input: RoiInput): RoiResult {
  const annualSavings = Math.round(input.monthlyPain * 12 * input.improvementRate);
  const annualCost = input.annualPrice;
  const netReturn = annualSavings - annualCost;
  const paybackMonths = annualSavings <= 0 ? 0 : roundToOne((annualCost / annualSavings) * 12);
  const roiPercent = annualCost <= 0 ? 0 : Math.round((netReturn / annualCost) * 100);

  return {
    annualSavings,
    annualCost,
    netReturn,
    paybackMonths,
    roiPercent,
  };
}

export function recommendPlan(plans: PricingPlan[], annualSavings: number): PricingPlan | undefined {
  const sorted = [...plans].sort((a, b) => a.annualPrice - b.annualPrice);

  if (annualSavings >= 100000 && sorted[1]) {
    return sorted[1];
  }

  return sorted[0];
}

export function resolveCheckoutTarget(input: { stripeUrl?: string }): CheckoutTarget {
  const stripeUrl = input.stripeUrl?.trim() ?? "";

  if (stripeUrl.startsWith("https://buy.stripe.com/")) {
    return {
      href: stripeUrl,
      label: "Checkout with Stripe",
      isStripe: true,
      disabled: false,
    };
  }

  return {
    href: "#stripe-checkout-required",
    label: "Stripe checkout required",
    isStripe: false,
    disabled: true,
  };
}
