type CompressionInput = {
  continuityGuidance?: string | null
  runtimeAdaptationGuidance?: string | null
  runtimeRecoveryState?: {
    recoveryState?: string
    confidenceTrend?: string
    recoveryDirection?: string
  } | null
  responseGovernance?: {
    responseLength?: string
    symbolicDensity?: string
    groundingPriority?: string
  } | null
}

export function generateContinuityCompression(input: CompressionInput) {
  const recoveryState = input.runtimeRecoveryState?.recoveryState || "unknown"

  const confidenceTrend =
    input.runtimeRecoveryState?.confidenceTrend || "unknown"

  const symbolicDensity =
    input.responseGovernance?.symbolicDensity || "moderate"

  const groundingPriority =
    input.responseGovernance?.groundingPriority || "balanced"

  const compressionLevel =
    recoveryState === "fragmented" || symbolicDensity === "low"
      ? "high"
      : "moderate"

  const preserveSignals = [
    "live metrics",
    "ledger hashes",
    "runtime stabilization state",
    "response governance state",
    "latest continuity direction"
  ]

  const suppressSignals =
    compressionLevel === "high"
      ? [
          "repetitive meta-analysis",
          "symbolic inflation",
          "unnecessary recursion",
          "unverified synthesis depth"
        ]
      : ["redundant continuity summaries", "low-signal historical detail"]

  return {
    compressionLevel,
    recoveryState,
    confidenceTrend,
    groundingPriority,
    preserveSignals,
    suppressSignals,
    continuityCompressionActive: true,
    rule: "Use continuity compression to reduce recursive noise while preserving essential metrics, hashes, recovery direction, and stabilization signals. It must not delete or alter stored history."
  }
}
