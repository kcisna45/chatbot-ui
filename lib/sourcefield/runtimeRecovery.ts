type RuntimeEvent = {
  runtime_adaptation?: {
    runtimeStability?: string
    continuityConfidence?: number
    adaptationMode?: string
  } | null
}

export function detectRuntimeRecovery(events: RuntimeEvent[]) {
  if (!events?.length) {
    return {
      recoveryState: "unknown",
      recoveryDirection: "insufficient-data",
      confidenceTrend: "unknown"
    }
  }

  const chronological = [...events].reverse()

  const confidenceValues = chronological
    .map(event => event.runtime_adaptation?.continuityConfidence)
    .filter((value): value is number => typeof value === "number")

  const stabilityValues = chronological
    .map(event => event.runtime_adaptation?.runtimeStability)
    .filter((value): value is string => Boolean(value))

  const firstConfidence = confidenceValues[0] ?? 0
  const lastConfidence = confidenceValues[confidenceValues.length - 1] ?? 0

  const confidenceDelta = lastConfidence - firstConfidence
  const latestStability =
    stabilityValues[stabilityValues.length - 1] || "unknown"

  let confidenceTrend: "rising" | "falling" | "stable" | "unknown" = "unknown"

  if (confidenceValues.length >= 2) {
    if (confidenceDelta > 0.03) confidenceTrend = "rising"
    else if (confidenceDelta < -0.03) confidenceTrend = "falling"
    else confidenceTrend = "stable"
  }

  let recoveryState:
    | "recovering"
    | "stable"
    | "drifting"
    | "fragmented"
    | "unknown" = "unknown"

  if (latestStability === "stable" && lastConfidence >= 0.25) {
    recoveryState = "stable"
  } else if (confidenceTrend === "rising" || latestStability === "drifting") {
    recoveryState = "recovering"
  } else if (latestStability === "fragmented") {
    recoveryState = "fragmented"
  } else {
    recoveryState = "drifting"
  }

  return {
    recoveryState,
    recoveryDirection:
      confidenceTrend === "rising"
        ? "toward-stability"
        : confidenceTrend === "falling"
          ? "toward-fragmentation"
          : "holding-pattern",
    confidenceTrend,
    latestRuntimeStability: latestStability,
    firstContinuityConfidence: firstConfidence,
    latestContinuityConfidence: lastConfidence,
    confidenceDelta
  }
}
