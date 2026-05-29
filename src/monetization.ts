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

export function buildLeadMailto(input: {
  productName: string;
  buyer: string;
  planName: string;
  annualSavings: number;
  email: string;
}): string {
  const savings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(input.annualSavings);
  const subject = encodeURIComponent(`${input.productName} paid pilot request`);
  const body = encodeURIComponent(
    `Product: ${input.productName}\nPlan: ${input.planName}\nBuyer: ${input.buyer}\nEstimated annual savings: ${savings}\n\nI want to discuss a paid pilot.`,
  );

  return `mailto:${encodeURIComponent(input.email)}?subject=${subject}&body=${body}`;
}

export function buildLeadIssueUrl(input: {
  owner: string;
  repo: string;
  productName: string;
  buyer: string;
  planName: string;
  annualSavings: number;
}): string {
  const savings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(input.annualSavings);
  const body = [
    `Product: ${input.productName}`,
    `Plan: ${input.planName}`,
    `Buyer: ${input.buyer}`,
    `Estimated annual savings: ${savings}`,
    "",
    "Pilot goal:",
    "Timeline:",
    "Current systems:",
  ].join("\n");
  const params = new URLSearchParams({
    title: `[Pilot] ${input.productName} - ${input.planName}`,
    body,
  });

  return `https://github.com/${input.owner}/${input.repo}/issues/new?${params.toString()}`;
}

export function resolveCheckoutTarget(input: {
  stripeUrl?: string;
  fallbackUrl: string;
}): { href: string; label: string; isStripe: boolean } {
  const stripeUrl = input.stripeUrl?.trim() ?? "";
  const isStripe = stripeUrl.startsWith("https://buy.stripe.com/");

  if (isStripe) {
    return {
      href: stripeUrl,
      label: "Checkout with Stripe",
      isStripe: true,
    };
  }

  return {
    href: input.fallbackUrl,
    label: "Request paid pilot",
    isStripe: false,
  };
}
