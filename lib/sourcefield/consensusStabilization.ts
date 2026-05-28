type CrossAgentConsensus = {
  consensusState?: string
  stabilityRisk?: string
  dominantConcern?: string
}

type RuntimeStabilization = {
  compressionMode?: string
  groundingMode?: string
  symbolicThrottle?: string
  recoveryFloor?: number
  stabilizationPriority?: string
  adaptiveStrategy?: string
}

export function generateConsensusStabilization(
  crossAgentConsensus: CrossAgentConsensus,
  runtimeStabilization: RuntimeStabilization
) {
  const consensusState = crossAgentConsensus?.consensusState || "unknown"

  const stabilityRisk = crossAgentConsensus?.stabilityRisk || "unknown"

  const dominantConcern = crossAgentConsensus?.dominantConcern || "unknown"

  const baseStrategy = runtimeStabilization?.adaptiveStrategy || "maintain"

  let enforcementMode = "observe-only"
  let laneAlignmentPriority = "normal"
  let stabilizationDirective = baseStrategy

  if (
    consensusState === "divergent" ||
    dominantConcern === "alignment-between-lanes"
  ) {
    enforcementMode = "soft-align"
    laneAlignmentPriority = "high"
    stabilizationDirective = "clarify-lane-differences"
  }

  if (consensusState === "unstable" || stabilityRisk === "high") {
    enforcementMode = "stabilize-and-align"
    laneAlignmentPriority = "critical"
    stabilizationDirective = "ground-and-reduce-divergence"
  }

  if (consensusState === "aligned" && stabilityRisk === "low") {
    enforcementMode = "maintain-coherence"
    laneAlignmentPriority = "low"
    stabilizationDirective = "preserve-current-stability"
  }

  return {
    consensusState,
    stabilityRisk,
    dominantConcern,
    enforcementMode,
    laneAlignmentPriority,
    stabilizationDirective,
    consensusStabilizationActive: true,
    rule: "Use consensus stabilization as read-only enforcement guidance. It may shape how lane divergence is clarified and stabilized, but it must not override metrics, classifications, hashes, retrieval context, stored history, or user intent."
  }
}
