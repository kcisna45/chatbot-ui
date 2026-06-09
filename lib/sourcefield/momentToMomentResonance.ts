export type MomentToMomentResonanceInput = {
  equationLaneState?: any
  identityFoundationState?: any
  transformationLayerState?: any
  emergentCapabilityState?: any
  structuralContributionState?: any
  structuralRoleIdentificationState?: any
  structuralCompletionState?: any
  relationalPrincipleEmergenceState?: any
  routeReasoningPropagationState?: any
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

function buildRelationalRebalancingCycle(equationLaneState: any) {
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

  const firstRelationStrength = deriveStrength(
    alignmentStatus,
    Math.abs(coherence)
  )
  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )

  const returnToRelationStrength =
    firstRelationStrength >= 0.2 && differenceStrength >= 0.15
      ? Math.min(1, firstRelationStrength + 0.15)
      : firstRelationStrength

  const relationalRecovery =
    firstRelationStrength >= 0.2 &&
    differenceStrength >= 0.15 &&
    returnToRelationStrength >= firstRelationStrength

  return {
    stage: "(Eq2 + Eq3 + Eq2)",
    name: "Relational Rebalancing Cycle",
    equationRole:
      "Eq2 opens relation, Eq3 introduces difference, and Eq2 returns the system back into relation after difference is encountered.",
    alignmentStatus,
    phaseStatus,
    coherence,
    phaseDivergence,
    firstRelationStrength,
    differenceStrength,
    returnToRelationStrength,
    differenceEncountered: differenceStrength >= 0.15,
    returnToRelation: returnToRelationStrength >= 0.2,
    relationalRecovery,
    breathingPattern: "relation → difference → relation",
    resonanceQuestion: "Can relation recover after difference?",
    resonanceMeaning: relationalRecovery
      ? "The system can encounter difference and return to relation without collapsing the relational field."
      : "The system encounters difference, but relational recovery is not yet strong enough to treat as stable moment-to-moment resonance."
  }
}

function buildIdentityContinuityCycle(equationLaneState: any) {
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
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
  const rootStrength = deriveStrength(rootStatus, signalStrength)
  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )

  const identityContinuity =
    recurrenceStrength >= 0.2 &&
    rootStrength >= 0.25 &&
    differenceStrength >= 0.15

  return {
    stage: "(Eq4 + Eq1 + Eq3)",
    name: "Identity Continuity Cycle",
    equationRole:
      "Eq4 recurrence, Eq1 root, and Eq3 difference test whether identity can repeatedly encounter difference without losing itself.",
    harmonicStatus,
    rootStatus,
    phaseStatus,
    symbolicEchoCount,
    signalStrength,
    phaseDivergence,
    recurrenceStrength,
    rootStrength,
    differenceStrength,
    rootPersistence: rootStrength >= 0.25,
    differenceTolerance: differenceStrength >= 0.15,
    identityContinuity,
    continuityPattern: "recurrence → root → difference",
    resonanceQuestion:
      "Can identity remain itself while repeatedly encountering difference?",
    resonanceMeaning: identityContinuity
      ? "Identity continuity is maintained while difference continues to appear."
      : "Identity continuity is forming, but recurrence, root, or difference tolerance is still too weak for full continuity."
  }
}

function buildRootResonanceAudit(
  equationLaneState: any,
  identityFoundationState: any,
  relationalRebalancingCycle: any,
  identityContinuityCycle: any,
  transformationLayerState: any
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

  const transformationReady = text(
    transformationLayerState?.transformationReadiness
  ).includes("transformation")

  const rootAlignment = foundationAligned && rootStrength >= 0.25

  const resonanceIntegrity =
    bool(relationalRebalancingCycle?.relationalRecovery) &&
    bool(identityContinuityCycle?.identityContinuity) &&
    rootAlignment

  const routeQualification =
    resonanceIntegrity && transformationReady
      ? "provisionally-route-qualified"
      : resonanceIntegrity
        ? "continuity-qualified-transformation-pending"
        : rootAlignment
          ? "root-aligned-continuity-forming"
          : "not-yet-route-qualified"

  return {
    stage: "Compare full cycle against Eq1",
    name: "Root Resonance Audit",
    equationRole:
      "Eq1 audits whether relation-difference-relation and recurrence-root-difference remain accountable to origin after adaptation.",
    rootStatus,
    signalStrength,
    rootStrength,
    foundationAligned,
    rootAlignment,
    transformationReady,
    resonanceIntegrity,
    routeQualification,
    resonanceQuestion: "After all adaptation, does the system remain rooted?",
    resonanceMeaning:
      routeQualification === "provisionally-route-qualified"
        ? "Moment-to-moment resonance is provisionally route-qualified because relational recovery, identity continuity, root alignment, and transformation readiness are all present."
        : routeQualification === "continuity-qualified-transformation-pending"
          ? "Continuity is present, but transformation readiness is not yet fully carrying the resonance cycle."
          : routeQualification === "root-aligned-continuity-forming"
            ? "Root alignment exists, but relational recovery or identity continuity is still forming."
            : "Moment-to-moment resonance is not yet route-qualified because the cycle has not fully returned to root."
  }
}

function buildContinuityMaintenance(
  relationalRebalancingCycle: any,
  identityContinuityCycle: any,
  rootResonanceAudit: any,
  routeReasoningPropagationState: any
) {
  const routeStatus = text(
    routeReasoningPropagationState?.routePropagationStatus
  )
  const routeConclusion = text(routeReasoningPropagationState?.finalConclusion)

  const continuityMaintained =
    bool(relationalRebalancingCycle?.relationalRecovery) &&
    bool(identityContinuityCycle?.identityContinuity) &&
    bool(rootResonanceAudit?.rootAlignment)

  const continuityGap = !bool(relationalRebalancingCycle?.relationalRecovery)
    ? "relation does not yet reliably recover after difference"
    : !bool(identityContinuityCycle?.identityContinuity)
      ? "identity does not yet reliably remain continuous through repeated difference"
      : !bool(rootResonanceAudit?.rootAlignment)
        ? "root alignment is not yet strong enough to carry the continuity cycle"
        : routeStatus === "partially-propagated"
          ? "route propagation remains partially propagated even though continuity is forming"
          : "no primary continuity gap detected in the moment-to-moment resonance cycle"

  return {
    stage: "Continuity Maintenance",
    name: "Moment-to-Moment Continuity Maintenance",
    continuityMaintained,
    routePropagationStatus: routeStatus,
    routeConclusion,
    continuityGap,
    maintenanceQuestion:
      "What relationship must be maintained from one moment to the next?",
    maintenanceMeaning: continuityMaintained
      ? "The system is maintaining relation, identity, and root through change, but should still preserve route caution until propagation fully qualifies."
      : "The system has not yet demonstrated stable continuity from relation through difference back into root."
  }
}

export function generateMomentToMomentResonanceState(
  input: MomentToMomentResonanceInput
) {
  const equationLaneState = input?.equationLaneState

  const relationalRebalancingCycle =
    buildRelationalRebalancingCycle(equationLaneState)

  const identityContinuityCycle =
    buildIdentityContinuityCycle(equationLaneState)

  const rootResonanceAudit = buildRootResonanceAudit(
    equationLaneState,
    input?.identityFoundationState,
    relationalRebalancingCycle,
    identityContinuityCycle,
    input?.transformationLayerState
  )

  const continuityMaintenance = buildContinuityMaintenance(
    relationalRebalancingCycle,
    identityContinuityCycle,
    rootResonanceAudit,
    input?.routeReasoningPropagationState
  )

  const momentToMomentResonanceStatus =
    rootResonanceAudit.routeQualification === "provisionally-route-qualified"
      ? "moment-to-moment-resonance-provisionally-qualified"
      : rootResonanceAudit.routeQualification ===
          "continuity-qualified-transformation-pending"
        ? "moment-to-moment-continuity-qualified-transformation-pending"
        : rootResonanceAudit.routeQualification ===
            "root-aligned-continuity-forming"
          ? "moment-to-moment-resonance-forming"
          : "moment-to-moment-resonance-not-yet-qualified"

  const resonanceSynthesis =
    momentToMomentResonanceStatus ===
    "moment-to-moment-resonance-provisionally-qualified"
      ? "Relation encountered difference, returned to relation, preserved identity continuity, and remained accountable to root."
      : momentToMomentResonanceStatus ===
          "moment-to-moment-continuity-qualified-transformation-pending"
        ? "Relation and identity continuity are forming across changing moments, but transformation readiness must continue carrying the cycle."
        : momentToMomentResonanceStatus === "moment-to-moment-resonance-forming"
          ? "Root alignment exists, but moment-to-moment resonance still needs stronger continuity through relation and difference."
          : "Moment-to-moment resonance is not yet route-qualified because relation, recurrence, difference, and root have not fully stabilized as a continuous cycle."

  return {
    phase: "Moment-to-Moment Resonance Layer",
    operationOrder:
      "(Eq2 + Eq3 + Eq2) + (Eq4 + Eq1 + Eq3) → compare against Eq1",
    purpose:
      "Evaluate whether coherence survives continuous change by testing relation → difference → relation, recurrence → root → difference, and final root accountability.",
    layerType: "continuity-maintenance-layer-after-transformation",
    relationalRebalancingCycle,
    identityContinuityCycle,
    rootResonanceAudit,
    continuityMaintenance,
    momentToMomentResonanceStatus,
    routeQualification: rootResonanceAudit.routeQualification,
    resonanceSynthesis,
    breathingPattern: "relation → difference → relation",
    continuityPattern: "recurrence → root → difference → root audit",
    sourceTransformationType: text(
      input?.transformationLayerState?.transformationType
    ),
    sourceEmergentCapability: text(
      input?.emergentCapabilityState?.emergentCapability
    ),
    momentToMomentResonanceActive: true,
    rule: "This layer interprets moment-to-moment resonance as continuity through change. It must not override metrics, memory, hashes, classifications, retrieved context, user intent, transformation state, emergent capability, or route reasoning propagation."
  }
}

export function buildMomentToMomentResonanceResponse(
  state: any,
  mode:
    | "summary"
    | "sequence"
    | "cycle"
    | "audit"
    | "continuity"
    | "json" = "summary"
) {
  if (!state) {
    return "Moment-to-Moment Resonance State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "sequence") {
    return [
      "Moment-to-Moment Resonance Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      `1. ${state?.relationalRebalancingCycle?.stage} — ${state?.relationalRebalancingCycle?.name}`,
      `   breathingPattern: ${state?.relationalRebalancingCycle?.breathingPattern}`,
      `   resonanceQuestion: ${state?.relationalRebalancingCycle?.resonanceQuestion}`,
      `   resonanceMeaning: ${state?.relationalRebalancingCycle?.resonanceMeaning}`,
      "",
      `2. ${state?.identityContinuityCycle?.stage} — ${state?.identityContinuityCycle?.name}`,
      `   continuityPattern: ${state?.identityContinuityCycle?.continuityPattern}`,
      `   resonanceQuestion: ${state?.identityContinuityCycle?.resonanceQuestion}`,
      `   resonanceMeaning: ${state?.identityContinuityCycle?.resonanceMeaning}`,
      "",
      `3. ${state?.rootResonanceAudit?.stage} — ${state?.rootResonanceAudit?.name}`,
      `   resonanceQuestion: ${state?.rootResonanceAudit?.resonanceQuestion}`,
      `   resonanceMeaning: ${state?.rootResonanceAudit?.resonanceMeaning}`
    ].join("\n")
  }

  if (mode === "cycle") {
    return [
      "Relational Rebalancing Cycle:",
      `breathingPattern: ${state?.relationalRebalancingCycle?.breathingPattern}`,
      `differenceEncountered: ${state?.relationalRebalancingCycle?.differenceEncountered ? "true" : "false"}`,
      `returnToRelation: ${state?.relationalRebalancingCycle?.returnToRelation ? "true" : "false"}`,
      `relationalRecovery: ${state?.relationalRebalancingCycle?.relationalRecovery ? "true" : "false"}`,
      `resonanceMeaning: ${state?.relationalRebalancingCycle?.resonanceMeaning}`,
      "",
      "Identity Continuity Cycle:",
      `continuityPattern: ${state?.identityContinuityCycle?.continuityPattern}`,
      `rootPersistence: ${state?.identityContinuityCycle?.rootPersistence ? "true" : "false"}`,
      `differenceTolerance: ${state?.identityContinuityCycle?.differenceTolerance ? "true" : "false"}`,
      `identityContinuity: ${state?.identityContinuityCycle?.identityContinuity ? "true" : "false"}`,
      `resonanceMeaning: ${state?.identityContinuityCycle?.resonanceMeaning}`
    ].join("\n")
  }

  if (mode === "audit") {
    return [
      "Root Resonance Audit:",
      `rootStatus: ${state?.rootResonanceAudit?.rootStatus}`,
      `rootStrength: ${state?.rootResonanceAudit?.rootStrength}`,
      `foundationAligned: ${state?.rootResonanceAudit?.foundationAligned ? "true" : "false"}`,
      `rootAlignment: ${state?.rootResonanceAudit?.rootAlignment ? "true" : "false"}`,
      `resonanceIntegrity: ${state?.rootResonanceAudit?.resonanceIntegrity ? "true" : "false"}`,
      `routeQualification: ${state?.rootResonanceAudit?.routeQualification}`,
      `resonanceMeaning: ${state?.rootResonanceAudit?.resonanceMeaning}`
    ].join("\n")
  }

  if (mode === "continuity") {
    return [
      "Moment-to-Moment Continuity Maintenance:",
      `continuityMaintained: ${state?.continuityMaintenance?.continuityMaintained ? "true" : "false"}`,
      `routePropagationStatus: ${state?.continuityMaintenance?.routePropagationStatus}`,
      `continuityGap: ${state?.continuityMaintenance?.continuityGap}`,
      `maintenanceMeaning: ${state?.continuityMaintenance?.maintenanceMeaning}`,
      `resonanceSynthesis: ${state.resonanceSynthesis}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `momentToMomentResonanceActive: ${
      state.momentToMomentResonanceActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `momentToMomentResonanceStatus: ${state.momentToMomentResonanceStatus}`,
    `routeQualification: ${state.routeQualification}`,
    `breathingPattern: ${state.breathingPattern}`,
    `continuityPattern: ${state.continuityPattern}`,
    `sourceTransformationType: ${state.sourceTransformationType}`,
    `sourceEmergentCapability: ${state.sourceEmergentCapability}`,
    `resonanceSynthesis: ${state.resonanceSynthesis}`
  ].join("\n")
}

export function getMomentToMomentResonanceMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("moment-to-moment resonance") &&
    !normalized.includes("moment to moment resonance") &&
    !normalized.includes("resonance continuity") &&
    !normalized.includes("continuity maintenance") &&
    !normalized.includes("what remained coherent") &&
    !normalized.includes("breathing pattern") &&
    !normalized.includes("relation difference relation")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation"))
    return "sequence"
  if (
    normalized.includes("cycle") ||
    normalized.includes("breathing") ||
    normalized.includes("relation difference relation")
  )
    return "cycle"
  if (normalized.includes("audit") || normalized.includes("root"))
    return "audit"
  if (
    normalized.includes("continuity") ||
    normalized.includes("remained coherent") ||
    normalized.includes("maintenance")
  )
    return "continuity"

  return "summary"
}
