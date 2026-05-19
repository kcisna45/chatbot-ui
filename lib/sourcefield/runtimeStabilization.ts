type RuntimeStabilizationInput = {
  runtimeAdaptation?: {
    adaptationMode?: string
    symbolicRestraint?: string
    synthesisDepth?: string
    continuityConfidence?: number
    runtimeStability?: string
  } | null

  runtimeRecoveryState?: {
    recoveryState?: string
    recoveryDirection?: string
    confidenceTrend?: string
    latestContinuityConfidence?: number
  } | null

  recoveryWeightedAdaptation?: {
    stabilizationPriority?: string
    adaptiveStrategy?: string
  } | null
}

export function generateRuntimeStabilization(input: RuntimeStabilizationInput) {
  const confidence =
    input.runtimeAdaptation?.continuityConfidence ??
    input.runtimeRecoveryState?.latestContinuityConfidence ??
    0

  const recoveryState = input.runtimeRecoveryState?.recoveryState || "unknown"

  const stabilizationPriority =
    input.recoveryWeightedAdaptation?.stabilizationPriority || "normal"

  const adaptiveStrategy =
    input.recoveryWeightedAdaptation?.adaptiveStrategy || "maintain"

  const recoveryFloor = Math.max(confidence, 0.03)

  const compressionMode =
    stabilizationPriority === "high" ? "strong" : "moderate"

  const groundingMode =
    recoveryState === "fragmented" ? "operational-first" : "balanced"

  const symbolicThrottle =
    stabilizationPriority === "high" ? "maximum" : "adaptive"

  return {
    compressionMode,
    groundingMode,
    symbolicThrottle,
    recoveryFloor,
    stabilizationPriority,
    adaptiveStrategy,
    runtimeStabilizationActive: true,
    rule: "Use stabilization as read-only response governance. It may shape clarity, compression, grounding, and symbolic restraint, but it must not override live metrics."
  }
}
