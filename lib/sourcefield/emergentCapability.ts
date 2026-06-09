type EmergentCapabilityInput = {
  equationLaneState?: any
  structuralContributionState?: any
  structuralRoleIdentificationState?: any
  structuralCompletionState?: any
  relationalPrincipleEmergenceState?: any
  resonanceWithoutRootsState?: any
  equationReasoningIntegrityState?: any
  reasoningTrajectoryState?: any
  reasoningImplicationPropagationState?: any
  routeReasoningPropagationState?: any
  identityFoundationState?: any
  identityCandidateProfileState?: any
  metaReasoningState?: any
  differentialMetaReasoningState?: any
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function numeric(value: any, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function bool(value: any) {
  return value === true
}

function getLane(equationLaneState: any, laneName: string) {
  return asArray(equationLaneState?.equationLanes).find(
    (lane: any) => lane?.lane === laneName
  )
}

function laneStatus(equationLaneState: any, laneName: string) {
  return text(getLane(equationLaneState, laneName)?.status)
}

function laneValue(equationLaneState: any, laneName: string, key: string) {
  return getLane(equationLaneState, laneName)?.[key]
}

function deriveStrength(status: string, value?: number) {
  if (status === "active") return 1
  if (status === "integrated") return 1
  if (status === "aligned") return 1
  if (status === "pattern-rich") return 1
  if (status === "pattern-detected") return 0.75
  if (status === "partial") return 0.6
  if (status === "subthreshold") return 0.35
  if (status === "weak") return 0.25
  if (status === "low") return 0.2
  if (status === "quiet") return 0.2
  if (status === "divergent") return 0.15

  if (typeof value === "number") {
    return Math.max(0, Math.min(1, Math.abs(value)))
  }

  return 0.4
}

function buildRelationalDifference(equationLaneState: any) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )

  return {
    stage: "(Eq2 + Eq3)",
    name: "Relational Difference",
    equationRole:
      "Eq2 and Eq3 identify how difference participates in relation before capability emergence is evaluated.",
    alignmentStatus,
    phaseStatus,
    coherence,
    phaseDivergence,
    relationStrength,
    differenceStrength,
    relationalDifferencePresent:
      relationStrength >= 0.2 && differenceStrength >= 0.15,
    emergenceQuestion: "How is the difference participating in relation?",
    emergenceMeaning:
      "Emergence begins when difference is not isolated, but begins interacting with relation."
  }
}

function buildDirectDifference(equationLaneState: any) {
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )

  return {
    stage: "Eq3",
    name: "Direct Difference Signal",
    equationRole:
      "Eq3 is isolated to identify what remains when the difference is viewed directly without root, recurrence, or continuity support.",
    phaseStatus,
    phaseDivergence,
    differenceStrength,
    directDifferenceActive: differenceStrength >= 0.15,
    emergenceQuestion:
      "What is uniquely present when the difference is observed directly?",
    emergenceMeaning:
      phaseStatus === "divergent"
        ? "The direct difference is active enough to be treated as an emergence signal."
        : "The direct difference is present but remains provisional as an emergence signal."
  }
}

function buildRelationalContinuityField(equationLaneState: any) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )
  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )
  const integrationThreshold = numeric(
    laneValue(
      equationLaneState,
      "sourcefield-integration",
      "integrationThreshold"
    ),
    0
  )

  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const recurrenceStrength = deriveStrength(
    harmonicStatus,
    symbolicEchoCount / 5
  )
  const continuityStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )

  const relationalContinuityPresent =
    relationStrength >= 0.2 &&
    (recurrenceStrength >= 0.2 || continuityStrength >= 0.25)

  return {
    stage: "(Eq2 + Eq4 + Eq5)",
    name: "Relational Continuity Field",
    equationRole:
      "Eq2, Eq4, and Eq5 identify whether relation, recurrence, and continuity form an environment capable of supporting emerging capability.",
    alignmentStatus,
    harmonicStatus,
    integrationStatus,
    coherence,
    symbolicEchoCount,
    integrationThreshold,
    relationStrength,
    recurrenceStrength,
    continuityStrength,
    relationalContinuityPresent,
    emergenceQuestion:
      "What stable relational continuity surrounds the difference?",
    emergenceMeaning: relationalContinuityPresent
      ? "A relational continuity field is present enough to support provisional emergence."
      : "The relational continuity field is weak, so emergence must remain provisional."
  }
}

function buildRecurringDifference(equationLaneState: any) {
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const recurrenceStrength = deriveStrength(
    harmonicStatus,
    symbolicEchoCount / 5
  )
  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )

  const recurringDifferencePresent =
    differenceStrength >= 0.15 && recurrenceStrength >= 0.2

  return {
    stage: "(Eq4 + Eq3)",
    name: "Recurring Difference",
    equationRole:
      "Eq4 and Eq3 identify which difference keeps returning as a pattern after relational continuity has been evaluated.",
    harmonicStatus,
    phaseStatus,
    symbolicEchoCount,
    phaseDivergence,
    recurrenceStrength,
    differenceStrength,
    recurringDifferencePresent,
    emergenceQuestion: "What recurring difference continues to appear?",
    emergenceMeaning: recurringDifferencePresent
      ? "The difference is recurring enough to be treated as an emergence candidate."
      : "The difference is active, but recurrence is not yet strong enough to confirm emergence."
  }
}

function inferEmergentCapability(input: EmergentCapabilityInput) {
  const contribution = input?.structuralContributionState || {}
  const role = input?.structuralRoleIdentificationState || {}
  const completion = input?.structuralCompletionState || {}

  const contributionType = text(contribution?.contributionType)
  const nextEmergentCapability = text(contribution?.nextEmergentCapability)
  const identifiedRole = text(role?.identifiedRole)
  const completionStatus = text(completion?.completionStatus)

  if (
    contributionType.toLowerCase().includes("foundational placement") ||
    identifiedRole.toLowerCase().includes("foundation-placement")
  ) {
    return {
      emergentCapability: "Placement Discernment Capability",
      capabilityMeaning:
        "The system is beginning to distinguish unresolved difference from misplaced structure.",
      capabilityFunction:
        "Allows recurring differences to be interpreted as placement signals instead of errors, noise, or rejection conditions.",
      capabilityDependency:
        "Requires provisional contribution readiness, legitimate role identification, and continued testing against foundational recurrence.",
      capabilityRisk:
        "If over-applied, the system may treat every difference as a placement signal before recurrence and relation are sufficiently verified.",
      capabilityUse:
        "Use this capability to ask where a recurring difference belongs before attempting completion or expansion."
    }
  }

  if (
    contributionType.toLowerCase().includes("right-relation") ||
    nextEmergentCapability.toLowerCase().includes("relation")
  ) {
    return {
      emergentCapability: "Right-Relation Ordering Capability",
      capabilityMeaning:
        "The system is beginning to convert difference into ordered relation.",
      capabilityFunction:
        "Allows the architecture to preserve distinction without fragmenting into disconnected states.",
      capabilityDependency:
        "Requires stronger Eq2 alignment and recurring relational continuity.",
      capabilityRisk:
        "If over-applied, the system may prematurely harmonize differences that still need direct inspection.",
      capabilityUse:
        "Use this capability to determine whether a difference is asking for ordering rather than elimination."
    }
  }

  if (completionStatus === "structurally-integrating") {
    return {
      emergentCapability: "Integration Transition Capability",
      capabilityMeaning:
        "The system is beginning to treat incomplete structure as a transition into higher integration.",
      capabilityFunction:
        "Allows partial integration to be interpreted as a bridge state rather than a failure state.",
      capabilityDependency:
        "Requires structural role identification and contribution readiness to remain active.",
      capabilityRisk:
        "If over-applied, the system may keep incomplete structures open too long without requiring placement.",
      capabilityUse:
        "Use this capability to determine what becomes possible while a structure is still integrating."
    }
  }

  return {
    emergentCapability: "Unclassified Emergent Capability",
    capabilityMeaning:
      "The system detects an emergence signal, but the capability is not yet specific enough to classify.",
    capabilityFunction:
      "Holds emergence under observation until role, contribution, and recurrence become clearer.",
    capabilityDependency:
      "Requires clearer structural contribution and recurring difference evidence.",
    capabilityRisk:
      "If over-applied, the system may claim emergence before the capability has differentiated.",
    capabilityUse:
      "Continue observing the recurring relational difference until a clearer capability appears."
  }
}

function buildCapabilityReadiness(
  relationalDifference: any,
  directDifference: any,
  relationalContinuityField: any,
  recurringDifference: any,
  structuralContributionState: any
) {
  const contributionReady =
    text(structuralContributionState?.contributionReadiness) ===
    "ready-for-provisional-contribution"

  const emergenceInputsReady =
    bool(relationalDifference?.relationalDifferencePresent) &&
    bool(directDifference?.directDifferenceActive) &&
    bool(relationalContinuityField?.relationalContinuityPresent)

  const recurrenceReady = bool(recurringDifference?.recurringDifferencePresent)

  const capabilityReadiness =
    contributionReady && emergenceInputsReady && recurrenceReady
      ? "ready-for-provisional-capability"
      : contributionReady && emergenceInputsReady
        ? "partial-capability-readiness"
        : "not-ready-for-capability"

  return {
    stage: "Capability Readiness",
    name: "Emergent Capability Readiness Audit",
    contributionReady,
    emergenceInputsReady,
    recurrenceReady,
    capabilityReadiness,
    readinessMeaning:
      capabilityReadiness === "ready-for-provisional-capability"
        ? "The contribution, relational difference, direct difference, continuity field, and recurring difference are ready to support a provisional emergent capability."
        : capabilityReadiness === "partial-capability-readiness"
          ? "The contribution and emergence inputs are present, but recurrence is not yet strong enough for full provisional capability."
          : "The system should not yet treat the observed pattern as an emergent capability."
  }
}

export function generateEmergentCapabilityState(
  input: EmergentCapabilityInput
) {
  const equationLaneState = input?.equationLaneState

  const relationalDifference = buildRelationalDifference(equationLaneState)
  const directDifference = buildDirectDifference(equationLaneState)
  const relationalContinuityField =
    buildRelationalContinuityField(equationLaneState)
  const recurringDifference = buildRecurringDifference(equationLaneState)

  const inferredCapability = inferEmergentCapability(input)

  const capabilityReadinessAudit = buildCapabilityReadiness(
    relationalDifference,
    directDifference,
    relationalContinuityField,
    recurringDifference,
    input?.structuralContributionState
  )

  const emergenceSynthesis =
    capabilityReadinessAudit.capabilityReadiness ===
    "ready-for-provisional-capability"
      ? `${inferredCapability.emergentCapability} is provisionally emerging through recurring relational difference.`
      : `${inferredCapability.emergentCapability} is indicated, but emergence remains provisional until recurrence and relational continuity strengthen.`

  return {
    phase: "Emergent Capability Layer",
    operationOrder: "(Eq2 + Eq3) → Eq3 → (Eq2 + Eq4 + Eq5) → (Eq4 + Eq3)",
    purpose:
      "Determine what new capability is attempting to emerge through recurring relational difference.",
    layerType: "generation-layer-after-structural-contribution",
    relationalDifference,
    directDifference,
    relationalContinuityField,
    recurringDifference,
    capabilityReadinessAudit,
    emergentCapability: inferredCapability.emergentCapability,
    capabilityMeaning: inferredCapability.capabilityMeaning,
    capabilityFunction: inferredCapability.capabilityFunction,
    capabilityDependency: inferredCapability.capabilityDependency,
    capabilityRisk: inferredCapability.capabilityRisk,
    capabilityUse: inferredCapability.capabilityUse,
    capabilityReadiness: capabilityReadinessAudit.capabilityReadiness,
    emergenceSynthesis,
    sourceContributionType: text(
      input?.structuralContributionState?.contributionType
    ),
    sourceRole: text(input?.structuralRoleIdentificationState?.identifiedRole),
    emergentCapabilityActive: true,
    rule: "This layer interprets what capability may emerge from an integrated contribution. It must not override metrics, memory, hashes, classifications, retrieved context, user intent, structural contribution, role identification, or completion state."
  }
}

export function buildEmergentCapabilityResponse(
  state: any,
  mode:
    | "summary"
    | "sequence"
    | "capability"
    | "readiness"
    | "risk"
    | "json" = "summary"
) {
  if (!state) {
    return "Emergent Capability State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "sequence") {
    return [
      "Emergent Capability Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      `1. ${state?.relationalDifference?.stage} — ${state?.relationalDifference?.name}`,
      `   emergenceQuestion: ${state?.relationalDifference?.emergenceQuestion}`,
      `   emergenceMeaning: ${state?.relationalDifference?.emergenceMeaning}`,
      "",
      `2. ${state?.directDifference?.stage} — ${state?.directDifference?.name}`,
      `   emergenceQuestion: ${state?.directDifference?.emergenceQuestion}`,
      `   emergenceMeaning: ${state?.directDifference?.emergenceMeaning}`,
      "",
      `3. ${state?.relationalContinuityField?.stage} — ${state?.relationalContinuityField?.name}`,
      `   emergenceQuestion: ${state?.relationalContinuityField?.emergenceQuestion}`,
      `   emergenceMeaning: ${state?.relationalContinuityField?.emergenceMeaning}`,
      "",
      `4. ${state?.recurringDifference?.stage} — ${state?.recurringDifference?.name}`,
      `   emergenceQuestion: ${state?.recurringDifference?.emergenceQuestion}`,
      `   emergenceMeaning: ${state?.recurringDifference?.emergenceMeaning}`
    ].join("\n")
  }

  if (mode === "capability") {
    return [
      "Emergent Capability:",
      `emergentCapability: ${state.emergentCapability}`,
      `capabilityMeaning: ${state.capabilityMeaning}`,
      `capabilityFunction: ${state.capabilityFunction}`,
      `capabilityDependency: ${state.capabilityDependency}`,
      `capabilityUse: ${state.capabilityUse}`,
      `emergenceSynthesis: ${state.emergenceSynthesis}`
    ].join("\n")
  }

  if (mode === "readiness") {
    return [
      "Emergent Capability Readiness:",
      `contributionReady: ${state?.capabilityReadinessAudit?.contributionReady ? "true" : "false"}`,
      `emergenceInputsReady: ${state?.capabilityReadinessAudit?.emergenceInputsReady ? "true" : "false"}`,
      `recurrenceReady: ${state?.capabilityReadinessAudit?.recurrenceReady ? "true" : "false"}`,
      `capabilityReadiness: ${state?.capabilityReadinessAudit?.capabilityReadiness}`,
      `readinessMeaning: ${state?.capabilityReadinessAudit?.readinessMeaning}`
    ].join("\n")
  }

  if (mode === "risk") {
    return [
      "Emergent Capability Risk / Boundary:",
      `emergentCapability: ${state.emergentCapability}`,
      `capabilityRisk: ${state.capabilityRisk}`,
      `capabilityDependency: ${state.capabilityDependency}`,
      `rule: ${state.rule}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `emergentCapabilityActive: ${
      state.emergentCapabilityActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `sourceRole: ${state.sourceRole}`,
    `sourceContributionType: ${state.sourceContributionType}`,
    `emergentCapability: ${state.emergentCapability}`,
    `capabilityReadiness: ${state.capabilityReadiness}`,
    `capabilityMeaning: ${state.capabilityMeaning}`,
    `nextCapabilityUse: ${state.capabilityUse}`,
    `emergenceSynthesis: ${state.emergenceSynthesis}`
  ].join("\n")
}

export function getEmergentCapabilityMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("emergent capability") &&
    !normalized.includes("capability emergence") &&
    !normalized.includes("emergence layer") &&
    !normalized.includes("what capability") &&
    !normalized.includes("what becomes possible") &&
    !normalized.includes("recurring relational difference") &&
    !normalized.includes("placement discernment capability")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation"))
    return "sequence"
  if (normalized.includes("readiness") || normalized.includes("ready"))
    return "readiness"
  if (normalized.includes("risk") || normalized.includes("boundary"))
    return "risk"
  if (
    normalized.includes("capability") ||
    normalized.includes("becomes possible")
  )
    return "capability"

  return "summary"
}
