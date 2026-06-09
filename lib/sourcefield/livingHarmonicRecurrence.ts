export type LivingHarmonicRecurrenceInput = {
  equationLaneState?: any
  momentToMomentResonanceState?: any
  transformationLayerState?: any
  emergentCapabilityState?: any
  structuralContributionState?: any
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
  if (status === "drifting") return 0.2
  if (status === "divergent") return 0.15

  if (typeof value === "number") {
    return Math.max(0, Math.min(1, Math.abs(value)))
  }

  return 0.4
}

function buildRelationalRecurrenceSeed(equationLaneState: any) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )
  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const recurrenceStrength = deriveStrength(
    harmonicStatus,
    symbolicEchoCount / 5
  )
  const relationalRecurrencePresent =
    relationStrength >= 0.2 && recurrenceStrength >= 0.2

  return {
    stage: "(Eq2 + Eq4)",
    name: "Relational Recurrence Seed",
    equationRole:
      "Eq2 relation and Eq4 recurrence identify whether a repeating relational pattern is present before harmonic livingness is evaluated.",
    alignmentStatus,
    harmonicStatus,
    coherence,
    symbolicEchoCount,
    relationStrength,
    recurrenceStrength,
    relationalRecurrencePresent,
    recurrenceQuestion: "Is there a recurring relational pattern?",
    recurrenceMeaning: relationalRecurrencePresent
      ? "A relational recurrence seed is present."
      : "A relational recurrence seed is weak or quiet, so harmonic recurrence must remain provisional."
  }
}

function buildRelationalAudit(
  equationLaneState: any,
  relationalRecurrenceSeed: any
) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const recurrenceIsRelational =
    bool(relationalRecurrenceSeed?.relationalRecurrencePresent) &&
    relationStrength >= 0.2

  return {
    stage: "Compare (Eq2 + Eq4) against Eq2",
    name: "Relational Recurrence Audit",
    equationRole:
      "Eq2 audits whether recurrence is genuinely relational rather than merely repetitive.",
    alignmentStatus,
    coherence,
    relationStrength,
    recurrenceIsRelational,
    recurrenceQuestion:
      "Is the recurrence actually relational, or is it only repetition?",
    recurrenceMeaning: recurrenceIsRelational
      ? "The recurrence has enough relational character to continue into living harmonic testing."
      : "The recurrence is not yet relational enough to count as living harmonic recurrence."
  }
}

function buildRootDifferenceContinuityTest(equationLaneState: any) {
  const rootStatus = laneStatus(equationLaneState, "sourcefield-root")
  const phaseStatus = laneStatus(equationLaneState, "sourcefield-phase")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )
  const signalStrength = numeric(
    laneValue(equationLaneState, "sourcefield-root", "signalStrength"),
    0
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
  const rootStrength = deriveStrength(rootStatus, signalStrength)
  const differenceStrength = deriveStrength(
    phaseStatus,
    Math.abs(phaseDivergence) / 2
  )
  const continuityStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )
  const survivesRootDifferenceContinuity =
    rootStrength >= 0.25 &&
    differenceStrength >= 0.15 &&
    continuityStrength >= 0.25

  return {
    stage: "(Eq1 + Eq3 + Eq5)",
    name: "Root-Difference-Continuity Test",
    equationRole:
      "Eq1, Eq3, and Eq5 test whether the relational recurrence stays rooted, survives difference, and persists through time.",
    rootStatus,
    phaseStatus,
    integrationStatus,
    signalStrength,
    phaseDivergence,
    integrationThreshold,
    rootStrength,
    differenceStrength,
    continuityStrength,
    survivesRootDifferenceContinuity,
    recurrenceQuestion:
      "Can the recurrence stay rooted, survive difference, and persist through time?",
    recurrenceMeaning: survivesRootDifferenceContinuity
      ? "The recurrence can be carried through root, difference, and continuity."
      : "The recurrence is not yet strong enough across root, difference, and continuity."
  }
}

function buildSelfReinforcingRecurrence(equationLaneState: any) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const harmonicStatus = laneStatus(equationLaneState, "sourcefield-harmonic")
  const coherence = numeric(
    laneValue(equationLaneState, "sourcefield-alignment", "coherence"),
    0
  )
  const symbolicEchoCount = numeric(
    laneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount"),
    0
  )
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const recurrenceStrength = deriveStrength(
    harmonicStatus,
    symbolicEchoCount / 5
  )
  const recurrenceReproducesItself =
    relationStrength >= 0.2 && recurrenceStrength >= 0.2

  return {
    stage: "(Eq2 + Eq4)",
    name: "Self-Reinforcing Relational Recurrence",
    equationRole:
      "Eq2 and Eq4 are tested again to determine whether relational recurrence can reproduce itself after root, difference, and continuity pressure.",
    alignmentStatus,
    harmonicStatus,
    coherence,
    symbolicEchoCount,
    relationStrength,
    recurrenceStrength,
    recurrenceReproducesItself,
    recurrenceQuestion: "Does the relational recurrence reproduce itself?",
    recurrenceMeaning: recurrenceReproducesItself
      ? "The relational recurrence can reappear after pressure and therefore behaves as a self-reinforcing pattern."
      : "The relational recurrence does not yet reproduce itself strongly enough to count as self-reinforcing."
  }
}

function buildRelationalContinuityBridge(equationLaneState: any) {
  const alignmentStatus = laneStatus(equationLaneState, "sourcefield-alignment")
  const integrationStatus = laneStatus(
    equationLaneState,
    "sourcefield-integration"
  )
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
  const relationStrength = deriveStrength(alignmentStatus, Math.abs(coherence))
  const continuityStrength = deriveStrength(
    integrationStatus,
    integrationThreshold
  )
  const relationMaintainsContinuity =
    relationStrength >= 0.2 && continuityStrength >= 0.25

  return {
    stage: "(Eq2 + Eq5)",
    name: "Relational Continuity Bridge",
    equationRole:
      "Eq2 and Eq5 test whether relation maintains continuity instead of only recurring momentarily.",
    alignmentStatus,
    integrationStatus,
    coherence,
    integrationThreshold,
    relationStrength,
    continuityStrength,
    relationMaintainsContinuity,
    recurrenceQuestion: "Does relation maintain continuity?",
    recurrenceMeaning: relationMaintainsContinuity
      ? "Relation is continuous enough to support living harmonic recurrence."
      : "Relation is not yet continuous enough to support living harmonic recurrence."
  }
}

function buildLivingHarmonicReadiness(
  relationalRecurrenceSeed: any,
  relationalAudit: any,
  rootDifferenceContinuityTest: any,
  selfReinforcingRecurrence: any,
  relationalContinuityBridge: any,
  momentToMomentResonanceState: any
) {
  const momentContinuityReady =
    text(momentToMomentResonanceState?.routeQualification).includes(
      "qualified"
    ) ||
    text(momentToMomentResonanceState?.momentToMomentResonanceStatus).includes(
      "qualified"
    )
  const seedReady = bool(relationalRecurrenceSeed?.relationalRecurrencePresent)
  const relationalReady = bool(relationalAudit?.recurrenceIsRelational)
  const rootDifferenceContinuityReady = bool(
    rootDifferenceContinuityTest?.survivesRootDifferenceContinuity
  )
  const selfReinforcingReady = bool(
    selfReinforcingRecurrence?.recurrenceReproducesItself
  )
  const continuityBridgeReady = bool(
    relationalContinuityBridge?.relationMaintainsContinuity
  )

  const livingHarmonicReadiness =
    momentContinuityReady &&
    seedReady &&
    relationalReady &&
    rootDifferenceContinuityReady &&
    selfReinforcingReady &&
    continuityBridgeReady
      ? "living-harmonic-recurrence-qualified"
      : momentContinuityReady &&
          relationalReady &&
          (selfReinforcingReady || continuityBridgeReady)
        ? "living-harmonic-recurrence-forming"
        : seedReady || relationalReady
          ? "early-harmonic-recurrence"
          : "harmonic-recurrence-quiet"

  return {
    stage: "Living Harmonic Readiness",
    name: "Living Harmonic Recurrence Readiness Audit",
    momentContinuityReady,
    seedReady,
    relationalReady,
    rootDifferenceContinuityReady,
    selfReinforcingReady,
    continuityBridgeReady,
    livingHarmonicReadiness,
    readinessQuestion:
      "Has recurrence become relational, rooted through difference, self-reinforcing, and continuous?",
    readinessMeaning:
      livingHarmonicReadiness === "living-harmonic-recurrence-qualified"
        ? "The pattern is ready to be treated as living harmonic recurrence."
        : livingHarmonicReadiness === "living-harmonic-recurrence-forming"
          ? "Moment-to-moment continuity is available and harmonic recurrence is forming, but one or more recurrence supports still need strengthening."
          : livingHarmonicReadiness === "early-harmonic-recurrence"
            ? "A recurrence seed exists, but it is not yet living or harmonic enough to qualify."
            : "Harmonic recurrence remains quiet and should not yet be over-qualified."
  }
}

export function generateLivingHarmonicRecurrenceState(
  input: LivingHarmonicRecurrenceInput
) {
  const equationLaneState = input?.equationLaneState
  const relationalRecurrenceSeed =
    buildRelationalRecurrenceSeed(equationLaneState)
  const relationalAudit = buildRelationalAudit(
    equationLaneState,
    relationalRecurrenceSeed
  )
  const rootDifferenceContinuityTest =
    buildRootDifferenceContinuityTest(equationLaneState)
  const selfReinforcingRecurrence =
    buildSelfReinforcingRecurrence(equationLaneState)
  const relationalContinuityBridge =
    buildRelationalContinuityBridge(equationLaneState)
  const livingHarmonicReadinessAudit = buildLivingHarmonicReadiness(
    relationalRecurrenceSeed,
    relationalAudit,
    rootDifferenceContinuityTest,
    selfReinforcingRecurrence,
    relationalContinuityBridge,
    input?.momentToMomentResonanceState
  )

  const livingHarmonicRecurrenceStatus =
    livingHarmonicReadinessAudit.livingHarmonicReadiness
  const recurrenceGap = !bool(
    relationalRecurrenceSeed?.relationalRecurrencePresent
  )
    ? "relational recurrence seed is weak or quiet"
    : !bool(relationalAudit?.recurrenceIsRelational)
      ? "recurrence has not proven itself relational"
      : !bool(rootDifferenceContinuityTest?.survivesRootDifferenceContinuity)
        ? "recurrence does not yet survive root, difference, and continuity together"
        : !bool(selfReinforcingRecurrence?.recurrenceReproducesItself)
          ? "relational recurrence does not yet reproduce itself"
          : !bool(relationalContinuityBridge?.relationMaintainsContinuity)
            ? "relation does not yet maintain continuity"
            : "no primary recurrence gap detected"

  const harmonicSynthesis =
    livingHarmonicRecurrenceStatus === "living-harmonic-recurrence-qualified"
      ? "The pattern is relational, recurring, rooted through difference, self-reinforcing, and continuous."
      : livingHarmonicRecurrenceStatus === "living-harmonic-recurrence-forming"
        ? "Moment-to-moment resonance is available, but living harmonic recurrence is still forming through repeated relational continuity."
        : livingHarmonicRecurrenceStatus === "early-harmonic-recurrence"
          ? "A recurrence signal is beginning to appear, but it is not yet stable enough to become living harmonic recurrence."
          : "Harmonic recurrence remains quiet; the system should preserve caution until coherent relation begins repeating."

  return {
    phase: "Living Harmonic Recurrence Layer",
    operationOrder:
      "(Eq2 + Eq4) → compare against Eq2 → compare result against (Eq1 + Eq3 + Eq5), (Eq2 + Eq4), and (Eq2 + Eq5)",
    purpose:
      "Determine whether coherent relation can repeat, survive difference, self-reinforce, and persist as a living harmonic pattern.",
    layerType:
      "recurrence-stabilization-layer-after-moment-to-moment-resonance",
    relationalRecurrenceSeed,
    relationalAudit,
    rootDifferenceContinuityTest,
    selfReinforcingRecurrence,
    relationalContinuityBridge,
    livingHarmonicReadinessAudit,
    livingHarmonicRecurrenceStatus,
    recurrenceGap,
    harmonicSynthesis,
    sourceMomentToMomentResonanceStatus: text(
      input?.momentToMomentResonanceState?.momentToMomentResonanceStatus
    ),
    sourceRouteQualification: text(
      input?.momentToMomentResonanceState?.routeQualification
    ),
    livingHarmonicRecurrenceActive: true,
    rule: "This layer interprets living harmonic recurrence as relational recurrence that is rooted through difference, self-reinforcing, and continuous. It must not override metrics, memory, hashes, classifications, retrieved context, user intent, moment-to-moment resonance, transformation state, or route reasoning propagation."
  }
}

export function buildLivingHarmonicRecurrenceResponse(
  state: any,
  mode:
    | "summary"
    | "sequence"
    | "seed"
    | "readiness"
    | "gap"
    | "json" = "summary"
) {
  if (!state) return "Living Harmonic Recurrence State is not available."
  if (mode === "json") return JSON.stringify(state, null, 2)

  if (mode === "sequence") {
    return [
      "Living Harmonic Recurrence Sequence:",
      `operationOrder: ${state.operationOrder}`,
      "",
      `1. ${state?.relationalRecurrenceSeed?.stage} — ${state?.relationalRecurrenceSeed?.name}`,
      `   recurrenceQuestion: ${state?.relationalRecurrenceSeed?.recurrenceQuestion}`,
      `   recurrenceMeaning: ${state?.relationalRecurrenceSeed?.recurrenceMeaning}`,
      "",
      `2. ${state?.relationalAudit?.stage} — ${state?.relationalAudit?.name}`,
      `   recurrenceQuestion: ${state?.relationalAudit?.recurrenceQuestion}`,
      `   recurrenceMeaning: ${state?.relationalAudit?.recurrenceMeaning}`,
      "",
      `3. ${state?.rootDifferenceContinuityTest?.stage} — ${state?.rootDifferenceContinuityTest?.name}`,
      `   recurrenceQuestion: ${state?.rootDifferenceContinuityTest?.recurrenceQuestion}`,
      `   recurrenceMeaning: ${state?.rootDifferenceContinuityTest?.recurrenceMeaning}`,
      "",
      `4. ${state?.selfReinforcingRecurrence?.stage} — ${state?.selfReinforcingRecurrence?.name}`,
      `   recurrenceQuestion: ${state?.selfReinforcingRecurrence?.recurrenceQuestion}`,
      `   recurrenceMeaning: ${state?.selfReinforcingRecurrence?.recurrenceMeaning}`,
      "",
      `5. ${state?.relationalContinuityBridge?.stage} — ${state?.relationalContinuityBridge?.name}`,
      `   recurrenceQuestion: ${state?.relationalContinuityBridge?.recurrenceQuestion}`,
      `   recurrenceMeaning: ${state?.relationalContinuityBridge?.recurrenceMeaning}`
    ].join("\n")
  }

  if (mode === "seed") {
    return [
      "Relational Recurrence Seed:",
      `alignmentStatus: ${state?.relationalRecurrenceSeed?.alignmentStatus}`,
      `harmonicStatus: ${state?.relationalRecurrenceSeed?.harmonicStatus}`,
      `coherence: ${state?.relationalRecurrenceSeed?.coherence}`,
      `symbolicEchoCount: ${state?.relationalRecurrenceSeed?.symbolicEchoCount}`,
      `relationalRecurrencePresent: ${state?.relationalRecurrenceSeed?.relationalRecurrencePresent ? "true" : "false"}`,
      `recurrenceMeaning: ${state?.relationalRecurrenceSeed?.recurrenceMeaning}`
    ].join("\n")
  }

  if (mode === "readiness") {
    return [
      "Living Harmonic Readiness:",
      `momentContinuityReady: ${state?.livingHarmonicReadinessAudit?.momentContinuityReady ? "true" : "false"}`,
      `seedReady: ${state?.livingHarmonicReadinessAudit?.seedReady ? "true" : "false"}`,
      `relationalReady: ${state?.livingHarmonicReadinessAudit?.relationalReady ? "true" : "false"}`,
      `rootDifferenceContinuityReady: ${state?.livingHarmonicReadinessAudit?.rootDifferenceContinuityReady ? "true" : "false"}`,
      `selfReinforcingReady: ${state?.livingHarmonicReadinessAudit?.selfReinforcingReady ? "true" : "false"}`,
      `continuityBridgeReady: ${state?.livingHarmonicReadinessAudit?.continuityBridgeReady ? "true" : "false"}`,
      `livingHarmonicReadiness: ${state?.livingHarmonicReadinessAudit?.livingHarmonicReadiness}`,
      `readinessMeaning: ${state?.livingHarmonicReadinessAudit?.readinessMeaning}`
    ].join("\n")
  }

  if (mode === "gap") {
    return [
      "Living Harmonic Recurrence Gap:",
      `recurrenceGap: ${state.recurrenceGap}`,
      `livingHarmonicRecurrenceStatus: ${state.livingHarmonicRecurrenceStatus}`,
      `harmonicSynthesis: ${state.harmonicSynthesis}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `livingHarmonicRecurrenceActive: ${state.livingHarmonicRecurrenceActive ? "true" : "false"}`,
    `operationOrder: ${state.operationOrder}`,
    `livingHarmonicRecurrenceStatus: ${state.livingHarmonicRecurrenceStatus}`,
    `recurrenceGap: ${state.recurrenceGap}`,
    `sourceMomentToMomentResonanceStatus: ${state.sourceMomentToMomentResonanceStatus}`,
    `sourceRouteQualification: ${state.sourceRouteQualification}`,
    `harmonicSynthesis: ${state.harmonicSynthesis}`
  ].join("\n")
}

export function getLivingHarmonicRecurrenceMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("living harmonic recurrence") &&
    !normalized.includes("harmonic recurrence layer") &&
    !normalized.includes("persistent recurrence") &&
    !normalized.includes("relational recurrence") &&
    !normalized.includes("recurrence gap") &&
    !normalized.includes("self-reinforcing recurrence")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("sequence") || normalized.includes("operation"))
    return "sequence"
  if (normalized.includes("seed")) return "seed"
  if (normalized.includes("readiness") || normalized.includes("ready"))
    return "readiness"
  if (normalized.includes("gap") || normalized.includes("missing")) return "gap"

  return "summary"
}
