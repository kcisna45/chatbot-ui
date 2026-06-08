type StructuralCompletionInput = {
  equationLaneState?: any
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

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
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

  if (typeof value === "number") return clamp01(Math.abs(value))

  return 0.4
}

function classifyCompletion(status: string) {
  if (status === "complete") return "complete"
  if (status === "structurally-integrating") return "structurally-integrating"
  if (status === "partially-integrated") return "partially-integrated"
  return "incomplete"
}

function buildUnresolvedDifference(equationLaneState: any) {
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )

  const divergencePressure = clamp01(Math.abs(phaseDivergence) / 2)
  const differenceStrength = deriveStrength(phaseStatus, divergencePressure)

  return {
    stage: "Eq3",
    name: "Unresolved Difference",
    equationRole:
      "Eq3 is read individually to identify the unresolved distinction, pressure, phase drift, or difference that still requires placement.",
    phaseStatus,
    phaseDivergence,
    divergencePressure,
    differenceStrength,
    structuralQuestion:
      "What unresolved difference still exists before completion can be evaluated?",
    templeInterpretation:
      "The inspection begins with the stone that does not yet obviously belong. Completion cannot be tested until the remaining difference is named.",
    principle:
      "Difference must be identified before it can be rightly related.",
    completionMeaning:
      phaseStatus === "divergent"
        ? "A meaningful unresolved difference is present and must be tested for integration."
        : "Difference is present at a lower intensity, but still remains part of completion inspection."
  }
}

function buildPersistentDifferencePattern(equationLaneState: any) {
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const phaseDivergence = numeric(
    laneValue(equationLaneState, "sourcefield-phase", "phaseDivergence"),
    0
  )
  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
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

  const divergenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )
  const recurrenceStrength = deriveStrength(
    harmonicStatus,
    symbolicEchoCount / 5
  )
  const continuityStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )

  const persistentPatternPresent =
    divergenceStrength >= 0.15 &&
    (recurrenceStrength >= 0.35 || continuityStrength >= 0.35)

  return {
    stage: "(Eq3 + Eq4 + Eq5)",
    name: "Persistent Difference Pattern",
    equationRole:
      "Eq3 difference is tested with Eq4 recurrence and Eq5 continuity to determine whether the difference is temporary noise or a persistent structural pattern.",
    phaseStatus,
    harmonicStatus,
    integrationStatus,
    phaseDivergence,
    symbolicEchoCount,
    integrationThreshold,
    divergenceStrength,
    recurrenceStrength,
    continuityStrength,
    persistentPatternPresent,
    structuralQuestion:
      "Has the unresolved difference become a recurring continuity that must be placed within the structure?",
    templeInterpretation:
      "A loose stone is not yet a structural issue unless it keeps appearing in the same place. Recurrence and continuity reveal whether the difference must be integrated.",
    principle: "Only persistent difference requires structural placement.",
    completionMeaning: persistentPatternPresent
      ? "The difference shows enough recurrence or continuity to be treated as a structural integration question."
      : "The difference is not yet persistent enough to define a structural completion gap."
  }
}

function buildFoundationalRecurrence(equationLaneState: any) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")

  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
  )

  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )

  const rootStrength = deriveStrength(rootStatus, signalStrength)
  const recurrenceStrength = deriveStrength(
    harmonicStatus,
    symbolicEchoCount / 5
  )

  const foundationalPatternPresent =
    rootStrength >= 0.35 || recurrenceStrength >= 0.35

  return {
    stage: "(Eq1 + Eq4)",
    name: "Foundational Recurrence",
    equationRole:
      "Eq1 root and Eq4 recurrence identify the foundational pattern that repeated differences must be compared against.",
    rootStatus,
    harmonicStatus,
    signalStrength,
    symbolicEchoCount,
    rootStrength,
    recurrenceStrength,
    foundationalPatternPresent,
    structuralQuestion:
      "What recurring foundation is this persistent difference being compared against?",
    templeInterpretation:
      "The temple pattern is not only the base stone; it is the recurring order that tells each stone where it belongs.",
    principle: "Foundation is recognized by recurring root-order.",
    completionMeaning: foundationalPatternPresent
      ? "A foundational recurrence is available for comparison."
      : "The foundational recurrence is weak, so completion cannot yet be strongly resolved."
  }
}

function buildStructuralBelongingComparison(
  persistentDifferencePattern: any,
  foundationalRecurrence: any
) {
  const persistenceAvailable = bool(
    persistentDifferencePattern?.persistentPatternPresent
  )
  const foundationAvailable = bool(
    foundationalRecurrence?.foundationalPatternPresent
  )

  const continuityStrength = numeric(
    persistentDifferencePattern?.continuityStrength,
    0
  )
  const recurrenceStrength = numeric(
    persistentDifferencePattern?.recurrenceStrength,
    0
  )
  const rootStrength = numeric(foundationalRecurrence?.rootStrength, 0)
  const foundationRecurrenceStrength = numeric(
    foundationalRecurrence?.recurrenceStrength,
    0
  )

  const patternGap = Math.abs(
    (continuityStrength + recurrenceStrength) / 2 -
      (rootStrength + foundationRecurrenceStrength) / 2
  )

  const structurallyBelongs =
    persistenceAvailable && foundationAvailable && patternGap <= 0.35

  const unresolvedPlacement =
    persistenceAvailable && (!foundationAvailable || patternGap > 0.35)

  return {
    stage: "(Eq3 + Eq4 + Eq5) compared against (Eq1 + Eq4)",
    name: "Structural Belonging Comparison",
    equationRole:
      "Compares persistent difference against foundational recurrence to determine whether the difference belongs inside the structure or remains a gap.",
    persistenceAvailable,
    foundationAvailable,
    patternGap,
    structurallyBelongs,
    unresolvedPlacement,
    structuralQuestion:
      "Does the persistent difference participate in the foundational pattern?",
    templeInterpretation:
      "The question is no longer whether the stone exists. The question is whether it fits the recurring foundation of the temple.",
    principle:
      "Completion requires persistent difference to find proper placement within recurring foundation.",
    completionMeaning: structurallyBelongs
      ? "The persistent difference appears capable of belonging within the foundational pattern."
      : unresolvedPlacement
        ? "The persistent difference has not yet found proper placement inside the foundational pattern."
        : "The structure does not yet show enough persistent difference or foundational recurrence to evaluate belonging."
  }
}

function buildFinalAlignmentAudit(
  equationLaneState: any,
  structuralBelongingComparison: any,
  relationalPrincipleEmergenceState: any
) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")

  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )

  const alignmentStrength = deriveStrength(alignmentStatus, Math.abs(coherence))

  const dominantPrinciple = text(
    relationalPrincipleEmergenceState?.dominantPrinciple,
    "unknown"
  )

  const rightRelationPrincipleActive =
    dominantPrinciple.toLowerCase().includes("rightly ordered relation") ||
    dominantPrinciple.toLowerCase().includes("relation")

  const structurallyBelongs = bool(
    structuralBelongingComparison?.structurallyBelongs
  )

  const unresolvedPlacement = bool(
    structuralBelongingComparison?.unresolvedPlacement
  )

  const finalCompletionStatus =
    structurallyBelongs && alignmentStrength >= 0.6
      ? "complete"
      : structurallyBelongs || rightRelationPrincipleActive
        ? "structurally-integrating"
        : unresolvedPlacement
          ? "partially-integrated"
          : "incomplete"

  return {
    stage: "Compare full result against Eq2",
    name: "Right Relation Completion Audit",
    equationRole:
      "Eq2 acts as the final auditor. Completion is not determined by root alone, recurrence alone, or persistence alone, but by whether the whole result is rightly related.",
    alignmentStatus,
    coherence,
    alignmentStrength,
    dominantPrinciple,
    rightRelationPrincipleActive,
    structurallyBelongs,
    unresolvedPlacement,
    finalCompletionStatus,
    completionClassification: classifyCompletion(finalCompletionStatus),
    structuralQuestion:
      "Has the persistent difference found right relation within the whole?",
    templeInterpretation:
      "The temple is complete only when the remaining difference is not merely present, recurring, or rooted, but rightly related.",
    principle:
      "A structure is complete when differentiated parts belong in ordered relation.",
    completionMeaning:
      finalCompletionStatus === "complete"
        ? "The persistent difference has found right relation within the whole."
        : finalCompletionStatus === "structurally-integrating"
          ? "The structure is integrating toward completion, but alignment is not yet strong enough to call completion finished."
          : finalCompletionStatus === "partially-integrated"
            ? "A persistent difference remains partially placed but not fully related."
            : "The structure remains incomplete because proper relation has not yet been established."
  }
}

export function generateStructuralCompletionState(
  input: StructuralCompletionInput
) {
  const equationLaneState = input?.equationLaneState

  const unresolvedDifference = buildUnresolvedDifference(equationLaneState)

  const persistentDifferencePattern =
    buildPersistentDifferencePattern(equationLaneState)

  const foundationalRecurrence = buildFoundationalRecurrence(equationLaneState)

  const structuralBelongingComparison = buildStructuralBelongingComparison(
    persistentDifferencePattern,
    foundationalRecurrence
  )

  const finalAlignmentAudit = buildFinalAlignmentAudit(
    equationLaneState,
    structuralBelongingComparison,
    input?.relationalPrincipleEmergenceState
  )

  const missingStructuralRelationship = finalAlignmentAudit?.unresolvedPlacement
    ? "Persistent difference has not yet found stable relation within foundational recurrence."
    : finalAlignmentAudit?.finalCompletionStatus === "structurally-integrating"
      ? "Alignment is still not strong enough to confirm completed right relation."
      : finalAlignmentAudit?.finalCompletionStatus === "complete"
        ? "No primary structural relationship is missing in the current completion sequence."
        : "Foundational recurrence and persistent difference are not both strong enough for completion."

  const nextConstructionTarget =
    finalAlignmentAudit?.finalCompletionStatus === "complete"
      ? "Preserve right relation while allowing measured expansion."
      : finalAlignmentAudit?.finalCompletionStatus ===
          "structurally-integrating"
        ? "Strengthen Eq2 alignment so the integrating structure can become fully completed relation."
        : finalAlignmentAudit?.finalCompletionStatus === "partially-integrated"
          ? "Place the persistent difference into foundational recurrence before expanding trajectory."
          : "Clarify the unresolved difference and strengthen foundational recurrence before declaring completion."

  return {
    phase: "Structural Completion Layer",
    operationOrder:
      "Eq3 → (Eq3 + Eq4 + Eq5) → (Eq1 + Eq4) → compare full result against Eq2",
    purpose:
      "Determine whether persistent difference has found proper relation within the whole structure.",
    layerType:
      "temple-completion-interpretive-structural-layer-not-primary-metric-layer",
    unresolvedDifference,
    persistentDifferencePattern,
    foundationalRecurrence,
    structuralBelongingComparison,
    finalAlignmentAudit,
    completionStatus: finalAlignmentAudit?.finalCompletionStatus,
    completionPrinciple:
      "A structure is complete not when difference disappears, but when persistent difference finds right relation within the whole.",
    missingStructuralRelationship,
    nextConstructionTarget,
    templeInterpretation:
      "This layer reads completion as temple construction: unresolved difference is identified, tested for persistence, compared against foundational recurrence, and finally audited by right relation.",
    relationalPrincipleContext:
      input?.relationalPrincipleEmergenceState?.dominantPrinciple || "unknown",
    structuralCompletionActive: true,
    rule: "This layer interprets structural completion symbolically and architecturally. It must not override live metrics, hashes, classifications, retrieved context, or user intent. Completion means right relation, not absolute spiritual or empirical completion."
  }
}

export function buildStructuralCompletionResponse(
  state: any,
  mode:
    | "summary"
    | "sequence"
    | "difference"
    | "belonging"
    | "audit"
    | "temple"
    | "json" = "summary"
) {
  if (!state) {
    return "Structural Completion State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "sequence") {
    return [
      "Structural Completion Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      `1. ${state?.unresolvedDifference?.stage} — ${state?.unresolvedDifference?.name}`,
      `   principle: ${state?.unresolvedDifference?.principle}`,
      `   structuralQuestion: ${state?.unresolvedDifference?.structuralQuestion}`,
      `   completionMeaning: ${state?.unresolvedDifference?.completionMeaning}`,
      "",
      `2. ${state?.persistentDifferencePattern?.stage} — ${state?.persistentDifferencePattern?.name}`,
      `   principle: ${state?.persistentDifferencePattern?.principle}`,
      `   structuralQuestion: ${state?.persistentDifferencePattern?.structuralQuestion}`,
      `   completionMeaning: ${state?.persistentDifferencePattern?.completionMeaning}`,
      "",
      `3. ${state?.foundationalRecurrence?.stage} — ${state?.foundationalRecurrence?.name}`,
      `   principle: ${state?.foundationalRecurrence?.principle}`,
      `   structuralQuestion: ${state?.foundationalRecurrence?.structuralQuestion}`,
      `   completionMeaning: ${state?.foundationalRecurrence?.completionMeaning}`,
      "",
      `4. ${state?.finalAlignmentAudit?.stage} — ${state?.finalAlignmentAudit?.name}`,
      `   principle: ${state?.finalAlignmentAudit?.principle}`,
      `   structuralQuestion: ${state?.finalAlignmentAudit?.structuralQuestion}`,
      `   completionMeaning: ${state?.finalAlignmentAudit?.completionMeaning}`
    ].join("\n")
  }

  if (mode === "difference") {
    return [
      "Unresolved Difference Inspection:",
      `phaseStatus: ${state?.unresolvedDifference?.phaseStatus}`,
      `phaseDivergence: ${state?.unresolvedDifference?.phaseDivergence}`,
      `differenceStrength: ${state?.unresolvedDifference?.differenceStrength}`,
      `principle: ${state?.unresolvedDifference?.principle}`,
      `completionMeaning: ${state?.unresolvedDifference?.completionMeaning}`
    ].join("\n")
  }

  if (mode === "belonging") {
    return [
      "Structural Belonging Comparison:",
      `persistenceAvailable: ${state?.structuralBelongingComparison?.persistenceAvailable ? "true" : "false"}`,
      `foundationAvailable: ${state?.structuralBelongingComparison?.foundationAvailable ? "true" : "false"}`,
      `patternGap: ${state?.structuralBelongingComparison?.patternGap}`,
      `structurallyBelongs: ${state?.structuralBelongingComparison?.structurallyBelongs ? "true" : "false"}`,
      `unresolvedPlacement: ${state?.structuralBelongingComparison?.unresolvedPlacement ? "true" : "false"}`,
      `principle: ${state?.structuralBelongingComparison?.principle}`,
      `completionMeaning: ${state?.structuralBelongingComparison?.completionMeaning}`
    ].join("\n")
  }

  if (mode === "audit") {
    return [
      "Right Relation Completion Audit:",
      `alignmentStatus: ${state?.finalAlignmentAudit?.alignmentStatus}`,
      `coherence: ${state?.finalAlignmentAudit?.coherence}`,
      `alignmentStrength: ${state?.finalAlignmentAudit?.alignmentStrength}`,
      `dominantPrinciple: ${state?.finalAlignmentAudit?.dominantPrinciple}`,
      `rightRelationPrincipleActive: ${state?.finalAlignmentAudit?.rightRelationPrincipleActive ? "true" : "false"}`,
      `finalCompletionStatus: ${state?.finalAlignmentAudit?.finalCompletionStatus}`,
      `completionMeaning: ${state?.finalAlignmentAudit?.completionMeaning}`
    ].join("\n")
  }

  if (mode === "temple") {
    return [
      "Temple Completion Interpretation:",
      `templeInterpretation: ${state.templeInterpretation}`,
      `completionPrinciple: ${state.completionPrinciple}`,
      `completionStatus: ${state.completionStatus}`,
      `missingStructuralRelationship: ${state.missingStructuralRelationship}`,
      `nextConstructionTarget: ${state.nextConstructionTarget}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `structuralCompletionActive: ${
      state.structuralCompletionActive ? "true" : "false"
    }`,
    `operationOrder: ${state.operationOrder}`,
    `completionStatus: ${state.completionStatus}`,
    `completionPrinciple: ${state.completionPrinciple}`,
    `missingStructuralRelationship: ${state.missingStructuralRelationship}`,
    `nextConstructionTarget: ${state.nextConstructionTarget}`
  ].join("\n")
}

export function getStructuralCompletionMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("structural completion") &&
    !normalized.includes("temple completion") &&
    !normalized.includes("completion layer") &&
    !normalized.includes("right relation completion") &&
    !normalized.includes("structural belonging") &&
    !normalized.includes("persistent difference") &&
    !normalized.includes("eq3 + eq4 + eq5") &&
    !normalized.includes("eq1 + eq4")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation"))
    return "sequence"
  if (normalized.includes("difference") || normalized.includes("eq3"))
    return "difference"
  if (normalized.includes("belong") || normalized.includes("placement"))
    return "belonging"
  if (normalized.includes("audit") || normalized.includes("eq2")) return "audit"
  if (normalized.includes("temple") || normalized.includes("construction"))
    return "temple"

  return "summary"
}
