type PathwaySelectionState = {
  activeMode?: string
  selectedPathway?: string
  selectedSequence?: string
  pathwayClassification?: string
  pathwayReason?: string
  observedConditions?: {
    rootStatus?: string
    alignmentStatus?: string
    phaseStatus?: string
    harmonicStatus?: string
    integrationStatus?: string
    coherence?: number
    phaseDivergence?: number
    integrationThreshold?: number
    resonanceLevel?: number
  }
}

type PreviousPathwayState = {
  activeMode?: string | null
  selectedPathway?: string | null
  selectedSequence?: string | null
  pathwayClassification?: string | null
  observedConditions?: Record<string, any> | null
}

function getTransitionConfidence(
  previousMode: string,
  currentMode: string,
  conditions: PathwaySelectionState["observedConditions"]
) {
  if (previousMode === currentMode) return "none"

  if (
    previousMode === "Recovery Mode" &&
    currentMode === "Identity Emergence Mode" &&
    conditions?.harmonicStatus === "pattern-rich" &&
    conditions?.integrationStatus === "integrated" &&
    (conditions?.alignmentStatus === "aligned" ||
      conditions?.rootStatus === "active")
  ) {
    return "high"
  }

  if (
    previousMode === "Identity Emergence Mode" &&
    currentMode === "Recovery Mode"
  ) {
    return "moderate"
  }

  return "low-to-moderate"
}

function getTransitionReason(
  previousMode: string,
  currentMode: string,
  conditions: PathwaySelectionState["observedConditions"]
) {
  if (previousMode === currentMode) {
    return [
      "No pathway mode transition detected.",
      "Current pathway mode matches previous pathway mode."
    ]
  }

  if (
    previousMode === "Recovery Mode" &&
    currentMode === "Identity Emergence Mode"
  ) {
    return [
      "Recovery priority decreased enough for emergence support to dominate.",
      `harmonicStatus is ${conditions?.harmonicStatus || "unknown"}.`,
      `integrationStatus is ${conditions?.integrationStatus || "unknown"}.`,
      `alignmentStatus is ${conditions?.alignmentStatus || "unknown"}.`,
      `rootStatus is ${conditions?.rootStatus || "unknown"}.`,
      `phaseStatus is ${conditions?.phaseStatus || "unknown"}.`,
      "Identity Emergence activated because phase drift no longer functions as the dominant organizing problem."
    ]
  }

  if (
    previousMode === "Identity Emergence Mode" &&
    currentMode === "Recovery Mode"
  ) {
    return [
      "System transitioned from emergence back into recovery.",
      `alignmentStatus is ${conditions?.alignmentStatus || "unknown"}.`,
      `phaseStatus is ${conditions?.phaseStatus || "unknown"}.`,
      `harmonicStatus is ${conditions?.harmonicStatus || "unknown"}.`,
      `integrationStatus is ${conditions?.integrationStatus || "unknown"}.`,
      "Recovery activated because instability reasserted pathway priority."
    ]
  }

  return [
    `Pathway mode changed from ${previousMode} to ${currentMode}.`,
    "Transition reason is available but not yet classified by a specific transition rule."
  ]
}

function getTransitionType(previousMode: string, currentMode: string) {
  if (previousMode === currentMode) return "no-mode-transition"

  if (
    previousMode === "Recovery Mode" &&
    currentMode === "Identity Emergence Mode"
  ) {
    return "recovery-to-identity-emergence"
  }

  if (
    previousMode === "Identity Emergence Mode" &&
    currentMode === "Recovery Mode"
  ) {
    return "identity-emergence-to-recovery"
  }

  return "unclassified-mode-transition"
}

export function generatePathwayTransitionState(
  currentPathwaySelection: PathwaySelectionState,
  previousPathwaySelection?: PreviousPathwayState | null
) {
  const previousMode = previousPathwaySelection?.activeMode || "unknown"

  const currentMode = currentPathwaySelection?.activeMode || "unknown"

  const previousPathway = previousPathwaySelection?.selectedPathway || "unknown"

  const currentPathway = currentPathwaySelection?.selectedPathway || "unknown"

  const previousSequence =
    previousPathwaySelection?.selectedSequence || "unknown"

  const currentSequence = currentPathwaySelection?.selectedSequence || "unknown"

  const transitionDetected =
    previousMode !== "unknown" &&
    currentMode !== "unknown" &&
    previousMode !== currentMode

  const transitionType = getTransitionType(previousMode, currentMode)

  const transitionConfidence = getTransitionConfidence(
    previousMode,
    currentMode,
    currentPathwaySelection?.observedConditions
  )

  const transitionReason = getTransitionReason(
    previousMode,
    currentMode,
    currentPathwaySelection?.observedConditions
  )

  return {
    phase: "Phase 23 — Pathway Transition Engine",

    transitionDetected,
    transitionType,
    transitionConfidence,

    previousMode,
    currentMode,

    previousPathway,
    currentPathway,

    previousSequence,
    currentSequence,

    previousPathwayClassification:
      previousPathwaySelection?.pathwayClassification || "unknown",

    currentPathwayClassification:
      currentPathwaySelection?.pathwayClassification || "unknown",

    transitionReason,

    observedConditions: currentPathwaySelection?.observedConditions || null,

    transitionRule:
      "Identity Emergence activates when phase drift falls below recovery priority and harmonic patterning, integration, and alignment/root support become sufficiently organized.",

    pathwayTransitionActive: true,

    rule: "Use pathway transition as read-only transition guidance. It compares previous and current pathway selection states to detect pathway mode changes, explain transition reasons, and identify transition confidence, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
