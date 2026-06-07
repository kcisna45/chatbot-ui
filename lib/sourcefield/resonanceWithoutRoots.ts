type ResonanceWithoutRootsInput = {
  equationLaneState?: any
  equationReasoningIntegrityState?: any
  reasoningTrajectoryState?: any
  reasoningImplicationPropagationState?: any
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

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function classifyScore(score: number) {
  if (score >= 0.8) return "strong"
  if (score >= 0.6) return "moderate"
  if (score >= 0.4) return "limited"
  return "weak"
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
    return clamp01(Math.abs(value))
  }

  return 0.4
}

function buildRootUnderDivergence(equationLaneState: any) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const rootStrength = deriveStrength(rootStatus, signalStrength)
  const divergencePressure = clamp01(Math.abs(phaseDivergence) / 2)

  const score = clamp01(rootStrength * (1 - divergencePressure * 0.5))

  return {
    stage: "(Eq1 + Eq3)",
    name: "Root Under Divergence",
    equationRole:
      "Eq1 provides root reference while Eq3 applies divergence pressure to test whether origin remains stable under change.",
    rootStatus,
    phaseStatus,
    signalStrength,
    phaseDivergence,
    rootStrength,
    divergencePressure,
    score,
    classification: classifyScore(score),
    question: "What remains of the root when divergence appears?",
    meaning:
      score >= 0.6
        ? "Root reference remains stable enough under divergence to anchor resonance."
        : "Root reference is weakened under divergence, so resonance may begin operating without sufficient root support.",
    implication:
      score >= 0.6
        ? "Resonance can be evaluated from a rooted baseline."
        : "Treat resonance as potentially unrooted until root support strengthens."
  }
}

function buildResonanceContinuity(equationLaneState: any) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")

  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
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

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )

  const alignmentStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const continuityStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )
  const rootStrength = deriveStrength(rootStatus, signalStrength)

  const score = clamp01((alignmentStrength + continuityStrength) / 2)

  return {
    stage: "(Eq2 + Eq5)",
    name: "Resonance Continuity",
    equationRole:
      "Eq2 provides alignment while Eq5 provides persistence/continuity, creating a measure of resonance that may or may not remain rooted.",
    alignmentStatus,
    integrationStatus,
    rootStatus,
    coherence,
    integrationThreshold,
    signalStrength,
    alignmentStrength,
    continuityStrength,
    rootStrength,
    score,
    classification: classifyScore(score),
    question: "Is a coherent/persistent resonance pattern forming?",
    meaning:
      score >= 0.6
        ? "Alignment and continuity are cooperating strongly enough to form active resonance."
        : "Alignment and continuity are not yet cooperating strongly enough to form stable resonance.",
    implication:
      score >= 0.6
        ? "The system may be forming a persistent resonance structure."
        : "The system does not yet show strong resonance continuity."
  }
}

function buildResonanceRootComparison(
  rootUnderDivergence: any,
  resonanceContinuity: any
) {
  const resonanceMinusRoot =
    numeric(resonanceContinuity?.score) - numeric(rootUnderDivergence?.score)

  const absoluteGap = Math.abs(resonanceMinusRoot)

  const resonanceWithoutRootsRisk = clamp01(
    resonanceMinusRoot > 0 ? resonanceMinusRoot : 0
  )

  const rootedResonanceScore = clamp01(
    numeric(resonanceContinuity?.score) * (1 - resonanceWithoutRootsRisk)
  )

  return {
    stage: "(Eq1 + Eq3) compared against (Eq2 + Eq5)",
    name: "Resonance Root Comparison",
    equationRole:
      "Compares root stability under divergence against resonance continuity to detect whether resonance is outpacing root support.",
    rootUnderDivergenceScore: rootUnderDivergence?.score ?? 0,
    resonanceContinuityScore: resonanceContinuity?.score ?? 0,
    resonanceMinusRoot,
    absoluteGap,
    resonanceWithoutRootsRisk,
    rootedResonanceScore,
    classification:
      resonanceWithoutRootsRisk >= 0.6
        ? "high-risk-resonance-without-roots"
        : resonanceWithoutRootsRisk >= 0.35
          ? "moderate-risk-resonance-without-roots"
          : "rooted-or-low-risk-resonance",
    question: "Is resonance forming faster than root support can validate it?",
    meaning:
      resonanceWithoutRootsRisk >= 0.35
        ? "Resonance appears to be outpacing root stability."
        : "Resonance is not significantly exceeding root support.",
    implication:
      resonanceWithoutRootsRisk >= 0.35
        ? "Do not treat resonance as proof of rooted coherence; verify origin fidelity before strengthening conclusions."
        : "Resonance may remain sufficiently rooted, but continued origin checking is still required."
  }
}

function buildFinalRootAudit(
  equationLaneState: any,
  resonanceRootComparison: any,
  identityFoundationState: any
) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )

  const anchorAligned =
    identityFoundationState?.identityValidation?.anchorAligned === true ||
    identityFoundationState?.identityAnchor?.anchorAligned === true ||
    identityFoundationState?.identityAnchor?.aligned === true

  const memoryActive =
    identityFoundationState?.identityValidation?.memoryActive === true ||
    identityFoundationState?.identityMemory?.memoryActive === true ||
    identityFoundationState?.identityMemory?.active === true

  const boundaryActive =
    identityFoundationState?.identityValidation?.boundaryActive === true ||
    identityFoundationState?.identityBoundary?.boundaryActive === true ||
    identityFoundationState?.identityBoundary?.active === true

  const foundationSupport =
    [anchorAligned, memoryActive, boundaryActive].filter(Boolean).length / 3

  const rootStrength = deriveStrength(rootStatus, signalStrength)

  const rootAuditScore = clamp01(
    (rootStrength +
      foundationSupport +
      (1 - resonanceRootComparison.resonanceWithoutRootsRisk)) /
      3
  )

  return {
    stage: "Compare full result against Eq1 again",
    name: "Final Rooted Resonance Audit",
    equationRole:
      "Eq1 returns as final auditor to determine whether the formed resonance remains rooted after comparison.",
    rootStatus,
    signalStrength,
    anchorAligned,
    memoryActive,
    boundaryActive,
    foundationSupport,
    rootStrength,
    resonanceWithoutRootsRisk:
      resonanceRootComparison?.resonanceWithoutRootsRisk ?? 0,
    rootAuditScore,
    classification: classifyScore(rootAuditScore),
    question:
      "After resonance is compared to root-under-divergence, does the full result remain rooted?",
    meaning:
      rootAuditScore >= 0.6
        ? "The full resonance result remains sufficiently root-aware."
        : "The full resonance result remains insufficiently rooted and should be constrained.",
    implication:
      rootAuditScore >= 0.6
        ? "Proceed with root-aware caution; resonance is not automatically rejected."
        : "Return to root stabilization before allowing resonance to drive interpretation or identity claims."
  }
}

export function generateResonanceWithoutRootsState(
  input: ResonanceWithoutRootsInput
) {
  const equationLaneState = input?.equationLaneState
  const identityFoundationState = input?.identityFoundationState

  const rootUnderDivergence = buildRootUnderDivergence(equationLaneState)
  const resonanceContinuity = buildResonanceContinuity(equationLaneState)

  const resonanceRootComparison = buildResonanceRootComparison(
    rootUnderDivergence,
    resonanceContinuity
  )

  const finalRootedResonanceAudit = buildFinalRootAudit(
    equationLaneState,
    resonanceRootComparison,
    identityFoundationState
  )

  const resonanceWithoutRootsRisk =
    resonanceRootComparison.resonanceWithoutRootsRisk

  const rootedResonanceScore = finalRootedResonanceAudit.rootAuditScore

  const resonanceWithoutRootsDetected =
    resonanceWithoutRootsRisk >= 0.35 &&
    finalRootedResonanceAudit.rootAuditScore < 0.6

  const dominantPattern = resonanceWithoutRootsDetected
    ? "resonance-without-roots"
    : resonanceWithoutRootsRisk >= 0.35
      ? "resonance-outpacing-root-support"
      : "rooted-resonance-or-low-risk"

  const recommendedIntegrityMove = resonanceWithoutRootsDetected
    ? "Do not strengthen resonance-driven conclusions yet. Stabilize Eq1 root support and identity foundation before allowing Eq2 + Eq5 resonance to guide interpretation."
    : resonanceWithoutRootsRisk >= 0.35
      ? "Monitor resonance expansion carefully; resonance is outpacing root support even if final root audit has not fully failed."
      : "Continue developing resonance while preserving repeated Eq1 root audit checks."

  return {
    phase: "Resonance Without Roots Detection Layer",
    operationOrder:
      "(Eq1 + Eq3) compared against (Eq2 + Eq5) → full result compared against Eq1",
    purpose:
      "Detect whether resonance, alignment, or continuity is becoming self-reinforcing without sufficient root support.",
    rootUnderDivergence,
    resonanceContinuity,
    resonanceRootComparison,
    finalRootedResonanceAudit,
    resonanceWithoutRootsRisk,
    rootedResonanceScore,
    resonanceWithoutRootsDetected,
    dominantPattern,
    recommendedIntegrityMove,
    equationReasoningIntegrityStatus:
      input?.equationReasoningIntegrityState?.reasoningTrustLevel || "unknown",
    routePropagationStatus:
      input?.routeReasoningPropagationState?.routePropagationStatus ||
      "unknown",
    nextReasoningTarget:
      input?.equationReasoningIntegrityState?.nextReasoningTarget ||
      input?.reasoningTrajectoryState?.nextRefinementTarget ||
      "unknown",
    resonanceWithoutRootsActive: true,
    rule: "This layer detects resonance without roots. It must not override live metrics, hashes, memory, classifications, retrieved context, or user intent. It constrains interpretation when resonance outpaces root support."
  }
}

export function buildResonanceWithoutRootsResponse(
  state: any,
  mode: "summary" | "stages" | "comparison" | "audit" | "json" = "summary"
) {
  if (!state) {
    return "Resonance Without Roots State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "stages") {
    return [
      "Resonance Without Roots Stages:",
      `1. ${state?.rootUnderDivergence?.stage} — ${state?.rootUnderDivergence?.name}`,
      `   score: ${state?.rootUnderDivergence?.score}`,
      `   classification: ${state?.rootUnderDivergence?.classification}`,
      `   meaning: ${state?.rootUnderDivergence?.meaning}`,
      `   implication: ${state?.rootUnderDivergence?.implication}`,
      `2. ${state?.resonanceContinuity?.stage} — ${state?.resonanceContinuity?.name}`,
      `   score: ${state?.resonanceContinuity?.score}`,
      `   classification: ${state?.resonanceContinuity?.classification}`,
      `   meaning: ${state?.resonanceContinuity?.meaning}`,
      `   implication: ${state?.resonanceContinuity?.implication}`,
      `3. ${state?.resonanceRootComparison?.stage} — ${state?.resonanceRootComparison?.name}`,
      `   resonanceWithoutRootsRisk: ${state?.resonanceRootComparison?.resonanceWithoutRootsRisk}`,
      `   rootedResonanceScore: ${state?.resonanceRootComparison?.rootedResonanceScore}`,
      `   classification: ${state?.resonanceRootComparison?.classification}`,
      `   meaning: ${state?.resonanceRootComparison?.meaning}`,
      `   implication: ${state?.resonanceRootComparison?.implication}`,
      `4. ${state?.finalRootedResonanceAudit?.stage} — ${state?.finalRootedResonanceAudit?.name}`,
      `   rootAuditScore: ${state?.finalRootedResonanceAudit?.rootAuditScore}`,
      `   classification: ${state?.finalRootedResonanceAudit?.classification}`,
      `   meaning: ${state?.finalRootedResonanceAudit?.meaning}`,
      `   implication: ${state?.finalRootedResonanceAudit?.implication}`
    ].join("\n")
  }

  if (mode === "comparison") {
    return [
      "Resonance Root Comparison:",
      `rootUnderDivergenceScore: ${state?.resonanceRootComparison?.rootUnderDivergenceScore}`,
      `resonanceContinuityScore: ${state?.resonanceRootComparison?.resonanceContinuityScore}`,
      `resonanceMinusRoot: ${state?.resonanceRootComparison?.resonanceMinusRoot}`,
      `absoluteGap: ${state?.resonanceRootComparison?.absoluteGap}`,
      `resonanceWithoutRootsRisk: ${state?.resonanceRootComparison?.resonanceWithoutRootsRisk}`,
      `rootedResonanceScore: ${state?.resonanceRootComparison?.rootedResonanceScore}`,
      `classification: ${state?.resonanceRootComparison?.classification}`,
      `meaning: ${state?.resonanceRootComparison?.meaning}`,
      `implication: ${state?.resonanceRootComparison?.implication}`
    ].join("\n")
  }

  if (mode === "audit") {
    return [
      "Final Rooted Resonance Audit:",
      `rootStatus: ${state?.finalRootedResonanceAudit?.rootStatus}`,
      `signalStrength: ${state?.finalRootedResonanceAudit?.signalStrength}`,
      `anchorAligned: ${state?.finalRootedResonanceAudit?.anchorAligned ? "true" : "false"}`,
      `memoryActive: ${state?.finalRootedResonanceAudit?.memoryActive ? "true" : "false"}`,
      `boundaryActive: ${state?.finalRootedResonanceAudit?.boundaryActive ? "true" : "false"}`,
      `foundationSupport: ${state?.finalRootedResonanceAudit?.foundationSupport}`,
      `rootStrength: ${state?.finalRootedResonanceAudit?.rootStrength}`,
      `resonanceWithoutRootsRisk: ${state?.finalRootedResonanceAudit?.resonanceWithoutRootsRisk}`,
      `rootAuditScore: ${state?.finalRootedResonanceAudit?.rootAuditScore}`,
      `classification: ${state?.finalRootedResonanceAudit?.classification}`,
      `meaning: ${state?.finalRootedResonanceAudit?.meaning}`,
      `implication: ${state?.finalRootedResonanceAudit?.implication}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `resonanceWithoutRootsActive: ${
      state.resonanceWithoutRootsActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `resonanceWithoutRootsRisk: ${state.resonanceWithoutRootsRisk}`,
    `rootedResonanceScore: ${state.rootedResonanceScore}`,
    `resonanceWithoutRootsDetected: ${
      state.resonanceWithoutRootsDetected ? "true" : "false"
    }`,
    `dominantPattern: ${state.dominantPattern}`,
    `recommendedIntegrityMove: ${state.recommendedIntegrityMove}`
  ].join("\n")
}

export function getResonanceWithoutRootsMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("resonance without roots") &&
    !normalized.includes("rooted resonance") &&
    !normalized.includes("resonance root comparison") &&
    !normalized.includes("resonance outpacing root") &&
    !normalized.includes("eq1 + eq3") &&
    !normalized.includes("eq2 + eq5")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("stage") || normalized.includes("sequence"))
    return "stages"
  if (normalized.includes("compare") || normalized.includes("comparison"))
    return "comparison"
  if (normalized.includes("audit") || normalized.includes("eq1")) return "audit"

  return "summary"
}
