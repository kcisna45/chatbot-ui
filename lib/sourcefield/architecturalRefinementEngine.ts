type ArchitecturalRefinementInput = {
  pathwayCompletionState?: any
  pathwaySelectionState?: any
  equationLaneState?: any
}

function getLane(equationLaneState: any, laneName: string) {
  return equationLaneState?.equationLanes?.find(
    (lane: any) => lane?.lane === laneName
  )
}

function getStatus(equationLaneState: any, laneName: string) {
  return getLane(equationLaneState, laneName)?.status || "unknown"
}

function getValue(equationLaneState: any, laneName: string, key: string) {
  return getLane(equationLaneState, laneName)?.[key] ?? null
}

export function generateArchitecturalRefinementState(
  input: ArchitecturalRefinementInput
) {
  const equationLaneState = input?.equationLaneState
  const pathwayCompletionState = input?.pathwayCompletionState
  const pathwaySelectionState = input?.pathwaySelectionState

  const rootStatus = getStatus(equationLaneState, "sourcefield-root")
  const harmonicStatus = getStatus(equationLaneState, "sourcefield-harmonic")
  const phaseStatus = getStatus(equationLaneState, "sourcefield-phase")
  const integrationStatus = getStatus(
    equationLaneState,
    "sourcefield-integration"
  )
  const alignmentStatus = getStatus(equationLaneState, "sourcefield-alignment")

  const signalStrength = getValue(
    equationLaneState,
    "sourcefield-root",
    "signalStrength"
  )

  const symbolicEchoCount = getValue(
    equationLaneState,
    "sourcefield-harmonic",
    "symbolicEchoCount"
  )

  const phaseDivergence = getValue(
    equationLaneState,
    "sourcefield-phase",
    "phaseDivergence"
  )

  const integrationThreshold = getValue(
    equationLaneState,
    "sourcefield-integration",
    "integrationThreshold"
  )

  const coherence = getValue(
    equationLaneState,
    "sourcefield-alignment",
    "coherence"
  )

  const stablePatternReady =
    rootStatus === "active" &&
    (harmonicStatus === "pattern-rich" || harmonicStatus === "pattern-detected")

  const persistenceThroughFluctuation =
    integrationStatus === "integrated" &&
    (phaseStatus === "stable" || phaseStatus === "drifting")

  const alignmentValidationReady =
    alignmentStatus === "aligned" || alignmentStatus === "partial"

  let refinementStatus = "unresolved"

  if (
    stablePatternReady &&
    persistenceThroughFluctuation &&
    alignmentStatus === "aligned" &&
    phaseStatus === "stable"
  ) {
    refinementStatus = "fully-refined"
  } else if (
    stablePatternReady &&
    persistenceThroughFluctuation &&
    alignmentStatus === "aligned"
  ) {
    refinementStatus = "functionally-refined-with-phase-refinement"
  } else if (stablePatternReady && persistenceThroughFluctuation) {
    refinementStatus = "refinement-forming"
  } else if (stablePatternReady) {
    refinementStatus = "pattern-architecture-detected"
  }

  const refinementTarget =
    phaseStatus !== "stable"
      ? "sourcefield-phase stabilization"
      : alignmentStatus !== "aligned"
        ? "sourcefield-alignment validation"
        : integrationStatus !== "integrated"
          ? "sourcefield-integration persistence"
          : harmonicStatus !== "pattern-rich"
            ? "sourcefield-harmonic pattern enrichment"
            : rootStatus !== "active"
              ? "sourcefield-root activation"
              : "architectural maintenance"

  const architecturalSequence = [
    {
      stage: "Stage 1",
      equationPair: "Eq1 + Eq4",
      name: "Rooted Pattern Recognition",
      function:
        "Identifies whether a stable foundational pattern is recurring across harmonic pattern structure.",
      status: stablePatternReady ? "active" : "incomplete",
      evidence: {
        rootStatus,
        harmonicStatus,
        signalStrength,
        symbolicEchoCount
      }
    },
    {
      stage: "Stage 2",
      equationPair: "Eq3 + Eq5",
      name: "Persistence Through Fluctuation",
      function:
        "Evaluates whether integration remains stable while phase continues to fluctuate.",
      status: persistenceThroughFluctuation ? "active" : "incomplete",
      evidence: {
        phaseStatus,
        integrationStatus,
        phaseDivergence,
        integrationThreshold
      }
    },
    {
      stage: "Stage 3",
      equation: "Eq2",
      name: "Alignment Validation",
      function:
        "Validates whether the refined architecture remains coherent through alignment over time.",
      status: alignmentValidationReady ? "active" : "incomplete",
      evidence: {
        alignmentStatus,
        coherence
      }
    }
  ]

  const refinementReason = [
    stablePatternReady
      ? "Eq1 + Eq4 indicates that a rooted harmonic pattern is available for refinement."
      : "Eq1 + Eq4 has not yet confirmed a stable recurring pattern.",
    persistenceThroughFluctuation
      ? "Eq3 + Eq5 indicates that integration is persisting through phase fluctuation."
      : "Eq3 + Eq5 has not yet confirmed persistence through fluctuation.",
    alignmentValidationReady
      ? "Eq2 indicates that alignment validation is available."
      : "Eq2 indicates that alignment validation is not yet sufficient."
  ]

  const nextRefinementMove =
    refinementStatus === "fully-refined"
      ? "Maintain refined architecture and monitor for drift."
      : refinementStatus === "functionally-refined-with-phase-refinement"
        ? "Refine sourcefield-phase from drifting to stable while preserving root, harmonic, integration, and alignment support."
        : refinementStatus === "refinement-forming"
          ? "Strengthen sourcefield-alignment so the emerging architecture can be validated over time."
          : refinementStatus === "pattern-architecture-detected"
            ? "Strengthen integration persistence so the rooted harmonic pattern can survive fluctuation."
            : "Rebuild rooted harmonic pattern support before refinement can proceed."

  return {
    phase: "Phase 25 — Architectural Refinement Engine",

    refinementPathway: "(Eq1 + Eq4) → (Eq3 + Eq5) → Eq2",

    refinementPurpose:
      "Convert functionally complete emergence into refined architecture by identifying rooted recurring pattern, testing persistence through fluctuation, and validating alignment over time.",

    refinementStatus,
    refinementTarget,
    nextRefinementMove,

    architecturalSequence,

    refinementReason,

    sourceCompletionStatus:
      pathwayCompletionState?.completionStatus || "unknown",

    sourcePathwayComplete: pathwayCompletionState?.pathwayComplete ?? false,

    sourceSelectedPathway: pathwaySelectionState?.selectedPathway || "unknown",

    sourceActiveMode: pathwaySelectionState?.activeMode || "unknown",

    observedConditions: {
      rootStatus,
      harmonicStatus,
      phaseStatus,
      integrationStatus,
      alignmentStatus,
      signalStrength,
      symbolicEchoCount,
      phaseDivergence,
      integrationThreshold,
      coherence
    },

    architecturalRefinementActive: true,

    rule: "Use architectural refinement as read-only refinement guidance. It evaluates the pathway (Eq1 + Eq4) → (Eq3 + Eq5) → Eq2 to identify rooted recurring pattern, persistence through fluctuation, alignment validation, refinement status, and next refinement target, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
