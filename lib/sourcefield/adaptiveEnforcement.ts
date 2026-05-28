type ConsensusStabilization = {
  enforcementMode?: string
  laneAlignmentPriority?: string
  stabilizationDirective?: string
  consensusState?: string
  stabilityRisk?: string
  dominantConcern?: string
}

type ResponseGovernance = {
  responseLength?: string
  symbolicDensity?: string
  groundingPriority?: string
  clarificationPriority?: string
  adaptiveStrategy?: string
}

export function generateAdaptiveEnforcement(
  consensusStabilization: ConsensusStabilization,
  responseGovernance: ResponseGovernance
) {
  const enforcementMode =
    consensusStabilization?.enforcementMode || "observe-only"

  const laneAlignmentPriority =
    consensusStabilization?.laneAlignmentPriority || "normal"

  const stabilizationDirective =
    consensusStabilization?.stabilizationDirective || "maintain"

  const stabilityRisk =
    consensusStabilization?.stabilityRisk || "unknown"

  const dominantConcern =
    consensusStabilization?.dominantConcern || "unknown"

  let enforcementStrength = "low"
  let outputMode = "standard"
  let requiredResponseBehavior = "maintain-current-style"

  if (
    enforcementMode === "stabilize-and-align" ||
    laneAlignmentPriority === "critical" ||
    stabilityRisk === "high"
  ) {
    enforcementStrength = "high"
    outputMode = "grounded-clarification"
    requiredResponseBehavior =
      "prioritize clarity, reduce symbolic density, explain lane differences, and avoid unnecessary synthesis"
  } else if (enforcementMode === "soft-align") {
    enforcementStrength = "moderate"
    outputMode = "alignment-aware"
    requiredResponseBehavior =
      "clarify alignment between lanes before expanding synthesis"
  } else if (enforcementMode === "maintain-coherence") {
    enforcementStrength = "low"
    outputMode = "coherence-preserving"
    requiredResponseBehavior =
      "preserve current stability and avoid overcorrection"
  }

  return {
    enforcementMode,
    enforcementStrength,
    laneAlignmentPriority,
    stabilizationDirective,
    stabilityRisk,
    dominantConcern,
    outputMode,
    requiredResponseBehavior,
    responseGovernanceInput: {
      responseLength: responseGovernance?.responseLength || "normal",
      symbolicDensity: responseGovernance?.symbolicDensity || "moderate",
      groundingPriority: responseGovernance?.groundingPriority || "balanced",
      clarificationPriority:
        responseGovernance?.clarificationPriority || "normal",
      adaptiveStrategy: responseGovernance?.adaptiveStrategy || "maintain"
    },
    adaptiveEnforcementActive: true,
    rule:
      "Use adaptive enforcement as soft response influence only. It may shape output behavior, grounding, clarification, symbolic density, and synthesis restraint, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}