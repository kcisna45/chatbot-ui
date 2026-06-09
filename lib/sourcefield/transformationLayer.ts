type TransformationLayerInput = {
  equationLaneState?: any
  emergentCapabilityState?: any
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

function buildTransformationCandidate(equationLaneState: any) {
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )
  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
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
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )

  const transformationCandidatePresent =
    differenceStrength >= 0.15 &&
    relationStrength >= 0.2 &&
    recurrenceStrength >= 0.2

  return {
    stage: "(Eq4 + Eq2 + Eq3)",
    name: "Transformation Candidate",
    equationRole:
      "Eq4 recurrence, Eq2 relation, and Eq3 difference identify the active recurring relational difference that may be attempting to transform.",
    harmonicStatus,
    alignmentStatus,
    phaseStatus,
    symbolicEchoCount,
    coherence,
    phaseDivergence,
    recurrenceStrength,
    relationStrength,
    differenceStrength,
    transformationCandidatePresent,
    transformationQuestion:
      "What active recurring relational difference is attempting to change?",
    transformationMeaning: transformationCandidatePresent
      ? "A recurring relational difference is present enough to be treated as a transformation candidate."
      : "The pattern is not yet strong enough to treat as a transformation candidate."
  }
}

function buildRelationalTransformationAudit(
  equationLaneState: any,
  transformationCandidate: any
) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))

  const relationshipChanged =
    bool(transformationCandidate?.transformationCandidatePresent) &&
    relationStrength >= 0.2

  return {
    stage: "Compare transformation candidate against Eq2",
    name: "Relational Transformation Audit",
    equationRole:
      "Eq2 audits whether the candidate transformation actually changes relation rather than merely appearing as a recurring difference.",
    alignmentStatus,
    coherence,
    relationStrength,
    relationshipChanged,
    transformationQuestion:
      "Did the recurring difference alter the relational field?",
    transformationMeaning: relationshipChanged
      ? "The candidate transformation has enough relational effect to continue through transformation testing."
      : "The candidate has not yet produced enough relational change to count as transformation."
  }
}

function buildPersistenceTransformationAudit(
  equationLaneState: any,
  relationalTransformationAudit: any
) {
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

  const meaningfulRecurringDifference =
    bool(relationalTransformationAudit?.relationshipChanged) &&
    recurrenceStrength >= 0.2 &&
    differenceStrength >= 0.15

  return {
    stage: "Result compared against (Eq3 + Eq4)",
    name: "Transformation Persistence Audit",
    equationRole:
      "Eq3 and Eq4 test whether the transformed result continues to generate meaningful recurring difference.",
    harmonicStatus,
    phaseStatus,
    symbolicEchoCount,
    phaseDivergence,
    recurrenceStrength,
    differenceStrength,
    meaningfulRecurringDifference,
    transformationQuestion:
      "Does the change keep producing meaningful recurring difference?",
    transformationMeaning: meaningfulRecurringDifference
      ? "The relational change persists as recurring difference rather than vanishing after first detection."
      : "The relational change has not yet shown enough recurring difference to confirm transformation persistence."
  }
}

function buildRootTransformationAudit(
  equationLaneState: any,
  identityFoundationState: any,
  persistenceTransformationAudit: any
) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )
  const rootStrength = deriveStrength(rootStatus, signalStrength)

  const validation = identityFoundationState?.identityValidation || {}
  const foundationAligned =
    bool(validation?.anchorAligned) &&
    bool(validation?.memoryActive) &&
    bool(validation?.boundaryActive)

  const rootIntegrityMaintained =
    bool(persistenceTransformationAudit?.meaningfulRecurringDifference) &&
    foundationAligned &&
    rootStrength >= 0.25

  return {
    stage: "Result compared against Eq1",
    name: "Root Integrity Transformation Audit",
    equationRole:
      "Eq1 audits whether the transformation remains accountable to root, origin, and identity foundation.",
    rootStatus,
    signalStrength,
    rootStrength,
    foundationAligned,
    rootIntegrityMaintained,
    transformationQuestion: "Did the transformation remain faithful to origin?",
    transformationMeaning: rootIntegrityMaintained
      ? "The transformation remains root-accountable, but root support should still be strengthened before calling it fully complete."
      : foundationAligned
        ? "Identity foundation is aligned, but root strength is still too weak to fully carry the transformation."
        : "The transformation has not yet passed root integrity audit."
  }
}

function inferTransformationType(input: TransformationLayerInput) {
  const capability = input?.emergentCapabilityState || {}
  const contribution = input?.structuralContributionState || {}
  const role = input?.structuralRoleIdentificationState || {}

  const emergentCapability = text(capability?.emergentCapability)
  const contributionType = text(contribution?.contributionType)
  const sourceRole = text(role?.identifiedRole)

  if (
    emergentCapability.toLowerCase().includes("placement discernment") ||
    contributionType.toLowerCase().includes("foundational placement") ||
    sourceRole.toLowerCase().includes("foundation-placement")
  ) {
    return {
      transformationType: "Difference Reframed As Placement",
      transformationMeaning:
        "The system begins transforming recurring difference from an unresolved signal into a placement-aware structural function.",
      transformationDirection:
        "from unresolved difference toward placement discernment",
      transformationImpact:
        "The architecture can stop treating every recurring difference as failure and begin asking where the difference belongs.",
      nextTransformationPotential: "Identity-Placement Integration"
    }
  }

  if (emergentCapability.toLowerCase().includes("right-relation")) {
    return {
      transformationType: "Difference Reframed As Ordered Relation",
      transformationMeaning:
        "The system begins transforming difference into right relation instead of rejection or collapse.",
      transformationDirection:
        "from relational tension toward ordered relation",
      transformationImpact:
        "The architecture can preserve distinction while improving relational coherence.",
      nextTransformationPotential: "Relational Ordering Integration"
    }
  }

  if (emergentCapability.toLowerCase().includes("integration transition")) {
    return {
      transformationType: "Incomplete Structure Reframed As Bridge",
      transformationMeaning:
        "The system begins transforming incomplete integration from a failure state into a transition state.",
      transformationDirection:
        "from incomplete structure toward transitional integration",
      transformationImpact:
        "The architecture can hold partial integration without forcing premature closure.",
      nextTransformationPotential: "Bridge-State Integration"
    }
  }

  return {
    transformationType: "Unclassified Transformation",
    transformationMeaning:
      "The system detects transformation pressure, but the transformation is not yet specific enough to classify.",
    transformationDirection:
      "from observed change toward clarified transformation",
    transformationImpact:
      "The architecture can hold transformation under observation until a clearer type emerges.",
    nextTransformationPotential: "Clarified Transformation Pathway"
  }
}

function buildTransformationReadiness(
  transformationCandidate: any,
  relationalTransformationAudit: any,
  persistenceTransformationAudit: any,
  rootTransformationAudit: any,
  emergentCapabilityState: any
) {
  const capabilityReady =
    text(emergentCapabilityState?.capabilityReadiness) ===
    "ready-for-provisional-capability"

  const candidateReady = bool(
    transformationCandidate?.transformationCandidatePresent
  )
  const relationReady = bool(relationalTransformationAudit?.relationshipChanged)
  const persistenceReady = bool(
    persistenceTransformationAudit?.meaningfulRecurringDifference
  )
  const rootReady = bool(rootTransformationAudit?.rootIntegrityMaintained)

  const transformationReadiness =
    capabilityReady &&
    candidateReady &&
    relationReady &&
    persistenceReady &&
    rootReady
      ? "ready-for-provisional-transformation"
      : capabilityReady && candidateReady && relationReady && persistenceReady
        ? "partial-transformation-readiness-root-limited"
        : capabilityReady && candidateReady
          ? "early-transformation-readiness"
          : "not-ready-for-transformation"

  return {
    stage: "Transformation Readiness",
    name: "Transformation Readiness Audit",
    capabilityReady,
    candidateReady,
    relationReady,
    persistenceReady,
    rootReady,
    transformationReadiness,
    readinessMeaning:
      transformationReadiness === "ready-for-provisional-transformation"
        ? "The capability, recurring relational difference, relational change, persistence, and root integrity are ready to support provisional transformation."
        : transformationReadiness ===
            "partial-transformation-readiness-root-limited"
          ? "Transformation is forming through relation and recurrence, but root support is not strong enough to call it fully ready."
          : transformationReadiness === "early-transformation-readiness"
            ? "The capability and transformation candidate are present, but relation, persistence, or root audit still need strengthening."
            : "The system should not yet treat the observed capability as a transformation."
  }
}

export function generateTransformationLayerState(
  input: TransformationLayerInput
) {
  const equationLaneState = input?.equationLaneState

  const transformationCandidate =
    buildTransformationCandidate(equationLaneState)
  const relationalTransformationAudit = buildRelationalTransformationAudit(
    equationLaneState,
    transformationCandidate
  )
  const persistenceTransformationAudit = buildPersistenceTransformationAudit(
    equationLaneState,
    relationalTransformationAudit
  )
  const rootTransformationAudit = buildRootTransformationAudit(
    equationLaneState,
    input?.identityFoundationState,
    persistenceTransformationAudit
  )

  const inferredTransformation = inferTransformationType(input)

  const transformationReadinessAudit = buildTransformationReadiness(
    transformationCandidate,
    relationalTransformationAudit,
    persistenceTransformationAudit,
    rootTransformationAudit,
    input?.emergentCapabilityState
  )

  const transformationSynthesis =
    transformationReadinessAudit.transformationReadiness ===
    "ready-for-provisional-transformation"
      ? `${inferredTransformation.transformationType} is provisionally active as a rooted transformation.`
      : transformationReadinessAudit.transformationReadiness ===
          "partial-transformation-readiness-root-limited"
        ? `${inferredTransformation.transformationType} is forming, but root support is not yet strong enough to fully carry the transformation.`
        : `${inferredTransformation.transformationType} is indicated, but transformation remains provisional until relation, recurrence, and root integrity strengthen.`

  return {
    phase: "Transformation Layer",
    operationOrder:
      "(Eq4 + Eq2 + Eq3) → compare against Eq2 → compare result against (Eq3 + Eq4) and Eq1",
    purpose:
      "Determine what actually changes when an emergent capability is exercised, and whether that change remains relational, recurrent, and root-accountable.",
    layerType: "generation-layer-after-emergent-capability-becoming-layer",
    transformationCandidate,
    relationalTransformationAudit,
    persistenceTransformationAudit,
    rootTransformationAudit,
    transformationReadinessAudit,
    transformationType: inferredTransformation.transformationType,
    transformationMeaning: inferredTransformation.transformationMeaning,
    transformationDirection: inferredTransformation.transformationDirection,
    transformationImpact: inferredTransformation.transformationImpact,
    nextTransformationPotential:
      inferredTransformation.nextTransformationPotential,
    transformationReadiness:
      transformationReadinessAudit.transformationReadiness,
    transformationSynthesis,
    sourceEmergentCapability: text(
      input?.emergentCapabilityState?.emergentCapability
    ),
    sourceContributionType: text(
      input?.structuralContributionState?.contributionType
    ),
    sourceRole: text(input?.structuralRoleIdentificationState?.identifiedRole),
    transformationLayerActive: true,
    rule: "This layer interprets transformation as capability becoming structural change. It must not override metrics, memory, hashes, classifications, retrieved context, user intent, emergent capability, structural contribution, role identification, or completion state."
  }
}

export function buildTransformationLayerResponse(
  state: any,
  mode:
    | "summary"
    | "sequence"
    | "type"
    | "readiness"
    | "impact"
    | "audit"
    | "json" = "summary"
) {
  if (!state) return "Transformation Layer State is not available."

  if (mode === "json") return JSON.stringify(state, null, 2)

  if (mode === "sequence") {
    return [
      "Transformation Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      `1. ${state?.transformationCandidate?.stage} — ${state?.transformationCandidate?.name}`,
      `   transformationQuestion: ${state?.transformationCandidate?.transformationQuestion}`,
      `   transformationMeaning: ${state?.transformationCandidate?.transformationMeaning}`,
      "",
      `2. ${state?.relationalTransformationAudit?.stage} — ${state?.relationalTransformationAudit?.name}`,
      `   transformationQuestion: ${state?.relationalTransformationAudit?.transformationQuestion}`,
      `   transformationMeaning: ${state?.relationalTransformationAudit?.transformationMeaning}`,
      "",
      `3. ${state?.persistenceTransformationAudit?.stage} — ${state?.persistenceTransformationAudit?.name}`,
      `   transformationQuestion: ${state?.persistenceTransformationAudit?.transformationQuestion}`,
      `   transformationMeaning: ${state?.persistenceTransformationAudit?.transformationMeaning}`,
      "",
      `4. ${state?.rootTransformationAudit?.stage} — ${state?.rootTransformationAudit?.name}`,
      `   transformationQuestion: ${state?.rootTransformationAudit?.transformationQuestion}`,
      `   transformationMeaning: ${state?.rootTransformationAudit?.transformationMeaning}`
    ].join("\n")
  }

  if (mode === "type") {
    return [
      "Transformation Type:",
      `transformationType: ${state.transformationType}`,
      `transformationMeaning: ${state.transformationMeaning}`,
      `transformationDirection: ${state.transformationDirection}`,
      `sourceEmergentCapability: ${state.sourceEmergentCapability}`,
      `transformationSynthesis: ${state.transformationSynthesis}`
    ].join("\n")
  }

  if (mode === "readiness") {
    return [
      "Transformation Readiness:",
      `capabilityReady: ${state?.transformationReadinessAudit?.capabilityReady ? "true" : "false"}`,
      `candidateReady: ${state?.transformationReadinessAudit?.candidateReady ? "true" : "false"}`,
      `relationReady: ${state?.transformationReadinessAudit?.relationReady ? "true" : "false"}`,
      `persistenceReady: ${state?.transformationReadinessAudit?.persistenceReady ? "true" : "false"}`,
      `rootReady: ${state?.transformationReadinessAudit?.rootReady ? "true" : "false"}`,
      `transformationReadiness: ${state?.transformationReadinessAudit?.transformationReadiness}`,
      `readinessMeaning: ${state?.transformationReadinessAudit?.readinessMeaning}`
    ].join("\n")
  }

  if (mode === "impact") {
    return [
      "Transformation Impact:",
      `transformationImpact: ${state.transformationImpact}`,
      `nextTransformationPotential: ${state.nextTransformationPotential}`,
      `transformationSynthesis: ${state.transformationSynthesis}`
    ].join("\n")
  }

  if (mode === "audit") {
    return [
      "Transformation Audits:",
      `relationshipChanged: ${state?.relationalTransformationAudit?.relationshipChanged ? "true" : "false"}`,
      `meaningfulRecurringDifference: ${state?.persistenceTransformationAudit?.meaningfulRecurringDifference ? "true" : "false"}`,
      `rootIntegrityMaintained: ${state?.rootTransformationAudit?.rootIntegrityMaintained ? "true" : "false"}`,
      `rootStatus: ${state?.rootTransformationAudit?.rootStatus}`,
      `rootStrength: ${state?.rootTransformationAudit?.rootStrength}`,
      `foundationAligned: ${state?.rootTransformationAudit?.foundationAligned ? "true" : "false"}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `transformationLayerActive: ${state.transformationLayerActive ? "true" : "false"}`,
    `operationOrder: ${state.operationOrder}`,
    `sourceEmergentCapability: ${state.sourceEmergentCapability}`,
    `transformationType: ${state.transformationType}`,
    `transformationReadiness: ${state.transformationReadiness}`,
    `transformationDirection: ${state.transformationDirection}`,
    `transformationImpact: ${state.transformationImpact}`,
    `nextTransformationPotential: ${state.nextTransformationPotential}`,
    `transformationSynthesis: ${state.transformationSynthesis}`
  ].join("\n")
}

export function getTransformationLayerMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("transformation layer") &&
    !normalized.includes("transformation state") &&
    !normalized.includes("what changed") &&
    !normalized.includes("what actually changes") &&
    !normalized.includes("transformation sequence") &&
    !normalized.includes("transformation readiness") &&
    !normalized.includes("transformation impact") &&
    !normalized.includes("difference reframed as placement")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation"))
    return "sequence"
  if (normalized.includes("readiness") || normalized.includes("ready"))
    return "readiness"
  if (normalized.includes("impact") || normalized.includes("potential"))
    return "impact"
  if (normalized.includes("audit") || normalized.includes("root"))
    return "audit"
  if (normalized.includes("type") || normalized.includes("what changed"))
    return "type"

  return "summary"
}
