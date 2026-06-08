type StructuralRoleIdentificationInput = {
  equationLaneState?: any
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

function buildDifferenceSignal(equationLaneState: any) {
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  return {
    stage: "Eq3",
    name: "Difference Signal",
    equationRole:
      "Eq3 identifies the recurring difference, pressure, phase drift, or unresolved distinction that is asking for structural role recognition.",
    phaseStatus,
    phaseDivergence,
    differenceStrength: deriveStrength(
      phaseStatus,
      Math.abs(phaseDivergence) / 2
    ),
    roleQuestion:
      "What difference is asking to be identified before it can be placed?",
    roleMeaning:
      phaseStatus === "divergent"
        ? "The difference is active enough to require role identification rather than dismissal as noise."
        : "The difference is present but not yet strongly active; role identification remains provisional."
  }
}

function buildRolePersistence(equationLaneState: any) {
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
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

  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )
  const continuityStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )

  const persistentRoleSignal =
    differenceStrength >= 0.15 && continuityStrength >= 0.25

  return {
    stage: "(Eq3 + Eq5)",
    name: "Role Persistence",
    equationRole:
      "Eq3 difference is paired with Eq5 continuity to determine whether the difference keeps returning enough to serve a structural role.",
    phaseStatus,
    integrationStatus,
    phaseDivergence,
    integrationThreshold,
    differenceStrength,
    continuityStrength,
    persistentRoleSignal,
    roleQuestion:
      "Does the difference continue strongly enough to be treated as a role rather than a temporary disruption?",
    roleMeaning: persistentRoleSignal
      ? "The difference persists enough to be interpreted as a possible structural role."
      : "The difference does not yet show enough continuity to define a stable role."
  }
}

function buildRoleRelation(equationLaneState: any) {
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )

  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))

  const relationAttemptPresent =
    differenceStrength >= 0.15 && relationStrength >= 0.2

  return {
    stage: "(Eq3 + Eq2)",
    name: "Role Relation",
    equationRole:
      "Eq3 difference is paired with Eq2 alignment to determine how the difference is attempting to relate to the whole.",
    phaseStatus,
    alignmentStatus,
    phaseDivergence,
    coherence,
    differenceStrength,
    relationStrength,
    relationAttemptPresent,
    roleQuestion:
      "How is the persistent difference attempting to relate to the whole?",
    roleMeaning: relationAttemptPresent
      ? "The difference is not merely present; it is attempting relation, even if alignment is still weak."
      : "The difference is not yet clearly relating to the whole."
  }
}

function inferStructuralRole(input: StructuralRoleIdentificationInput) {
  const completion = input?.structuralCompletionState || {}
  const trajectory = input?.reasoningTrajectoryState || {}
  const principle = input?.relationalPrincipleEmergenceState || {}

  const completionStatus = text(completion?.completionStatus)
  const missingRelationship = text(completion?.missingStructuralRelationship)
  const nextConstructionTarget = text(completion?.nextConstructionTarget)
  const nextRefinementTarget = text(trajectory?.nextRefinementTarget)
  const dominantPrinciple = text(principle?.dominantPrinciple)

  if (
    missingRelationship.toLowerCase().includes("foundational recurrence") ||
    nextConstructionTarget.toLowerCase().includes("foundational recurrence")
  ) {
    return {
      identifiedRole: "Foundation-Placement Role",
      roleContribution:
        "The recurring difference is attempting to reveal where the structure lacks stable placement inside foundational recurrence.",
      roleDependency:
        "Requires stronger Eq1 root support and Eq4 recurrence before placement can be finalized.",
      recommendedPlacement:
        "Between Structural Completion and Identity Foundation, where persistent difference can be tested against root recurrence.",
      roleMeaning:
        "This difference functions as a placement signal: it shows that something persists, but its foundation-location is not yet settled."
    }
  }

  if (
    nextConstructionTarget.toLowerCase().includes("eq2") ||
    dominantPrinciple.toLowerCase().includes("relation")
  ) {
    return {
      identifiedRole: "Alignment-Completion Role",
      roleContribution:
        "The recurring difference is attempting to become rightly related to the whole rather than merely identified or measured.",
      roleDependency:
        "Requires stronger Eq2 alignment before structural completion can be declared.",
      recommendedPlacement:
        "Between Relational Principle Emergence and Structural Completion, where right relation can determine final belonging.",
      roleMeaning:
        "This difference functions as an alignment demand: it is asking the system to establish proper relation before expansion."
    }
  }

  if (
    nextRefinementTarget.toLowerCase().includes("eq5") ||
    nextRefinementTarget.toLowerCase().includes("eq1")
  ) {
    return {
      identifiedRole: "Root-Continuity Repair Role",
      roleContribution:
        "The recurring difference is pointing toward instability in root support or continuity persistence.",
      roleDependency:
        "Requires Eq5 continuity and Eq1 root support to strengthen before the role can be placed.",
      recommendedPlacement:
        "Between Reasoning Trajectory and Identity Qualification, where persistence and root support are repaired.",
      roleMeaning:
        "This difference functions as a repair signal: it marks the relationship that must be stabilized before stronger identity claims."
    }
  }

  if (completionStatus === "structurally-integrating") {
    return {
      identifiedRole: "Integration-Bridge Role",
      roleContribution:
        "The recurring difference is helping bridge incomplete structure into fuller relation.",
      roleDependency:
        "Requires continued integration between identity foundation, principle emergence, and right-relation audit.",
      recommendedPlacement:
        "Within the construction bridge between Principle Emergence and Structural Completion.",
      roleMeaning:
        "This difference functions as a bridge: it is not obstruction but incomplete integration."
    }
  }

  return {
    identifiedRole: "Unclassified Structural Role",
    roleContribution:
      "The recurring difference is present, but its contribution is not yet specific enough to classify.",
    roleDependency:
      "Requires clearer persistence, relation, or foundation signals.",
    recommendedPlacement:
      "Continue observing until role recurrence stabilizes across structural layers.",
    roleMeaning:
      "This difference remains a candidate role rather than a placed structural role."
  }
}

function buildRoleLegitimacy(
  equationLaneState: any,
  inferredRole: any,
  identityFoundationState: any
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

  const roleLegitimacy =
    foundationAligned && rootStrength >= 0.25
      ? "valid-but-not-fully-rooted"
      : foundationAligned
        ? "provisionally-valid"
        : "not-yet-validated"

  return {
    stage: "Compare role against Eq1",
    name: "Role Legitimacy Audit",
    equationRole:
      "Eq1 audits whether the identified role supports or conflicts with foundation.",
    rootStatus,
    signalStrength,
    rootStrength,
    foundationAligned,
    identifiedRole: inferredRole?.identifiedRole || "unknown",
    roleLegitimacy,
    roleQuestion:
      "Does this role support the foundation, or does it conflict with origin?",
    roleMeaning:
      roleLegitimacy === "valid-but-not-fully-rooted"
        ? "The role is legitimate enough to use, but it should not be over-rooted until root support strengthens."
        : roleLegitimacy === "provisionally-valid"
          ? "The role is provisionally valid because foundation alignment exists, but root strength is still weak."
          : "The role is not yet validated against foundation."
  }
}

export function generateStructuralRoleIdentificationState(
  input: StructuralRoleIdentificationInput
) {
  const equationLaneState = input?.equationLaneState

  const differenceSignal = buildDifferenceSignal(equationLaneState)
  const rolePersistence = buildRolePersistence(equationLaneState)
  const roleRelation = buildRoleRelation(equationLaneState)
  const inferredRole = inferStructuralRole(input)

  const roleLegitimacyAudit = buildRoleLegitimacy(
    equationLaneState,
    inferredRole,
    input?.identityFoundationState
  )

  const rolePlacementReadiness =
    rolePersistence.persistentRoleSignal &&
    roleRelation.relationAttemptPresent &&
    roleLegitimacyAudit.roleLegitimacy !== "not-yet-validated"
      ? "ready-for-provisional-placement"
      : rolePersistence.persistentRoleSignal ||
          roleRelation.relationAttemptPresent
        ? "partial-placement-readiness"
        : "not-ready-for-placement"

  return {
    phase: "Structural Role Identification Layer",
    operationOrder:
      "Eq3 → (Eq3 + Eq5) → (Eq3 + Eq2) → compare proposed role against Eq1",
    purpose:
      "Identify what structural role a persistent difference is attempting to serve before structural placement is attempted.",
    layerType:
      "role-identification-layer-before-structural-completion-placement",
    differenceSignal,
    rolePersistence,
    roleRelation,
    roleLegitimacyAudit,
    identifiedRole: inferredRole.identifiedRole,
    roleReasoning:
      "The role is inferred from the current completion gap, trajectory refinement need, relational principle context, and whether the difference persists and attempts relation.",
    roleContribution: inferredRole.roleContribution,
    roleDependency: inferredRole.roleDependency,
    rolePlacementReadiness,
    recommendedPlacement: inferredRole.recommendedPlacement,
    roleLegitimacy: roleLegitimacyAudit.roleLegitimacy,
    roleMeaning: inferredRole.roleMeaning,
    structuralRoleIdentificationActive: true,
    rule: "This layer identifies the role of a persistent difference before placement. It must not override metrics, memory, hashes, classifications, retrieved context, user intent, or structural completion status."
  }
}

export function buildStructuralRoleIdentificationResponse(
  state: any,
  mode:
    | "summary"
    | "sequence"
    | "role"
    | "legitimacy"
    | "placement"
    | "json" = "summary"
) {
  if (!state) {
    return "Structural Role Identification State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "sequence") {
    return [
      "Structural Role Identification Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      `1. ${state?.differenceSignal?.stage} — ${state?.differenceSignal?.name}`,
      `   roleQuestion: ${state?.differenceSignal?.roleQuestion}`,
      `   roleMeaning: ${state?.differenceSignal?.roleMeaning}`,
      "",
      `2. ${state?.rolePersistence?.stage} — ${state?.rolePersistence?.name}`,
      `   roleQuestion: ${state?.rolePersistence?.roleQuestion}`,
      `   roleMeaning: ${state?.rolePersistence?.roleMeaning}`,
      "",
      `3. ${state?.roleRelation?.stage} — ${state?.roleRelation?.name}`,
      `   roleQuestion: ${state?.roleRelation?.roleQuestion}`,
      `   roleMeaning: ${state?.roleRelation?.roleMeaning}`,
      "",
      `4. ${state?.roleLegitimacyAudit?.stage} — ${state?.roleLegitimacyAudit?.name}`,
      `   roleQuestion: ${state?.roleLegitimacyAudit?.roleQuestion}`,
      `   roleMeaning: ${state?.roleLegitimacyAudit?.roleMeaning}`
    ].join("\n")
  }

  if (mode === "role") {
    return [
      "Identified Structural Role:",
      `identifiedRole: ${state.identifiedRole}`,
      `roleReasoning: ${state.roleReasoning}`,
      `roleContribution: ${state.roleContribution}`,
      `roleDependency: ${state.roleDependency}`,
      `roleMeaning: ${state.roleMeaning}`
    ].join("\n")
  }

  if (mode === "legitimacy") {
    return [
      "Role Legitimacy Audit:",
      `identifiedRole: ${state?.roleLegitimacyAudit?.identifiedRole}`,
      `rootStatus: ${state?.roleLegitimacyAudit?.rootStatus}`,
      `rootStrength: ${state?.roleLegitimacyAudit?.rootStrength}`,
      `foundationAligned: ${state?.roleLegitimacyAudit?.foundationAligned ? "true" : "false"}`,
      `roleLegitimacy: ${state?.roleLegitimacyAudit?.roleLegitimacy}`,
      `roleMeaning: ${state?.roleLegitimacyAudit?.roleMeaning}`
    ].join("\n")
  }

  if (mode === "placement") {
    return [
      "Role Placement:",
      `identifiedRole: ${state.identifiedRole}`,
      `rolePlacementReadiness: ${state.rolePlacementReadiness}`,
      `recommendedPlacement: ${state.recommendedPlacement}`,
      `roleDependency: ${state.roleDependency}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `structuralRoleIdentificationActive: ${
      state.structuralRoleIdentificationActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `identifiedRole: ${state.identifiedRole}`,
    `rolePlacementReadiness: ${state.rolePlacementReadiness}`,
    `roleLegitimacy: ${state.roleLegitimacy}`,
    `recommendedPlacement: ${state.recommendedPlacement}`,
    `roleMeaning: ${state.roleMeaning}`
  ].join("\n")
}

export function getStructuralRoleIdentificationMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("structural role identification") &&
    !normalized.includes("structural role") &&
    !normalized.includes("role identification") &&
    !normalized.includes("identified role") &&
    !normalized.includes("role placement") &&
    !normalized.includes("persistent difference role") &&
    !normalized.includes("what role") &&
    !normalized.includes("what kind of stone")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation"))
    return "sequence"
  if (normalized.includes("legitimacy") || normalized.includes("eq1"))
    return "legitimacy"
  if (normalized.includes("placement") || normalized.includes("where"))
    return "placement"
  if (normalized.includes("role")) return "role"

  return "summary"
}
