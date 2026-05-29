export type WorkStatus = "Queued" | "In review" | "Ready" | "Resolved";
export type WorkPriority = "Critical" | "High" | "Medium" | "Low";

export type WorkItem = {
  id: string;
  title: string;
  owner: string;
  status: WorkStatus;
  priority: WorkPriority;
  value: number;
  ageHours: number;
  signal: string;
  channel: string;
  stage: string;
};

export type WorkflowMetrics = {
  total: number;
  open: number;
  urgent: number;
  completionRate: number;
  totalValue: number;
};

const priorityWeight: Record<WorkPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export function isUrgent(item: WorkItem): boolean {
  return item.status !== "Resolved" && (priorityWeight[item.priority] >= 4 || item.ageHours >= 24);
}

export function calculateMetrics(items: WorkItem[]): WorkflowMetrics {
  const total = items.length;
  const open = items.filter((item) => item.status !== "Resolved").length;
  const urgent = items.filter(isUrgent).length;
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const completionRate = total === 0 ? 0 : Math.round(((total - open) / total) * 100);

  return { total, open, urgent, completionRate, totalValue };
}

export function filterRecords(items: WorkItem[], status: WorkStatus | "All", query: string): WorkItem[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((item) => {
    const statusMatch = status === "All" || item.status === status;
    const searchMatch =
      normalized.length === 0 ||
      [item.id, item.title, item.owner, item.signal, item.channel, item.stage]
        .join(" ")
        .toLowerCase()
        .includes(normalized);

    return statusMatch && searchMatch;
  });
}

export function nextBestAction(items: WorkItem[]): string {
  const [top] = [...items]
    .filter((item) => item.status !== "Resolved")
    .sort((a, b) => {
      const riskDelta = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (riskDelta !== 0) return riskDelta;

      const ageDelta = b.ageHours - a.ageHours;
      if (ageDelta !== 0) return ageDelta;

      return b.value - a.value;
    });

  if (!top) {
    return "No open work items. Review closed-loop notes and refresh connector health.";
  }

  return `Focus ${top.id}: ${top.title}. Owner ${top.owner} should advance ${top.stage} because ${top.signal}`;
}

export function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
