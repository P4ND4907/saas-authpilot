import { describe, expect, it } from "vitest";
import { calculateMetrics, filterRecords, nextBestAction, type WorkItem } from "./domain";

const sample: WorkItem[] = [
  {
    id: "A-1",
    title: "Critical stalled workflow",
    owner: "Ari",
    status: "In review",
    priority: "Critical",
    value: 12000,
    ageHours: 34,
    signal: "High-value work is waiting for approval.",
    channel: "Inbox",
    stage: "Review",
  },
  {
    id: "B-2",
    title: "Medium ready workflow",
    owner: "Bo",
    status: "Ready",
    priority: "Medium",
    value: 2000,
    ageHours: 5,
    signal: "Ready to route.",
    channel: "API",
    stage: "Ready",
  },
  {
    id: "C-3",
    title: "Closed workflow",
    owner: "Cy",
    status: "Resolved",
    priority: "Low",
    value: 1000,
    ageHours: 1,
    signal: "Finished.",
    channel: "Email",
    stage: "Done",
  },
];

describe("workflow domain helpers", () => {
  it("summarizes open, urgent, and value metrics", () => {
    expect(calculateMetrics(sample)).toEqual({
      total: 3,
      open: 2,
      urgent: 1,
      completionRate: 33,
      totalValue: 15000,
    });
  });

  it("filters records by status and search text", () => {
    expect(filterRecords(sample, "Ready", "")).toHaveLength(1);
    expect(filterRecords(sample, "All", "critical")).toEqual([sample[0]]);
  });

  it("selects the highest-risk open item as the next best action", () => {
    expect(nextBestAction(sample)).toContain("A-1");
    expect(nextBestAction(sample)).toContain("Critical stalled workflow");
  });
});
