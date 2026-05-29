export const stripeLinksByPlan: Record<string, string | undefined> = {
  Pilot: import.meta.env.VITE_STRIPE_PILOT_URL,
  Scale: import.meta.env.VITE_STRIPE_SCALE_URL,
  Enterprise: import.meta.env.VITE_STRIPE_ENTERPRISE_URL,
  Network: import.meta.env.VITE_STRIPE_ENTERPRISE_URL,
};
