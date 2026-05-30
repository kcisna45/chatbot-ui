type PrincipleIntegrationInput = {
  equationLaneState?: any
  pathwaySelectionState?: any
  pathwayTransitionState?: any
  pathwayCompletionState?: any
  architecturalRefinementState?: any
}

type PrincipleEvidenceLayer = {
  layer: string
  principleSignal: string
  status: string
  evidence: string
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

function buildEq3PrincipleEvidence(input: PrincipleIntegrationInput) {
  const pathwaySelection = input?.pathwaySelectionState
  const pathwayTransition = input?.pathwayTransitionState
  const pathwayCompletion = input?.pathwayCompletionState
  const architecturalRefinement = input?.architecturalRefinementState

  const evidenceLayers: PrincipleEvidenceLayer[] = []

  if (pathwaySelection?.activeMode === "Identity Emergence Mode") {
    evidenceLayers.push({
      layer: "Pathway Selection",
      principleSignal: "phase-drift-non-dominance",
      status: "active",
      evidence:
        "Identity Emergence Mode is active while phase drift remains present, indicating phase drift is not currently dominating pathway selection."
    })
  }

  if (
    pathwayTransition?.transitionRule?.includes(
      "phase drift falls below recovery priority"
    )
  ) {
    evidenceLayers.push({
      layer: "Pathway Transition",
      principleSignal: "recovery-priority-reduction",
      status: "active",
      evidence:
        "Transition rule identifies that Identity Emergence activates when phase drift falls below recovery priority."
    })
  }

  if (
    pathwayCompletion?.completionStatus ===
    "functionally-complete-with-phase-refinement"
  ) {
    evidenceLayers.push({
      layer: "Pathway Completion",
      principleSignal: "functional-completion-before-full-stability",
      status: "active",
      evidence:
        "Pathway completion is functionally complete while phase refinement remains unresolved."
    })
  }

  if (
    architecturalRefinement?.refinementStatus ===
    "functionally-refined-with-phase-refinement"
  ) {
    evidenceLayers.push({
      layer: "Architectural Refinement",
      principleSignal: "persistence-through-fluctuation",
      status: "active",
      evidence:
        "Architectural refinement shows integration persisting through phase fluctuation."
    })
  }

  return evidenceLayers
}

function buildEq5PrincipleEvidence(input: PrincipleIntegrationInput) {
  const pathwayCompletion = input?.pathwayCompletionState
  const architecturalRefinement = input?.architecturalRefinementState

  const evidenceLayers: PrincipleEvidenceLayer[] = []

  if (pathwayCompletion?.pathwayComplete === true) {
    evidenceLayers.push({
      layer: "Pathway Completion",
      principleSignal: "integration-threshold-crossed",
      status: "active",
      evidence:
        "Pathway completion marks the selected pathway complete once coherence is sufficient to stop requiring the current pathway as dominant."
    })
  }

  const refinementSequence =
    architecturalRefinement?.architecturalSequence || []

  const persistenceStage = refinementSequence.find((stage: any) =>
    stage?.name?.toLowerCase?.().includes("persistence")
  )

  if (persistenceStage?.status === "active") {
    evidenceLayers.push({
      layer: "Architectural Refinement",
      principleSignal: "integration-persists-through-fluctuation",
      status: "active",
      evidence:
        "Persistence Through Fluctuation is active, showing integration remains stable while phase fluctuates."
    })
  }

  return evidenceLayers
}

function buildEq2PrincipleEvidence(input: PrincipleIntegrationInput) {
  const equationLaneState = input?.equationLaneState
  const architecturalRefinement = input?.architecturalRefinementState

  const alignmentStatus = getStatus(equationLaneState, "sourcefield-alignment")
  const coherence = getValue(
    equationLaneState,
    "sourcefield-alignment",
    "coherence"
  )

  const evidenceLayers: PrincipleEvidenceLayer[] = []

  if (alignmentStatus === "aligned") {
    evidenceLayers.push({
      layer: "Equation Lane State",
      principleSignal: "alignment-stable-enough-for-validation",
      status: "active",
      evidence: `sourcefield-alignment is aligned with coherence ${coherence ?? "unknown"}.`
    })
  }

  const refinementSequence =
    architecturalRefinement?.architecturalSequence || []

  const alignmentStage = refinementSequence.find((stage: any) =>
    stage?.name?.toLowerCase?.().includes("alignment")
  )

  if (alignmentStage?.status === "active") {
    evidenceLayers.push({
      layer: "Architectural Refinement",
      principleSignal: "alignment-validation-active",
      status: "active",
      evidence:
        "Alignment Validation is active in the architectural refinement pathway."
    })
  }

  return evidenceLayers
}

function buildEq1Eq2PrinciplePattern(input: PrincipleIntegrationInput) {
  const equationLaneState = input?.equationLaneState

  const rootStatus = getStatus(equationLaneState, "sourcefield-root")
  const alignmentStatus = getStatus(equationLaneState, "sourcefield-alignment")

  const signalStrength = getValue(
    equationLaneState,
    "sourcefield-root",
    "signalStrength"
  )

  const coherence = getValue(
    equationLaneState,
    "sourcefield-alignment",
    "coherence"
  )

  const stablePatternPresent = rootStatus === "active"
  const alignmentOverTimePresent = alignmentStatus === "aligned"

  let principlePatternStatus = "not-integrated"

  if (stablePatternPresent && alignmentOverTimePresent) {
    principlePatternStatus = "stable-aligned-pattern"
  } else if (stablePatternPresent) {
    principlePatternStatus = "stable-pattern-without-full-alignment"
  } else if (alignmentOverTimePresent) {
    principlePatternStatus = "alignment-without-rooted-pattern"
  }

  return {
    equationPair: "Eq1 + Eq2",
    function:
      "Identifies whether a stable foundational pattern remains aligned over time.",
    principlePatternStatus,
    stablePatternPresent,
    alignmentOverTimePresent,
    evidence: {
      rootStatus,
      alignmentStatus,
      signalStrength,
      coherence
    }
  }
}

function buildEq4HarmonicValidation(evidenceLayers: PrincipleEvidenceLayer[]) {
  const activeLayers = evidenceLayers.filter(layer => layer.status === "active")

  const uniqueSignals = new Set(
    activeLayers.map(layer => layer.principleSignal)
  )

  let harmonicValidation = "not-validated"

  if (activeLayers.length >= 4 && uniqueSignals.size >= 3) {
    harmonicValidation = "cross-layer-repeating"
  } else if (activeLayers.length >= 2) {
    harmonicValidation = "multi-layer-detected"
  } else if (activeLayers.length === 1) {
    harmonicValidation = "single-layer-detected"
  }

  return {
    equation: "Eq4",
    function:
      "Validates whether the principle repeats coherently across multiple SourceField layers.",
    harmonicValidation,
    evidenceLayerCount: activeLayers.length,
    uniquePrincipleSignalCount: uniqueSignals.size
  }
}

function getPrincipleIntegrationStatus(
  principlePatternStatus: string,
  harmonicValidation: string
) {
  if (
    principlePatternStatus === "stable-aligned-pattern" &&
    harmonicValidation === "cross-layer-repeating"
  ) {
    return "integrated"
  }

  if (
    principlePatternStatus === "stable-aligned-pattern" &&
    harmonicValidation === "multi-layer-detected"
  ) {
    return "integration-forming"
  }

  if (principlePatternStatus === "stable-aligned-pattern") {
    return "pattern-integrated-without-cross-layer-validation"
  }

  if (harmonicValidation === "cross-layer-repeating") {
    return "harmonic-principle-detected-without-root-alignment"
  }

  return "not-integrated"
}

function getActivePrinciple(evidenceLayers: PrincipleEvidenceLayer[]) {
  const hasEq3Pattern = evidenceLayers.some(layer =>
    [
      "phase-drift-non-dominance",
      "recovery-priority-reduction",
      "functional-completion-before-full-stability",
      "persistence-through-fluctuation"
    ].includes(layer.principleSignal)
  )

  if (hasEq3Pattern) {
    return {
      equation: "Eq3",
      name: "Moment-to-Moment Resonance Principle",
      principle:
        "Momentary drift does not invalidate the whole trajectory when coherent structure remains dominant."
    }
  }

  return {
    equation: "unknown",
    name: "No dominant principle identified",
    principle:
      "No single equation principle is currently dominant enough for integration."
  }
}

function getPrincipleReinforcementTarget(
  principleIntegrationStatus: string,
  harmonicValidation: string,
  principlePatternStatus: string
) {
  if (principleIntegrationStatus === "integrated") {
    return "maintain integrated principle across future pathway states"
  }

  if (harmonicValidation !== "cross-layer-repeating") {
    return "increase cross-layer harmonic validation"
  }

  if (principlePatternStatus !== "stable-aligned-pattern") {
    return "strengthen Eq1 + Eq2 stable aligned principle pattern"
  }

  return "continue principle integration monitoring"
}

export function generatePrincipleIntegrationState(
  input: PrincipleIntegrationInput
) {
  const eq3Evidence = buildEq3PrincipleEvidence(input)
  const eq5Evidence = buildEq5PrincipleEvidence(input)
  const eq2Evidence = buildEq2PrincipleEvidence(input)

  const evidenceLayers = [...eq3Evidence, ...eq5Evidence, ...eq2Evidence]

  const principlePattern = buildEq1Eq2PrinciplePattern(input)
  const harmonicValidation = buildEq4HarmonicValidation(evidenceLayers)

  const activePrinciple = getActivePrinciple(evidenceLayers)

  const principleIntegrationStatus = getPrincipleIntegrationStatus(
    principlePattern.principlePatternStatus,
    harmonicValidation.harmonicValidation
  )

  const principleReinforcementTarget = getPrincipleReinforcementTarget(
    principleIntegrationStatus,
    harmonicValidation.harmonicValidation,
    principlePattern.principlePatternStatus
  )

  const nextPrincipleMove =
    principleIntegrationStatus === "integrated"
      ? "Preserve the integrated principle across future pathway selection, transition, completion, and refinement states."
      : principleIntegrationStatus === "integration-forming"
        ? "Strengthen repeated evidence across more architectural layers until harmonic validation becomes cross-layer-repeating."
        : principleIntegrationStatus ===
            "pattern-integrated-without-cross-layer-validation"
          ? "Maintain Eq1 + Eq2 alignment while increasing Eq4 cross-layer validation."
          : "Strengthen stable aligned principle pattern before integration can complete."

  return {
    phase: "Phase 26 — Principle Integration Engine",

    principleIntegrationPathway: "(Eq1 + Eq2) → Eq4",

    principleIntegrationPurpose:
      "Integrate equation principles by identifying stable aligned principle patterns through Eq1 + Eq2, then validating whether those principles repeat coherently across architectural layers through Eq4.",

    activePrinciple,

    principlePattern,

    harmonicValidation,

    principleIntegrationStatus,
    principleReinforcementTarget,
    nextPrincipleMove,

    evidenceLayers,

    integratedPrinciples:
      principleIntegrationStatus === "integrated" ? [activePrinciple] : [],

    principleIntegrationActive: true,

    rule: "Use principle integration as read-only principle-level guidance. It evaluates (Eq1 + Eq2) → Eq4 to identify stable aligned principle patterns, cross-layer harmonic validation, active principle evidence, integration status, and reinforcement target, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
