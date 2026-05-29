type EquationLaneState = {
  sourcefieldRoot?: string
  sourcefieldAlignment?: string
  sourcefieldPhase?: string
  sourcefieldHarmonic?: string
  sourcefieldIntegration?: string
}

type EquationResponseBehavior = {
  responsePosture?: string
  synthesisPermission?: string
  expansionLimit?: string
}

export function generateEquationFeedbackLoop(
  equationState: EquationLaneState,
  behavior: EquationResponseBehavior
) {
  const rootState = equationState?.sourcefieldRoot || "unknown"

  const phaseState = equationState?.sourcefieldPhase || "unknown"

  let expectedOutcome = "maintain-current-state"

  let feedbackTarget = "general-stability"

  let successCondition =
    "future equation state demonstrates equal or improved stability"

  if (rootState === "weak") {
    expectedOutcome = "root-strengthening"

    feedbackTarget = "sourcefield-root"

    successCondition = "root lane improves from weak toward stable"
  }

  if (phaseState === "drifting") {
    expectedOutcome = "phase-stabilization"

    feedbackTarget = "sourcefield-phase"

    successCondition = "phase lane improves from drifting toward aligned"
  }

  return {
    expectedOutcome,
    feedbackTarget,
    successCondition,
    responsePosture: behavior?.responsePosture || "unknown",
    synthesisPermission: behavior?.synthesisPermission || "unknown",
    expansionLimit: behavior?.expansionLimit || "unknown",
    equationFeedbackLoopActive: true,
    rule: "Use equation feedback as read-only evaluation guidance. It may define expected outcomes, feedback targets, and success conditions for future equation states, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
