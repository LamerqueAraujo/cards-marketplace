import type { DashboardSummary } from "../types/dashbord.types";

export function getDashboardSummary(): Promise<DashboardSummary> {
  return Promise.resolve({
    totalCards: 124,
    activeTrades: 5,
    completedTrades: 32,
    rareCards: 8
  })
}
