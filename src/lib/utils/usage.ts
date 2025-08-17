export function isUsageLimitReached(used: number, limit: number): boolean {
  return limit !== -1 && used >= limit
}

export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0 // unlimited
  return Math.min((used / limit) * 100, 100)
}

export function shouldResetUsage(lastReset: Date): boolean {
  const now = new Date()
  const resetDate = new Date(lastReset)
  resetDate.setMonth(resetDate.getMonth() + 1)
  return now >= resetDate
}
