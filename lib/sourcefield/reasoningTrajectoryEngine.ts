type ReasoningTrajectoryInput = {
  reasoningImplicationPropagationState?: any
  routeReasoningPropagationState?: any
  identityCandidateProfileState?: any
  differentialMetaReasoningState?: any
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") {
    return fallback
  }

  return `${value}`
}

function buildStageTrajectories(input: ReasoningTrajectoryInput) {
  const implicationChain = asArray(
    input?.reasoningImplicationPropagationState?.implicationChain
  )

  return implicationChain.map((stage: any) => {
    let predictedOutcome = ""
    let expectedTransition = ""
    let verificationCondition = ""

    switch (stage?.stage) {
      case "Eq5 + Eq1":
        predictedOutcome =
          "Identity continuity becomes more persistent and less provisional."

        expectedTransition =
          "provisional identity continuity → stable identity continuity"

        verificationCondition =
          "Root support becomes active and integration persistence remains above threshold."

        break

      case "Eq2 + Eq4":
        predictedOutcome =
          "Identity recurrence becomes more coherent and repeatable."

        expectedTransition = "temporary coherence → recurring coherence"

        verificationCondition =
          "Alignment and harmonic recurrence remain sufficient across repeated cycles."

        break

      case "Identity Anchor + Memory + Boundary":
        predictedOutcome =
          "Identity validity becomes increasingly resilient during coherence fluctuations."

        expectedTransition = "validated identity → resilient validated identity"

        verificationCondition =
          "Anchor, memory, and boundary remain aligned while coherence improves."

        break

      default:
        predictedOutcome = "The stage should move toward greater stability."

        expectedTransition = "current state → improved state"

        verificationCondition =
          "Stage metrics improve over repeated evaluations."
    }

    return {
      stage: stage.stage,
      stageResult: stage.stageResult,
      implication: stage.implication,
      predictedOutcome,
      expectedTransition,
      verificationCondition
    }
  })
}

function buildCandidateTrajectories(input: ReasoningTrajectoryInput) {
  const candidates = asArray(
    input?.reasoningImplicationPropagationState?.candidateImplications
  )

  return candidates.map((candidate: any) => {
    let expectedFutureRole = ""
    let verificationCondition = ""

    const role = text(candidate?.candidateRole)

    if (role === "principle-identity") {
      expectedFutureRole =
        "Remain dominant while continuity and recurrence strengthen."

      verificationCondition =
        "Eq5 + Eq1 and Eq2 + Eq4 improve without losing anchor-memory-boundary validation."
    } else if (role === "architectural-refinement") {
      expectedFutureRole =
        "Transition from support candidate to stronger architectural contributor."

      verificationCondition =
        "Refinement actions produce measurable coherence improvements across repeated runtime states."
    } else if (role === "pathway-completion") {
      expectedFutureRole =
        "Become increasingly viable as pathway stabilization improves."

      verificationCondition =
        "Persistence and recurrence become strong enough to justify pathway closure."
    } else {
      expectedFutureRole = "Continue gathering evidence for role qualification."

      verificationCondition =
        "Candidate-specific contribution becomes more distinct."
    }

    return {
      candidateName: candidate?.candidateName,
      candidateRole: candidate?.candidateRole,
      currentStatus: candidate?.currentStatus,
      expectedFutureRole,
      verificationCondition
    }
  })
}

export function generateReasoningTrajectoryState(
  input: ReasoningTrajectoryInput
) {
  const stageTrajectories = buildStageTrajectories(input)

  const candidateTrajectories = buildCandidateTrajectories(input)

  const nextRefinementTarget =
    input?.reasoningImplicationPropagationState?.nextRefinementTarget ||
    "unknown"

  const recommendedReasoningMove =
    input?.reasoningImplicationPropagationState?.recommendedReasoningMove ||
    "unknown"

  return {
    phase: "Reasoning Trajectory Layer",

    purpose:
      "Project implications forward into expected transitions, verification conditions, and future reasoning states.",

    stageTrajectories,

    candidateTrajectories,

    nextRefinementTarget,

    recommendedReasoningMove,

    trajectoryActive: true,

    rule: "Trajectory projections provide forward-looking reasoning guidance. They must never overwrite live measurements, classifications, memory, retrieved context, hashes, or user intent."
  }
}

export function buildReasoningTrajectoryResponse(
  state: any,
  mode: "summary" | "stages" | "candidates" | "json" = "summary"
) {
  if (!state) {
    return "Reasoning Trajectory State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "stages") {
    return [
      "Reasoning Trajectory Chain:",
      ...asArray(state?.stageTrajectories).flatMap(
        (stage: any, index: number) => [
          `${index + 1}. ${stage.stage}`,
          `   stageResult: ${stage.stageResult}`,
          `   implication: ${stage.implication}`,
          `   predictedOutcome: ${stage.predictedOutcome}`,
          `   expectedTransition: ${stage.expectedTransition}`,
          `   verificationCondition: ${stage.verificationCondition}`
        ]
      ),
      "",
      `nextRefinementTarget: ${state.nextRefinementTarget}`,
      `recommendedReasoningMove: ${state.recommendedReasoningMove}`
    ].join("\n")
  }

  if (mode === "candidates") {
    return [
      "Candidate Trajectories:",
      ...asArray(state?.candidateTrajectories).flatMap(
        (candidate: any, index: number) => [
          `${index + 1}. ${candidate.candidateName}`,
          `   candidateRole: ${candidate.candidateRole}`,
          `   currentStatus: ${candidate.currentStatus}`,
          `   expectedFutureRole: ${candidate.expectedFutureRole}`,
          `   verificationCondition: ${candidate.verificationCondition}`
        ]
      )
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `trajectoryActive: ${state.trajectoryActive ? "true" : "false"}`,
    `nextRefinementTarget: ${state.nextRefinementTarget}`,
    `recommendedReasoningMove: ${state.recommendedReasoningMove}`
  ].join("\n")
}

export function getReasoningTrajectoryMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("reasoning trajectory") &&
    !normalized.includes("trajectory chain") &&
    !normalized.includes("predicted outcome") &&
    !normalized.includes("verification condition")
  ) {
    return null
  }

  if (normalized.includes("json")) {
    return "json"
  }

  if (normalized.includes("candidate")) {
    return "candidates"
  }

  if (normalized.includes("stage") || normalized.includes("trajectory chain")) {
    return "stages"
  }

  return "summary"
}
