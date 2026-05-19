export type RuntimeAdaptationState = {
  adaptationMode: "stabilize" | "clarify" | "synthesize"

  symbolicRestraint: "low" | "medium" | "high"

  synthesisDepth: "low" | "medium" | "deep"

  continuityConfidence: number

  runtimeStability: "stable" | "drifting" | "fragmented"
}

export function generateRuntimeAdaptation(
  coherence?: number | null,
  phaseDivergence?: number | null,
  continuityGuidance?: string | null
): RuntimeAdaptationState {
  const safeCoherence = typeof coherence === "number" ? coherence : 0

  const safePhase =
    typeof phaseDivergence === "number" ? phaseDivergence : Math.PI / 2

  let adaptationMode: "stabilize" | "clarify" | "synthesize" = "clarify"

  let symbolicRestraint: "low" | "medium" | "high" = "medium"

  let synthesisDepth: "low" | "medium" | "deep" = "medium"

  let runtimeStability: "stable" | "drifting" | "fragmented" = "stable"

  if (safeCoherence < 0.05) {
    adaptationMode = "clarify"
    symbolicRestraint = "high"
    synthesisDepth = "low"
    runtimeStability = "fragmented"
  } else if (safeCoherence < 0.25) {
    adaptationMode = "stabilize"
    symbolicRestraint = "medium"
    synthesisDepth = "medium"
    runtimeStability = "drifting"
  } else {
    adaptationMode = "synthesize"
    symbolicRestraint = "low"
    synthesisDepth = "deep"
    runtimeStability = "stable"
  }

  if (safePhase > 1.5) {
    symbolicRestraint = "high"
  }

  const continuityConfidence = Math.max(
    0,
    Math.min(1, safeCoherence * (1 - safePhase / Math.PI))
  )

  return {
    adaptationMode,
    symbolicRestraint,
    synthesisDepth,
    continuityConfidence,
    runtimeStability
  }
}
