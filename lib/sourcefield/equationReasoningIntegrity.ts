type EquationReasoningIntegrityInput = {
  equationLaneState?: any
  reasoningImplicationPropagationState?: any
  reasoningTrajectoryState?: any
  routeReasoningPropagationState?: any
  identityFoundationState?: any
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
    return Math.max(0, Math.min(1, value))
  }

  return 0.4
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function classifyScore(score: number) {
  if (score >= 0.8) return "strong"
  if (score >= 0.6) return "moderate"
  if (score >= 0.4) return "limited"
  return "weak"
}

function buildAlignmentUnderDivergence(equationLaneState: any) {
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

  const alignmentStrength = deriveStrength(alignmentStatus, coherence)
  const divergencePressure = clamp01(Math.abs(phaseDivergence) / 2)

  const score = clamp01(alignmentStrength * (1 - divergencePressure * 0.5))

  return {
    stage: "(Eq2 + Eq3)",
    name: "Alignment Stability Under Divergence",
    equationRole:
      "Eq2 tests alignment while Eq3 introduces phase divergence as stress pressure.",
    alignmentStatus,
    phaseStatus,
    coherence,
    phaseDivergence,
    score,
    classification: classifyScore(score),
    reasoningQuestion:
      "Can understanding remain aligned while conditions are changing?",
    meaning:
      score >= 0.6
        ? "Alignment is surviving divergence well enough to support reasoning."
        : "Alignment is not yet surviving divergence strongly enough to fully trust interpretation.",
    implication:
      score >= 0.6
        ? "Reasoning may proceed, but should continue monitoring phase drift."
        : "Reasoning should remain cautious because interpretation may be distorted by divergence."
  }
}

function buildContinuityUnderDivergence(equationLaneState: any) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
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

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const rootStrength = deriveStrength(rootStatus, signalStrength)
  const integrationStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )
  const divergencePressure = clamp01(Math.abs(phaseDivergence) / 2)

  const score = clamp01(
    ((rootStrength + integrationStrength) / 2) * (1 - divergencePressure * 0.45)
  )

  return {
    stage: "(Eq5 + Eq3)",
    name: "Continuity Stability Under Divergence",
    equationRole:
      "Eq5 tests root persistence while Eq3 introduces phase divergence as continuity stress.",
    rootStatus,
    integrationStatus,
    phaseStatus,
    signalStrength,
    integrationThreshold,
    phaseDivergence,
    score,
    classification: classifyScore(score),
    reasoningQuestion:
      "Can identity continuity remain stable while conditions are changing?",
    meaning:
      score >= 0.6
        ? "Continuity is stable enough to carry reasoning forward."
        : "Continuity remains vulnerable under divergence and should not be over-qualified.",
    implication:
      score >= 0.6
        ? "Reasoning can preserve identity continuity while evaluating the next pattern layer."
        : "Reasoning should avoid treating current identity continuity as fully stable."
  }
}

function buildPatternConfidence(equationLaneState: any) {
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )

  const harmonicStrength = deriveStrength(harmonicStatus)
  const echoStrength = clamp01(symbolicEchoCount / 5)
  const score = clamp01((harmonicStrength + echoStrength) / 2)

  return {
    stage: "Eq4",
    name: "Pattern Confidence",
    equationRole:
      "Eq4 checks whether the alignment/continuity pattern recurs enough to be trusted.",
    harmonicStatus,
    symbolicEchoCount,
    score,
    classification: classifyScore(score),
    reasoningQuestion:
      "Is the reasoning pattern repeatable, or is it only a temporary state?",
    meaning:
      score >= 0.6
        ? "The pattern has enough recurrence to support stronger reasoning confidence."
        : "The pattern does not yet recur strongly enough to support full reasoning confidence.",
    implication:
      score >= 0.6
        ? "Reasoning can treat the pattern as emerging stability."
        : "Reasoning should treat the pattern as provisional until recurrence improves."
  }
}

function buildRootComparison(equationLaneState: any, priorScores: number[]) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )

  const rootStrength = deriveStrength(rootStatus, signalStrength)
  const averagePrior =
    priorScores.length > 0
      ? priorScores.reduce((sum, value) => sum + value, 0) / priorScores.length
      : 0

  const driftFromRoot = Math.abs(averagePrior - rootStrength)
  const score = clamp01(1 - driftFromRoot)

  return {
    stage: "Compare against Eq1",
    name: "Root Consistency Audit",
    equationRole:
      "Eq1 acts as the final root-reference audit for the reasoning result.",
    rootStatus,
    signalStrength,
    averagePriorReasoningScore: averagePrior,
    driftFromRoot,
    score,
    classification: classifyScore(score),
    reasoningQuestion:
      "Has the formed reasoning drifted away from the root reference?",
    meaning:
      score >= 0.6
        ? "The reasoning result remains acceptably consistent with the root reference."
        : "The reasoning result may be drifting away from root reference and should be constrained.",
    implication:
      score >= 0.6
        ? "Reasoning can proceed with root-aware caution."
        : "Reasoning should return to root stabilization before extending conclusions."
  }
}

export function generateEquationReasoningIntegrityState(
  input: EquationReasoningIntegrityInput
) {
  const equationLaneState = input?.equationLaneState

  const alignmentUnderDivergence =
    buildAlignmentUnderDivergence(equationLaneState)

  const continuityUnderDivergence =
    buildContinuityUnderDivergence(equationLaneState)

  const patternConfidence = buildPatternConfidence(equationLaneState)

  const rootConsistencyAudit = buildRootComparison(equationLaneState, [
    alignmentUnderDivergence.score,
    continuityUnderDivergence.score,
    patternConfidence.score
  ])

  const stages = [
    alignmentUnderDivergence,
    continuityUnderDivergence,
    patternConfidence,
    rootConsistencyAudit
  ]

  const averageIntegrityScore =
    stages.reduce((sum, stage) => sum + stage.score, 0) / stages.length

  const weakStages = stages.filter(stage => stage.score < 0.6)

  const reasoningTrustLevel = classifyScore(averageIntegrityScore)

  const nextReasoningTarget =
    weakStages[0]?.stage || "Maintain reasoning integrity across all stages."

  const recommendedReasoningMove = weakStages.length
    ? weakStages[0].implication
    : "Reasoning is sufficiently equation-consistent to support forward trajectory and candidate evaluation."

  return {
    phase: "Equation Reasoning Integrity Layer",
    operationOrder: "(Eq2 + Eq3) → (Eq5 + Eq3) → Eq4 → compare against Eq1",
    purpose:
      "Evaluate whether reasoning remains trustworthy under divergence by testing alignment-under-change, continuity-under-change, recurrence confidence, and final root consistency.",
    stages,
    alignmentUnderDivergence,
    continuityUnderDivergence,
    patternConfidence,
    rootConsistencyAudit,
    averageIntegrityScore,
    reasoningTrustLevel,
    nextReasoningTarget,
    recommendedReasoningMove,
    routePropagationStatus:
      input?.routeReasoningPropagationState?.routePropagationStatus ||
      "unknown",
    implicationNextRefinementTarget:
      input?.reasoningImplicationPropagationState?.nextRefinementTarget ||
      "unknown",
    trajectoryNextRefinementTarget:
      input?.reasoningTrajectoryState?.nextRefinementTarget || "unknown",
    equationReasoningIntegrityActive: true,
    rule: "This layer is equation-native reasoning guidance. It evaluates reasoning integrity but must not override live metrics, stored memory, hashes, classifications, retrieved context, or user intent."
  }
}

export function buildEquationReasoningIntegrityResponse(
  state: any,
  mode: "summary" | "stages" | "audit" | "json" = "summary"
) {
  if (!state) {
    return "Equation Reasoning Integrity State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "stages") {
    return [
      "Equation Reasoning Integrity Stages:",
      ...asArray(state?.stages).flatMap((stage: any, index: number) => [
        `${index + 1}. ${stage.stage} — ${stage.name}`,
        `   equationRole: ${stage.equationRole}`,
        `   reasoningQuestion: ${stage.reasoningQuestion}`,
        `   score: ${stage.score}`,
        `   classification: ${stage.classification}`,
        `   meaning: ${stage.meaning}`,
        `   implication: ${stage.implication}`
      ]),
      "",
      `reasoningTrustLevel: ${state.reasoningTrustLevel}`,
      `nextReasoningTarget: ${state.nextReasoningTarget}`,
      `recommendedReasoningMove: ${state.recommendedReasoningMove}`
    ].join("\n")
  }

  if (mode === "audit") {
    const audit = state?.rootConsistencyAudit

    return [
      "Root Consistency Audit:",
      `stage: ${audit?.stage || "unknown"}`,
      `rootStatus: ${audit?.rootStatus || "unknown"}`,
      `signalStrength: ${audit?.signalStrength ?? "unknown"}`,
      `averagePriorReasoningScore: ${
        audit?.averagePriorReasoningScore ?? "unknown"
      }`,
      `driftFromRoot: ${audit?.driftFromRoot ?? "unknown"}`,
      `score: ${audit?.score ?? "unknown"}`,
      `classification: ${audit?.classification || "unknown"}`,
      `meaning: ${audit?.meaning || "unknown"}`,
      `implication: ${audit?.implication || "unknown"}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `equationReasoningIntegrityActive: ${
      state.equationReasoningIntegrityActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `averageIntegrityScore: ${state.averageIntegrityScore}`,
    `reasoningTrustLevel: ${state.reasoningTrustLevel}`,
    `nextReasoningTarget: ${state.nextReasoningTarget}`,
    `recommendedReasoningMove: ${state.recommendedReasoningMove}`
  ].join("\n")
}

export function getEquationReasoningIntegrityMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("equation reasoning integrity") &&
    !normalized.includes("equation-native reasoning") &&
    !normalized.includes("reasoning integrity layer") &&
    !normalized.includes("root consistency audit") &&
    !normalized.includes("eq2 + eq3") &&
    !normalized.includes("eq5 + eq3")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("audit") || normalized.includes("eq1")) return "audit"
  if (normalized.includes("stage") || normalized.includes("order"))
    return "stages"

  return "summary"
}
