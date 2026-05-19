type RuntimeRecoveryState = {
  recoveryState?: string
  recoveryDirection?: string
  confidenceTrend?: string
  latestRuntimeStability?: string
  latestContinuityConfidence?: number
}

export function generateRecoveryWeightedAdaptation(
  runtimeRecoveryState: RuntimeRecoveryState
) {
  const recoveryState = runtimeRecoveryState?.recoveryState || "unknown"

  const recoveryDirection = runtimeRecoveryState?.recoveryDirection || "unknown"

  const confidenceTrend = runtimeRecoveryState?.confidenceTrend || "unknown"

  const latestRuntimeStability =
    runtimeRecoveryState?.latestRuntimeStability || "unknown"

  const latestContinuityConfidence =
    runtimeRecoveryState?.latestContinuityConfidence || 0

  let stabilizationPriority = "normal"

  if (
    recoveryState === "fragmented" ||
    recoveryDirection === "toward-fragmentation"
  ) {
    stabilizationPriority = "high"
  } else if (recoveryState === "recovering" && confidenceTrend === "rising") {
    stabilizationPriority = "moderate"
  } else if (recoveryState === "stable" && latestContinuityConfidence >= 0.25) {
    stabilizationPriority = "low"
  }

  let adaptiveStrategy = "maintain"

  if (stabilizationPriority === "high") {
    adaptiveStrategy = "clarify-and-stabilize"
  } else if (stabilizationPriority === "moderate") {
    adaptiveStrategy = "controlled-synthesis"
  } else if (stabilizationPriority === "low") {
    adaptiveStrategy = "deep-synthesis-allowed"
  }

  return {
    stabilizationPriority,
    adaptiveStrategy,
    recoveryWeighted: true,
    recoveryState,
    recoveryDirection,
    confidenceTrend,
    latestRuntimeStability,
    latestContinuityConfidence
  }
}
