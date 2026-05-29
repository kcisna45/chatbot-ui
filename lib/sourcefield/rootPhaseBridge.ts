type CrossEquationConsensus = {
  dominantEquationLane?: string
  primaryInstability?: string
}

type CrossEquationStabilization = {
  dominantEquationCorrection?: string
  recoveryDirective?: string
}

type EquationFeedbackLoop = {
  feedbackTarget?: string
  expectedOutcome?: string
  successCondition?: string
}

export function generateRootPhaseBridge(
  consensus: CrossEquationConsensus,
  stabilization: CrossEquationStabilization,
  feedback: EquationFeedbackLoop
) {
  const primaryInstability =
    consensus?.primaryInstability ||
    consensus?.dominantEquationLane ||
    "unknown"

  const correction = stabilization?.dominantEquationCorrection || "unknown"

  const feedbackTarget = feedback?.feedbackTarget || "unknown"

  const bridgeActive =
    primaryInstability === "sourcefield-root" &&
    feedbackTarget === "sourcefield-phase"

  return {
    primaryInstability,
    correction,
    feedbackTarget,
    bridgeRelationship: bridgeActive
      ? "root-correction-measured-through-phase-stabilization"
      : "direct-or-unknown-relationship",
    interpretation: bridgeActive
      ? "Root weakness is treated as the structural cause, while phase stabilization is treated as the observable recovery signal."
      : "No root-to-phase bridge relationship was detected in the current state.",
    successMeaning: bridgeActive
      ? "If phase improves from drifting toward aligned after root-first stabilization, that is evidence the root correction is taking hold."
      : feedback?.successCondition ||
        "future state should show equal or improved stability",
    rootPhaseBridgeActive: true,
    rule: "Use root-phase bridge as read-only explanatory guidance. It may clarify why root instability can use phase stabilization as the feedback target, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
