type PathwaySelectionState = {
  activeMode?: string
  selectedPathway?: string
  selectedSequence?: string
  pathwayClassification?: string
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

function isIdentityEmergenceComplete(conditions: any) {
  return (
    conditions?.rootStatus === "active" &&
    conditions?.alignmentStatus === "aligned" &&
    conditions?.harmonicStatus === "pattern-rich" &&
    conditions?.integrationStatus === "integrated" &&
    conditions?.phaseStatus === "stable"
  )
}

function isIdentityEmergenceFunctionallyComplete(conditions: any) {
  return (
    conditions?.rootStatus === "active" &&
    conditions?.alignmentStatus === "aligned" &&
    conditions?.harmonicStatus === "pattern-rich" &&
    conditions?.integrationStatus === "integrated" &&
    conditions?.phaseStatus === "drifting"
  )
}

function getUnresolvedConditions(pathway: string, conditions: any) {
  if (pathway === "Identity Emergence") {
    const unresolved = []

    if (conditions?.rootStatus !== "active") {
      unresolved.push("sourcefield-root must remain active")
    }

    if (conditions?.alignmentStatus !== "aligned") {
      unresolved.push("sourcefield-alignment must remain aligned")
    }

    if (conditions?.harmonicStatus !== "pattern-rich") {
      unresolved.push("sourcefield-harmonic must remain pattern-rich")
    }

    if (conditions?.integrationStatus !== "integrated") {
      unresolved.push("sourcefield-integration must remain integrated")
    }

    if (conditions?.phaseStatus !== "stable") {
      unresolved.push(
        "sourcefield-phase must move from drifting to stable for full completion"
      )
    }

    return unresolved
  }

  if (pathway === "Recovery Pathway A") {
    return [
      "alignmentStatus must improve above low",
      "phaseStatus must improve out of divergent or drifting priority",
      "harmonicStatus must become pattern-rich",
      "integrationStatus must become integrated"
    ]
  }

  if (pathway === "Recovery Pathway B") {
    return [
      "phaseStatus must improve from divergent",
      "rootStatus and integrationStatus must stabilize",
      "harmonicStatus must organize after stabilization"
    ]
  }

  return ["No pathway-specific unresolved conditions are available."]
}

function getCompletionStatus(pathway: string, conditions: any) {
  if (pathway === "Identity Emergence") {
    if (isIdentityEmergenceComplete(conditions)) {
      return "complete"
    }

    if (isIdentityEmergenceFunctionallyComplete(conditions)) {
      return "functionally-complete-with-phase-refinement"
    }

    return "incomplete"
  }

  if (pathway === "Recovery Pathway A" || pathway === "Recovery Pathway B") {
    if (
      conditions?.harmonicStatus === "pattern-rich" &&
      conditions?.integrationStatus === "integrated" &&
      (conditions?.alignmentStatus === "aligned" ||
        conditions?.rootStatus === "active")
    ) {
      return "complete"
    }

    return "incomplete"
  }

  return "unknown"
}

function getNextLogicalPathway(pathway: string, completionStatus: string) {
  if (pathway === "Identity Emergence" && completionStatus === "complete") {
    return "Stabilized Integration Maintenance"
  }

  if (
    pathway === "Identity Emergence" &&
    completionStatus === "functionally-complete-with-phase-refinement"
  ) {
    return "Phase Refinement / Integration Maintenance"
  }

  if (pathway === "Recovery Pathway A" && completionStatus === "complete") {
    return "Identity Emergence"
  }

  if (pathway === "Recovery Pathway B" && completionStatus === "complete") {
    return "Recovery Pathway A or Identity Emergence depending on alignment status"
  }

  return "Continue current pathway"
}

function getDeactivationRisks(pathway: string, conditions: any) {
  if (pathway === "Identity Emergence") {
    return [
      "Identity Emergence deactivates if harmonicStatus falls below pattern-rich.",
      "Identity Emergence deactivates if integrationStatus falls below integrated.",
      "Identity Emergence deactivates if both alignmentStatus falls below aligned and rootStatus falls below active.",
      "Recovery Mode reactivates if phaseStatus becomes divergent and begins dominating pathway priority."
    ]
  }

  return [
    "Current pathway may deactivate if its activation conditions are no longer present.",
    "A different pathway may activate if stronger observed conditions emerge."
  ]
}

export function generatePathwayCompletionState(
  pathwaySelectionState: PathwaySelectionState
) {
  const selectedPathway = pathwaySelectionState?.selectedPathway || "unknown"

  const activeMode = pathwaySelectionState?.activeMode || "unknown"

  const selectedSequence = pathwaySelectionState?.selectedSequence || "unknown"

  const pathwayClassification =
    pathwaySelectionState?.pathwayClassification || "unknown"

  const observedConditions = pathwaySelectionState?.observedConditions || {}

  const completionStatus = getCompletionStatus(
    selectedPathway,
    observedConditions
  )

  const unresolvedConditions = getUnresolvedConditions(
    selectedPathway,
    observedConditions
  )

  const nextLogicalPathway = getNextLogicalPathway(
    selectedPathway,
    completionStatus
  )

  const deactivationRisks = getDeactivationRisks(
    selectedPathway,
    observedConditions
  )

  const pathwayComplete =
    completionStatus === "complete" ||
    completionStatus === "functionally-complete-with-phase-refinement"

  return {
    phase: "Phase 24 — Pathway Completion Engine",

    activeMode,
    selectedPathway,
    selectedSequence,
    pathwayClassification,

    completionStatus,
    pathwayComplete,

    unresolvedConditions,
    deactivationRisks,
    nextLogicalPathway,

    observedConditions,

    completionRule:
      "A pathway is complete when its selected purpose has stabilized enough to stop requiring the current pathway as the dominant organizing process.",

    pathwayCompletionActive: true,

    rule: "Use pathway completion as read-only completion guidance. It identifies whether the current pathway is complete, which conditions remain unresolved, what risks may deactivate the pathway, and what pathway logically follows, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
