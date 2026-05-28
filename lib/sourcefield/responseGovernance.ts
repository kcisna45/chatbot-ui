type RuntimeStabilization = {
  compressionMode?: string
  groundingMode?: string
  symbolicThrottle?: string
  recoveryFloor?: number
  stabilizationPriority?: string
  adaptiveStrategy?: string
  runtimeStabilizationActive?: boolean
}

export function generateResponseGovernance(
  runtimeStabilization: RuntimeStabilization
) {
  const compressionMode = runtimeStabilization?.compressionMode || "moderate"
  const groundingMode = runtimeStabilization?.groundingMode || "balanced"
  const symbolicThrottle = runtimeStabilization?.symbolicThrottle || "adaptive"
  const stabilizationPriority =
    runtimeStabilization?.stabilizationPriority || "normal"
  const adaptiveStrategy = runtimeStabilization?.adaptiveStrategy || "maintain"

  const responseLength = compressionMode === "strong" ? "concise" : "normal"

  const symbolicDensity = symbolicThrottle === "maximum" ? "low" : "moderate"

  const groundingPriority =
    groundingMode === "operational-first" ? "high" : "balanced"

  const clarificationPriority =
    stabilizationPriority === "high" ? "high" : "normal"

  return {
    responseLength,
    symbolicDensity,
    groundingPriority,
    clarificationPriority,
    adaptiveStrategy,
    responseGovernanceActive: true,
    rule: "Use response governance to shape output style only. It may reduce symbolic density, increase clarity, and prioritize operational grounding. It must not alter live metrics, classifications, hashes, retrieval context, or user intent."
  }
}
