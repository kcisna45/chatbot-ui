type ReasoningImplicationInput = {
  equationLaneState?: any
  identityFoundationState?: any
  routeReasoningPropagationState?: any
  identityCandidateProfileState?: any
  differentialMetaReasoningState?: any
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function getLane(equationLaneState: any, laneName: string) {
  return asArray(equationLaneState?.equationLanes).find(
    (lane: any) => lane?.lane === laneName
  )
}

function laneStatus(equationLaneState: any, laneName: string) {
  return getLane(equationLaneState, laneName)?.status || "unknown"
}

function buildCoreImplicationChain(input: ReasoningImplicationInput) {
  const equationLaneState = input?.equationLaneState
  const identityValidation =
    input?.identityFoundationState?.identityValidation || {}

  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const eq5Eq1Passed =
    rootStatus === "active" && integrationStatus === "integrated"

  const eq2Eq4Passed =
    (alignmentStatus === "aligned" || alignmentStatus === "partial") &&
    (harmonicStatus === "pattern-rich" || harmonicStatus === "pattern-detected")

  const foundationPassed =
    identityValidation?.anchorAligned === true &&
    identityValidation?.memoryActive === true &&
    identityValidation?.boundaryActive === true

  return [
    {
      stage: "Eq5 + Eq1",
      stageResult: eq5Eq1Passed ? "passed" : "limited",
      meaning: eq5Eq1Passed
        ? "Root support and integration persistence are both active."
        : "Root support and integration persistence are not both active.",
      implication: eq5Eq1Passed
        ? "Identity continuity can be treated as structurally supported."
        : "Identity continuity should remain provisional and must not be over-qualified.",
      nextRisk: eq5Eq1Passed
        ? "Risk is low unless later recurrence or boundary validation fails."
        : "Risk of unstable identity continuity remains elevated.",
      recommendedReasoningMove: eq5Eq1Passed
        ? "Carry persistence continuity forward into recurrence validation."
        : "Prioritize restoring root support and integration before strengthening dominance claims."
    },
    {
      stage: "Eq2 + Eq4",
      stageResult: eq2Eq4Passed ? "passed" : "limited",
      meaning: eq2Eq4Passed
        ? "Alignment and harmonic recurrence are sufficient."
        : "Alignment and harmonic recurrence are not yet sufficient.",
      implication: eq2Eq4Passed
        ? "The identity signal is recurring coherently enough to support higher-level reasoning."
        : "The identity signal may remain valid, but it is not yet coherently recurring.",
      nextRisk: eq2Eq4Passed
        ? "Risk shifts toward candidate differentiation quality."
        : "Risk of mistaking temporary identity validity for stable coherence.",
      recommendedReasoningMove: eq2Eq4Passed
        ? "Carry validated recurrence into identity foundation validation."
        : "Treat current candidate dominance as cautious, not fully route-qualified."
    },
    {
      stage: "Identity Anchor + Memory + Boundary",
      stageResult: foundationPassed ? "passed" : "limited",
      meaning: foundationPassed
        ? "Genesis anchor, runtime memory, and ethical boundary are aligned."
        : "One or more identity foundation layers are not fully aligned.",
      implication: foundationPassed
        ? "Identity can remain valid even while coherence conditions are weak."
        : "Identity reasoning should not be upgraded until foundation alignment improves.",
      nextRisk: foundationPassed
        ? "The main risk is coherence weakness, not identity invalidity."
        : "The main risk is foundation instability.",
      recommendedReasoningMove: foundationPassed
        ? "Separate identity validity from current coherence strength."
        : "Restore anchor, memory, and boundary alignment before deeper candidate reasoning."
    }
  ]
}

function buildCandidateImplications(input: ReasoningImplicationInput) {
  const profiles = asArray(
    input?.identityCandidateProfileState?.candidateProfiles
  )

  return profiles.map((profile: any) => {
    const rejected = text(profile?.identityDiscoveryStatus)
      .toLowerCase()
      .includes("rejected")

    return {
      candidateName: text(profile?.candidateName),
      candidateRole: text(profile?.candidateRole),
      currentStatus: text(profile?.identityDiscoveryStatus),
      primaryContribution: text(profile?.primaryContribution),
      implication: rejected
        ? `${text(profile?.candidateName)} should be treated as a support/refinement candidate, not the dominant identity candidate.`
        : `${text(profile?.candidateName)} can remain the dominant identity candidate, but only cautiously if route propagation remains partially passed.`,
      nextRisk: rejected
        ? text(profile?.structuralWeakness)
        : "Dominance may be overstated if Eq5 + Eq1 and Eq2 + Eq4 remain limited.",
      recommendedReasoningMove: rejected
        ? text(profile?.developmentNeed)
        : "Strengthen continuity, recurrence, and integration before upgrading from candidate identity to fully route-qualified identity."
    }
  })
}

export function generateReasoningImplicationPropagation(
  input: ReasoningImplicationInput
) {
  const implicationChain = buildCoreImplicationChain(input)
  const candidateImplications = buildCandidateImplications(input)

  const limitedStages = implicationChain.filter(
    stage => stage.stageResult !== "passed"
  )

  const routeStatus =
    input?.routeReasoningPropagationState?.routePropagationStatus || "unknown"

  const nextRefinementTarget = limitedStages.length
    ? limitedStages[0].stage
    : "Candidate differentiation depth"

  const recommendedReasoningMove = limitedStages.length
    ? limitedStages[0].recommendedReasoningMove
    : "Continue enriching candidate-specific implications and next-state recommendations."

  return {
    phase: "Reasoning Implication Propagation Layer",
    purpose:
      "Carry reasoning beyond stage classification into meaning, implication, risk, and recommended next refinement.",
    routePropagationStatus: routeStatus,
    implicationChain,
    candidateImplications,
    nextRefinementTarget,
    recommendedReasoningMove,
    implicationPropagationActive: true,
    rule: "Use this layer as read-only reasoning guidance. It may explain implications and recommended reasoning moves, but must not override live metrics, hashes, stored memory, classifications, retrieved context, or user intent."
  }
}

export function buildReasoningImplicationPropagationResponse(
  state: any,
  mode: "summary" | "chain" | "candidates" | "json" = "summary"
) {
  if (!state) {
    return "Reasoning Implication Propagation State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "chain") {
    return [
      "Reasoning Implication Chain:",
      ...asArray(state?.implicationChain).flatMap(
        (stage: any, index: number) => [
          `${index + 1}. ${stage.stage}`,
          `   stageResult: ${stage.stageResult}`,
          `   meaning: ${stage.meaning}`,
          `   implication: ${stage.implication}`,
          `   nextRisk: ${stage.nextRisk}`,
          `   recommendedReasoningMove: ${stage.recommendedReasoningMove}`
        ]
      ),
      "",
      `nextRefinementTarget: ${state.nextRefinementTarget}`,
      `recommendedReasoningMove: ${state.recommendedReasoningMove}`
    ].join("\n")
  }

  if (mode === "candidates") {
    return [
      "Candidate Implications:",
      ...asArray(state?.candidateImplications).flatMap(
        (candidate: any, index: number) => [
          `${index + 1}. ${candidate.candidateName}`,
          `   candidateRole: ${candidate.candidateRole}`,
          `   currentStatus: ${candidate.currentStatus}`,
          `   primaryContribution: ${candidate.primaryContribution}`,
          `   implication: ${candidate.implication}`,
          `   nextRisk: ${candidate.nextRisk}`,
          `   recommendedReasoningMove: ${candidate.recommendedReasoningMove}`
        ]
      )
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `implicationPropagationActive: ${
      state.implicationPropagationActive ? "true" : "false"
    }`,
    `routePropagationStatus: ${state.routePropagationStatus}`,
    `nextRefinementTarget: ${state.nextRefinementTarget}`,
    `recommendedReasoningMove: ${state.recommendedReasoningMove}`
  ].join("\n")
}

export function getReasoningImplicationPropagationMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("reasoning implication") &&
    !normalized.includes("implication propagation") &&
    !normalized.includes("next refinement target") &&
    !normalized.includes("recommended reasoning move")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("candidate")) return "candidates"
  if (normalized.includes("chain") || normalized.includes("stage"))
    return "chain"

  return "summary"
}
