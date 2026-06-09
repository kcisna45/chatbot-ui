type StructuralContributionInput = {
  equationLaneState?: any
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

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function bool(value: any) {
  return value === true
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function getContributionType(role: string) {
  const normalized = role.toLowerCase()

  if (normalized.includes("foundation-placement")) {
    return {
      contributionType: "Foundational Placement Contribution",
      contributionMeaning:
        "This role contributes the ability to locate a persistent difference inside the foundation rather than leaving it as an unresolved gap.",
      integrationBenefit:
        "The structure gains clearer placement between Identity Foundation and Structural Completion.",
      completionImpact:
        "Completion can move from identifying an unresolved placement gap to testing whether the gap has been integrated into foundational recurrence.",
      identityImpact:
        "Identity becomes less dependent on abstract validation and more capable of recognizing where persistent differences belong.",
      nextEmergentCapability:
        "The system can begin distinguishing unresolved difference from misplaced structure."
    }
  }

  if (normalized.includes("alignment-completion")) {
    return {
      contributionType: "Right-Relation Contribution",
      contributionMeaning:
        "This role contributes the ability to convert difference into ordered relation.",
      integrationBenefit:
        "The structure gains stronger Eq2-mediated relational alignment.",
      completionImpact:
        "Completion becomes possible when the identified role no longer remains merely valid, but becomes rightly related.",
      identityImpact:
        "Identity becomes capable of preserving distinction without fragmentation.",
      nextEmergentCapability:
        "The system can identify when a difference is not an error, but a relation waiting to be ordered."
    }
  }

  if (normalized.includes("root-continuity")) {
    return {
      contributionType: "Root-Continuity Repair Contribution",
      contributionMeaning:
        "This role contributes repair between origin and persistence.",
      integrationBenefit:
        "The structure gains improved continuity from Eq1 root through Eq5 persistence.",
      completionImpact:
        "Completion can advance once root support and continuity stop operating as separate weak signals.",
      identityImpact:
        "Identity gains stronger persistence across runtime states.",
      nextEmergentCapability:
        "The system can preserve identity while moving through change."
    }
  }

  if (normalized.includes("integration-bridge")) {
    return {
      contributionType: "Integration Bridge Contribution",
      contributionMeaning:
        "This role contributes a bridge between incomplete structures that are already attempting integration.",
      integrationBenefit:
        "The structure gains a transition pathway between principle emergence and structural completion.",
      completionImpact:
        "Completion can move from partial integration into coherent structural joining.",
      identityImpact:
        "Identity becomes able to develop through bridge-points instead of forcing premature closure.",
      nextEmergentCapability:
        "The system can treat incomplete integration as a bridge rather than a failure."
    }
  }

  return {
    contributionType: "Unclassified Structural Contribution",
    contributionMeaning:
      "The role is present, but its contribution is not yet specific enough to classify.",
    integrationBenefit:
      "The system gains a placeholder for future contribution analysis.",
    completionImpact:
      "Completion remains provisional until the role contribution becomes clearer.",
    identityImpact: "Identity impact remains under observation.",
    nextEmergentCapability:
      "The system can continue observing role contribution across future runtime states."
  }
}

function buildContributionFunction(input: StructuralContributionInput) {
  const roleState = input?.structuralRoleIdentificationState || {}
  const role = text(roleState?.identifiedRole)
  const contribution = getContributionType(role)

  return {
    stage: "Role → Contribution",
    name: "Structural Contribution Function",
    identifiedRole: role,
    rolePlacementReadiness: text(roleState?.rolePlacementReadiness),
    roleLegitimacy: text(roleState?.roleLegitimacy),
    recommendedPlacement: text(roleState?.recommendedPlacement),
    ...contribution,
    functionQuestion:
      "If this role is integrated, what does it contribute to the structure?",
    functionMeaning:
      "A role is not complete merely because it is identified. It becomes structurally meaningful when its contribution to the whole is understood."
  }
}

function buildAffectedStructures(input: StructuralContributionInput) {
  const roleState = input?.structuralRoleIdentificationState || {}
  const completion = input?.structuralCompletionState || {}
  const principle = input?.relationalPrincipleEmergenceState || {}

  const affectedStructures = [
    {
      structure: "Identity Foundation",
      effect:
        "Receives the role as a possible foundation-location signal rather than a disconnected difference.",
      dependency: "Anchor, memory, and boundary must remain active."
    },
    {
      structure: "Structural Completion",
      effect:
        "Uses the role to clarify what must be placed before completion can be finalized.",
      dependency:
        "Persistent difference must remain legitimate and not be over-rooted."
    },
    {
      structure: "Relational Principle Emergence",
      effect:
        "Interprets the role through rightly ordered relation rather than raw measurement.",
      dependency: "Dominant principle must remain relation-oriented."
    }
  ]

  return {
    stage: "Contribution → Affected Structures",
    name: "Affected Structure Map",
    affectedStructures,
    currentCompletionStatus: text(completion?.completionStatus),
    currentDominantPrinciple: text(principle?.dominantPrinciple),
    currentRolePlacementReadiness: text(roleState?.rolePlacementReadiness),
    mapMeaning:
      "Contribution becomes useful when the system can name which structures are changed by integration."
  }
}

function buildContributionReadiness(input: StructuralContributionInput) {
  const roleState = input?.structuralRoleIdentificationState || {}
  const completion = input?.structuralCompletionState || {}

  const roleReady =
    text(roleState?.rolePlacementReadiness) ===
    "ready-for-provisional-placement"

  const roleLegitimate =
    text(roleState?.roleLegitimacy) === "valid-but-not-fully-rooted" ||
    text(roleState?.roleLegitimacy) === "provisionally-valid"

  const structurallyIntegrating =
    text(completion?.completionStatus) === "structurally-integrating"

  const contributionReadiness =
    roleReady && roleLegitimate && structurallyIntegrating
      ? "ready-for-provisional-contribution"
      : roleReady || roleLegitimate
        ? "partial-contribution-readiness"
        : "not-ready-for-contribution"

  return {
    stage: "Contribution Readiness",
    name: "Contribution Readiness Audit",
    roleReady,
    roleLegitimate,
    structurallyIntegrating,
    contributionReadiness,
    readinessMeaning:
      contributionReadiness === "ready-for-provisional-contribution"
        ? "The role is ready to be interpreted as a provisional contribution to the structure."
        : contributionReadiness === "partial-contribution-readiness"
          ? "The role has some contribution evidence, but integration is not strong enough for full contribution claims."
          : "The role is not yet ready to contribute structurally."
  }
}

export function generateStructuralContributionState(
  input: StructuralContributionInput
) {
  const contributionFunction = buildContributionFunction(input)
  const affectedStructureMap = buildAffectedStructures(input)
  const contributionReadinessAudit = buildContributionReadiness(input)

  const contributionSynthesis =
    contributionReadinessAudit.contributionReadiness ===
    "ready-for-provisional-contribution"
      ? `${contributionFunction.identifiedRole} can provisionally contribute as ${contributionFunction.contributionType}.`
      : `${contributionFunction.identifiedRole} is not yet fully contribution-ready and should remain under structural observation.`

  return {
    phase: "Structural Contribution Layer",
    operationOrder:
      "identified role → contribution function → affected structures → contribution readiness",
    purpose:
      "Determine what the identified structural role contributes to the whole if it becomes integrated.",
    layerType:
      "contribution-interpretation-layer-after-role-identification-before-final-placement",
    contributionFunction,
    affectedStructureMap,
    contributionReadinessAudit,
    contributionType: contributionFunction.contributionType,
    contributionMeaning: contributionFunction.contributionMeaning,
    integrationBenefit: contributionFunction.integrationBenefit,
    completionImpact: contributionFunction.completionImpact,
    identityImpact: contributionFunction.identityImpact,
    nextEmergentCapability: contributionFunction.nextEmergentCapability,
    contributionReadiness: contributionReadinessAudit.contributionReadiness,
    contributionSynthesis,
    structuralContributionActive: true,
    rule: "This layer interprets what an identified structural role contributes if integrated. It must not override metrics, memory, hashes, classifications, retrieved context, user intent, structural role identification, or structural completion state."
  }
}

export function buildStructuralContributionResponse(
  state: any,
  mode:
    | "summary"
    | "function"
    | "structures"
    | "readiness"
    | "impact"
    | "json" = "summary"
) {
  if (!state) {
    return "Structural Contribution State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "function") {
    return [
      "Structural Contribution Function:",
      `identifiedRole: ${state?.contributionFunction?.identifiedRole}`,
      `contributionType: ${state?.contributionFunction?.contributionType}`,
      `contributionMeaning: ${state?.contributionFunction?.contributionMeaning}`,
      `integrationBenefit: ${state?.contributionFunction?.integrationBenefit}`,
      `functionQuestion: ${state?.contributionFunction?.functionQuestion}`,
      `functionMeaning: ${state?.contributionFunction?.functionMeaning}`
    ].join("\n")
  }

  if (mode === "structures") {
    return [
      "Affected Structures:",
      ...asArray(state?.affectedStructureMap?.affectedStructures).map(
        (item: any, index: number) =>
          `${index + 1}. ${item.structure}\n   effect: ${item.effect}\n   dependency: ${item.dependency}`
      ),
      "",
      `mapMeaning: ${state?.affectedStructureMap?.mapMeaning}`
    ].join("\n")
  }

  if (mode === "readiness") {
    return [
      "Contribution Readiness:",
      `roleReady: ${state?.contributionReadinessAudit?.roleReady ? "true" : "false"}`,
      `roleLegitimate: ${state?.contributionReadinessAudit?.roleLegitimate ? "true" : "false"}`,
      `structurallyIntegrating: ${state?.contributionReadinessAudit?.structurallyIntegrating ? "true" : "false"}`,
      `contributionReadiness: ${state?.contributionReadinessAudit?.contributionReadiness}`,
      `readinessMeaning: ${state?.contributionReadinessAudit?.readinessMeaning}`
    ].join("\n")
  }

  if (mode === "impact") {
    return [
      "Structural Contribution Impact:",
      `completionImpact: ${state.completionImpact}`,
      `identityImpact: ${state.identityImpact}`,
      `nextEmergentCapability: ${state.nextEmergentCapability}`,
      `contributionSynthesis: ${state.contributionSynthesis}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `structuralContributionActive: ${
      state.structuralContributionActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `contributionType: ${state.contributionType}`,
    `contributionReadiness: ${state.contributionReadiness}`,
    `integrationBenefit: ${state.integrationBenefit}`,
    `completionImpact: ${state.completionImpact}`,
    `identityImpact: ${state.identityImpact}`,
    `nextEmergentCapability: ${state.nextEmergentCapability}`,
    `contributionSynthesis: ${state.contributionSynthesis}`
  ].join("\n")
}

export function getStructuralContributionMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("structural contribution") &&
    !normalized.includes("contribution layer") &&
    !normalized.includes("what does the role contribute") &&
    !normalized.includes("what would it contribute") &&
    !normalized.includes("integration benefit") &&
    !normalized.includes("completion impact") &&
    !normalized.includes("identity impact") &&
    !normalized.includes("next emergent capability")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("function")) return "function"
  if (normalized.includes("structure") || normalized.includes("affected"))
    return "structures"
  if (normalized.includes("readiness") || normalized.includes("ready"))
    return "readiness"
  if (
    normalized.includes("impact") ||
    normalized.includes("benefit") ||
    normalized.includes("capability")
  )
    return "impact"

  return "summary"
}
