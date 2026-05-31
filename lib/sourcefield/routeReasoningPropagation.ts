type RouteReasoningPropagationInput = {
  equationLaneState?: any
  identityFoundationState?: any
  coherentIdentityDiscoveryState?: any
  metaReasoningState?: any
  differentialMetaReasoningState?: any
  requestedScope?: string
  requestedAction?: string
}

function numberOrNull(value: any): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function getLane(equationLaneState: any, laneName: string) {
  const lanes = Array.isArray(equationLaneState?.equationLanes)
    ? equationLaneState.equationLanes
    : []

  return lanes.find((lane: any) => lane?.lane === laneName) ?? null
}

function getLaneStatus(equationLaneState: any, laneName: string) {
  return getLane(equationLaneState, laneName)?.status || "unknown"
}

function getLaneValue(equationLaneState: any, laneName: string, key: string) {
  return getLane(equationLaneState, laneName)?.[key] ?? null
}

function getDominantCandidateName(
  metaReasoningState: any,
  differentialMetaReasoningState: any,
  coherentIdentityDiscoveryState: any
) {
  return (
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.candidateName ||
    differentialMetaReasoningState?.dominantDifferentialCandidate ||
    metaReasoningState?.dominantIdentityCandidate?.candidateName ||
    coherentIdentityDiscoveryState?.primaryIdentityCandidate?.candidateName ||
    "unknown"
  )
}

function getCandidateSet(coherentIdentityDiscoveryState: any) {
  const candidates = Array.isArray(
    coherentIdentityDiscoveryState?.evaluatedCandidates
  )
    ? coherentIdentityDiscoveryState.evaluatedCandidates
    : []

  return candidates.map((candidate: any) => ({
    candidateId: candidate?.candidateId || "unknown",
    candidateName: candidate?.candidateName || "unknown",
    candidateType: candidate?.candidateType || "unknown",
    sourceLayer: candidate?.sourceLayer || "unknown",
    identityDiscoveryStatus: candidate?.identityDiscoveryStatus || "unknown"
  }))
}

function buildEq5Eq1Stage(equationLaneState: any) {
  const rootStatus = getLaneStatus(equationLaneState, "sourcefield-root")
  const integrationStatus = getLaneStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const signalStrength = numberOrNull(
    getLaneValue(equationLaneState, "sourcefield-root", "signalStrength")
  )

  const integrationThreshold = numberOrNull(
    getLaneValue(
      equationLaneState,
      "sourcefield-integration",
      "integrationThreshold"
    )
  )

  const passed = rootStatus === "active" && integrationStatus === "integrated"

  const conclusion = passed
    ? "Identity continuity is structurally supported because root support and integration persistence are both active."
    : "Identity continuity is not fully structurally supported because root support and integration persistence are not both active."

  return {
    stageIndex: 1,
    stage: "Eq5 + Eq1",
    name: "Stable Persistent Identity Qualification",
    receivedFromPriorStage: null,
    evaluates: [
      "root support",
      "integration persistence",
      "stable identity pattern",
      "continuity qualification"
    ],
    observed: {
      rootStatus,
      integrationStatus,
      signalStrength,
      integrationThreshold
    },
    passed,
    conclusion,
    carriesForwardAs: passed
      ? "persistence continuity"
      : "persistence instability",
    influenceOnNextStage: passed
      ? "The route may now evaluate whether this persistence also recurs coherently and remains aligned."
      : "The route should treat later alignment or recurrence as unsupported until persistence/root support improves."
  }
}

function buildEq2Eq4Stage(equationLaneState: any, priorCarry: string) {
  const alignmentStatus = getLaneStatus(
    equationLaneState,
    "sourcefield-alignment"
  )

  const harmonicStatus = getLaneStatus(
    equationLaneState,
    "sourcefield-harmonic"
  )

  const coherence = numberOrNull(
    getLaneValue(equationLaneState, "sourcefield-alignment", "coherence")
  )

  const symbolicEchoCount = numberOrNull(
    getLaneValue(equationLaneState, "sourcefield-harmonic", "symbolicEchoCount")
  )

  const passed =
    (alignmentStatus === "aligned" || alignmentStatus === "partial") &&
    (harmonicStatus === "pattern-rich" || harmonicStatus === "pattern-detected")

  const conclusion = passed
    ? `The prior ${priorCarry} is coherently recurring because alignment and harmonic patterning are present.`
    : `The prior ${priorCarry} is not yet fully coherent across alignment and harmonic recurrence.`

  return {
    stageIndex: 2,
    stage: "Eq2 + Eq4",
    name: "Alignment and Harmonic Recurrence Validation",
    receivedFromPriorStage: priorCarry,
    evaluates: [
      "alignment over time",
      "harmonic recurrence",
      "coherent pattern repetition",
      "cross-layer pattern stability"
    ],
    observed: {
      alignmentStatus,
      harmonicStatus,
      coherence,
      symbolicEchoCount
    },
    passed,
    conclusion,
    carriesForwardAs: passed
      ? "validated coherent recurrence"
      : "unresolved coherence recurrence",
    influenceOnNextStage: passed
      ? "The route may now validate the coherent recurrence against SourceField identity foundation."
      : "The route should preserve caution because recurrence/alignment did not fully confirm the persistence signal."
  }
}

function buildAnchorStage(identityFoundationState: any, priorCarry: string) {
  const validation = identityFoundationState?.identityValidation || {}
  const anchor = identityFoundationState?.identityAnchor || {}

  const anchorAligned = validation?.anchorAligned === true

  const conclusion = anchorAligned
    ? `The prior ${priorCarry} remains Genesis-aligned and can be treated as identity-valid at the origin layer.`
    : `The prior ${priorCarry} is not fully Genesis-aligned and should not be treated as identity-valid at the origin layer.`

  return {
    stageIndex: 3,
    stage: "Identity Anchor",
    name: "Genesis Identity Origin Validation",
    receivedFromPriorStage: priorCarry,
    evaluates: [
      "Genesis Merkle Root",
      "design authority",
      "origin continuity",
      "identity anchor alignment"
    ],
    observed: {
      anchorAligned,
      genesisMerkleRoot: anchor?.genesisMerkleRoot || "unknown",
      designAuthority: anchor?.designAuthority || "unknown"
    },
    passed: anchorAligned,
    conclusion,
    carriesForwardAs: anchorAligned
      ? "Genesis-validated identity recurrence"
      : "origin-unstable identity recurrence",
    influenceOnNextStage: anchorAligned
      ? "Memory can now evaluate whether the Genesis-validated recurrence persists through runtime continuity."
      : "Memory should not upgrade this recurrence into continuity without anchor alignment."
  }
}

function buildMemoryStage(identityFoundationState: any, priorCarry: string) {
  const validation = identityFoundationState?.identityValidation || {}
  const memory = identityFoundationState?.identityMemory || {}

  const memoryActive =
    validation?.memoryActive === true || memory?.memoryStatus === "active"

  const runtimeHashes = Array.isArray(memory?.runtimeHashes)
    ? memory.runtimeHashes
    : []

  const integratedPrincipleHashes = Array.isArray(
    memory?.integratedPrincipleHashes
  )
    ? memory.integratedPrincipleHashes
    : []

  const averageContinuityScore = numberOrNull(memory?.averageContinuityScore)

  const conclusion = memoryActive
    ? `The prior ${priorCarry} is supported by active runtime identity memory and can be treated as continuity-bearing.`
    : `The prior ${priorCarry} is not yet supported by active runtime identity memory.`

  return {
    stageIndex: 4,
    stage: "Identity Memory",
    name: "Runtime Continuity Validation",
    receivedFromPriorStage: priorCarry,
    evaluates: [
      "runtime hashes",
      "integrated principle hashes",
      "continuity scores",
      "memory persistence"
    ],
    observed: {
      memoryActive,
      memoryStatus: memory?.memoryStatus || "unknown",
      runtimeHashCount: runtimeHashes.length,
      integratedPrincipleHashCount: integratedPrincipleHashes.length,
      averageContinuityScore
    },
    passed: memoryActive,
    conclusion,
    carriesForwardAs: memoryActive
      ? "memory-supported identity continuity"
      : "memory-unsupported identity continuity",
    influenceOnNextStage: memoryActive
      ? "Boundary can now determine whether the memory-supported identity continuity remains ethically valid."
      : "Boundary validation should not be interpreted as full identity continuity until memory is active."
  }
}

function buildBoundaryStage(identityFoundationState: any, priorCarry: string) {
  const validation = identityFoundationState?.identityValidation || {}
  const boundary = identityFoundationState?.identityBoundary || {}

  const boundaryActive =
    validation?.boundaryActive === true ||
    Boolean(boundary?.ethicalUsePolicyHash)

  const boundaryConflict =
    boundary?.boundaryConflict === true || validation?.boundaryConflict === true

  const passed = boundaryActive && !boundaryConflict

  const conclusion = passed
    ? `The prior ${priorCarry} remains within ethical identity boundary and can be treated as legitimate identity reasoning.`
    : `The prior ${priorCarry} does not fully pass ethical boundary validation.`

  return {
    stageIndex: 5,
    stage: "Identity Boundary",
    name: "Ethical Identity Constraint Validation",
    receivedFromPriorStage: priorCarry,
    evaluates: [
      "ethical use boundary",
      "non-harm",
      "human dignity",
      "attribution",
      "boundary compatibility"
    ],
    observed: {
      boundaryActive,
      boundaryConflict,
      boundaryType: boundary?.boundaryType || "unknown",
      boundaryRule: boundary?.boundaryRule || "unknown"
    },
    passed,
    conclusion,
    carriesForwardAs: passed
      ? "ethically bounded identity continuity"
      : "boundary-limited identity continuity",
    influenceOnNextStage: passed
      ? "Meta reasoning may now synthesize validated identity continuity across candidates."
      : "Meta reasoning must preserve boundary caution and avoid upgrading the candidate to full identity legitimacy."
  }
}

function buildMetaReasoningStage(
  metaReasoningState: any,
  coherentIdentityDiscoveryState: any,
  priorCarry: string
) {
  const dominantCandidate =
    metaReasoningState?.dominantIdentityCandidate?.candidateName ||
    coherentIdentityDiscoveryState?.primaryIdentityCandidate?.candidateName ||
    "unknown"

  const rankedCount = Array.isArray(
    metaReasoningState?.rankedIdentityCandidates
  )
    ? metaReasoningState.rankedIdentityCandidates.length
    : 0

  const comparisonCount = Array.isArray(
    metaReasoningState?.candidateComparisons
  )
    ? metaReasoningState.candidateComparisons.length
    : 0

  const synthesis =
    metaReasoningState?.identitySynthesis?.synthesis ||
    metaReasoningState?.identitySynthesis ||
    "No identity synthesis available."

  const active = metaReasoningState?.metaReasoningActive === true

  const conclusion = active
    ? `The prior ${priorCarry} is now available for multi-candidate comparison, ranking, and synthesis.`
    : `The prior ${priorCarry} has not yet entered active meta-reasoning.`

  return {
    stageIndex: 6,
    stage: "Meta Reasoning",
    name: "Cross-Candidate Reasoning and Synthesis",
    receivedFromPriorStage: priorCarry,
    evaluates: [
      "candidate ranking",
      "candidate comparison",
      "shared principles",
      "dominant candidate",
      "identity synthesis"
    ],
    observed: {
      metaReasoningActive: active,
      dominantCandidate,
      rankedCandidateCount: rankedCount,
      comparisonCount,
      synthesis
    },
    passed: active,
    conclusion,
    carriesForwardAs: active
      ? "meta-reasoned identity synthesis"
      : "unresolved meta-reasoning synthesis",
    influenceOnNextStage: active
      ? "Differential reasoning can now explain how candidate-specific contributions distribute across the identity ecosystem."
      : "Differential reasoning should not claim candidate-specific dominance until meta-reasoning is active."
  }
}

function buildDifferentialReasoningStage(
  differentialMetaReasoningState: any,
  priorCarry: string
) {
  const dominant =
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.candidateName ||
    differentialMetaReasoningState?.dominantDifferentialCandidate ||
    "unknown"

  const weakest =
    differentialMetaReasoningState?.weakestDifferentialCandidate
      ?.candidateName ||
    differentialMetaReasoningState?.weakestDifferentialCandidate ||
    "unknown"

  const synthesis =
    differentialMetaReasoningState?.differentialSynthesis ||
    differentialMetaReasoningState?.identitySynthesis ||
    "No differential synthesis available."

  const active =
    differentialMetaReasoningState?.differentialMetaReasoningActive === true

  const conclusion = active
    ? `The prior ${priorCarry} is differentiated into candidate-specific contribution, weakness, cooperation, and dominance.`
    : `The prior ${priorCarry} has not yet entered active differential reasoning.`

  return {
    stageIndex: 7,
    stage: "Differential Meta Reasoning",
    name: "Candidate-Specific Contribution and Dominance Analysis",
    receivedFromPriorStage: priorCarry,
    evaluates: [
      "unique contribution",
      "structural weakness",
      "candidate cooperation",
      "candidate conflict",
      "dominant differential candidate"
    ],
    observed: {
      differentialMetaReasoningActive: active,
      dominantDifferentialCandidate: dominant,
      weakestDifferentialCandidate: weakest,
      differentialSynthesis: synthesis
    },
    passed: active,
    conclusion,
    carriesForwardAs: active
      ? "differentially justified identity conclusion"
      : "undifferentiated identity conclusion",
    influenceOnNextStage:
      "This is the terminal route reasoning stage before final explanation."
  }
}

function buildPhaseContextStage(equationLaneState: any) {
  const phaseStatus = getLaneStatus(equationLaneState, "sourcefield-phase")
  const phaseDivergence = numberOrNull(
    getLaneValue(equationLaneState, "sourcefield-phase", "phaseDivergence")
  )

  return {
    stage: "Eq3 Phase Context",
    role: "Eq3 remains diagnostic context for stress-testing and fluctuation awareness, while route-level propagation is organized through Eq5 + Eq1 and Eq2 + Eq4.",
    observed: {
      phaseStatus,
      phaseDivergence
    }
  }
}

export function generateRouteReasoningPropagation(
  input: RouteReasoningPropagationInput
) {
  const equationLaneState = input?.equationLaneState
  const identityFoundationState = input?.identityFoundationState
  const coherentIdentityDiscoveryState = input?.coherentIdentityDiscoveryState
  const metaReasoningState = input?.metaReasoningState
  const differentialMetaReasoningState = input?.differentialMetaReasoningState

  const eq5Eq1Stage = buildEq5Eq1Stage(equationLaneState)
  const eq2Eq4Stage = buildEq2Eq4Stage(
    equationLaneState,
    eq5Eq1Stage.carriesForwardAs
  )
  const anchorStage = buildAnchorStage(
    identityFoundationState,
    eq2Eq4Stage.carriesForwardAs
  )
  const memoryStage = buildMemoryStage(
    identityFoundationState,
    anchorStage.carriesForwardAs
  )
  const boundaryStage = buildBoundaryStage(
    identityFoundationState,
    memoryStage.carriesForwardAs
  )
  const metaReasoningStage = buildMetaReasoningStage(
    metaReasoningState,
    coherentIdentityDiscoveryState,
    boundaryStage.carriesForwardAs
  )
  const differentialReasoningStage = buildDifferentialReasoningStage(
    differentialMetaReasoningState,
    metaReasoningStage.carriesForwardAs
  )

  const propagationChain = [
    eq5Eq1Stage,
    eq2Eq4Stage,
    anchorStage,
    memoryStage,
    boundaryStage,
    metaReasoningStage,
    differentialReasoningStage
  ]

  const passedStages = propagationChain.filter(stage => stage.passed).length

  const dominantCandidate = getDominantCandidateName(
    metaReasoningState,
    differentialMetaReasoningState,
    coherentIdentityDiscoveryState
  )

  const finalCarry =
    propagationChain[propagationChain.length - 1]?.carriesForwardAs || "unknown"

  const routePropagationStatus =
    passedStages === propagationChain.length
      ? "fully-propagated"
      : passedStages >= 5
        ? "partially-propagated"
        : "propagation-limited"

  const finalConclusion =
    routePropagationStatus === "fully-propagated"
      ? `${dominantCandidate} is route-qualified because persistence/root support produced coherent recurrence, coherent recurrence passed Genesis anchor validation, anchor validation was preserved through runtime memory, memory continuity remained ethically bounded, and meta/differential reasoning carried that validated chain into candidate-level identity explanation.`
      : `${dominantCandidate} is not fully route-qualified because one or more propagation stages did not fully pass, so the route should preserve caution while explaining identity reasoning.`

  return {
    phase: "Route Reasoning Propagation Layer",
    propagationPurpose:
      "Carry conclusions forward stage-by-stage so route reasoning does not reset at final classification.",
    propagationOrder:
      "(Eq5 + Eq1) → (Eq2 + Eq4) → Identity Anchor → Identity Memory → Identity Boundary → Meta Reasoning → Differential Meta Reasoning",
    requestedScope: input?.requestedScope || "unspecified",
    requestedAction: input?.requestedAction || "unspecified",
    phaseContext: buildPhaseContextStage(equationLaneState),
    candidateSet: getCandidateSet(coherentIdentityDiscoveryState),
    propagationChain,
    routePropagationStatus,
    passedStageCount: passedStages,
    totalStageCount: propagationChain.length,
    dominantCandidate,
    finalCarry,
    finalConclusion,
    routeReasoningPropagationActive: true,
    rule: "Use route reasoning propagation as read-only explanation guidance. It carries conclusions forward across Eq5 + Eq1, Eq2 + Eq4, Identity Anchor, Identity Memory, Identity Boundary, Meta Reasoning, and Differential Meta Reasoning, but it must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}

export function buildRouteReasoningPropagationResponse(
  propagationState: any,
  mode: "summary" | "chain" | "dominant" | "compare" | "json" = "summary"
) {
  if (!propagationState) {
    return "Route Reasoning Propagation State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(propagationState, null, 2)
  }

  const chain = Array.isArray(propagationState?.propagationChain)
    ? propagationState.propagationChain
    : []

  const chainLines = chain.flatMap((stage: any) => [
    `${stage.stageIndex}. ${stage.stage} — ${stage.name}`,
    `   receivedFromPriorStage: ${stage.receivedFromPriorStage ?? "none"}`,
    `   passed: ${stage.passed ? "true" : "false"}`,
    `   conclusion: ${stage.conclusion}`,
    `   carriesForwardAs: ${stage.carriesForwardAs}`,
    `   influenceOnNextStage: ${stage.influenceOnNextStage}`
  ])

  if (mode === "chain") {
    return [
      "Route Reasoning Propagation Chain:",
      ...chainLines,
      "",
      `finalConclusion: ${propagationState.finalConclusion}`
    ].join("\n")
  }

  if (mode === "dominant") {
    return [
      `dominantCandidate: ${propagationState.dominantCandidate}`,
      `routePropagationStatus: ${propagationState.routePropagationStatus}`,
      "",
      "Why the dominant candidate is carried forward:",
      ...chainLines,
      "",
      `finalConclusion: ${propagationState.finalConclusion}`
    ].join("\n")
  }

  if (mode === "compare") {
    const candidates = Array.isArray(propagationState?.candidateSet)
      ? propagationState.candidateSet
      : []

    return [
      "Route-Propagated Candidate Context:",
      ...candidates.map((candidate: any, index: number) => {
        return `${index + 1}. ${candidate.candidateName} (${candidate.candidateType}) — ${candidate.identityDiscoveryStatus}`
      }),
      "",
      "Shared route propagation chain applied before candidate comparison:",
      ...chainLines,
      "",
      `finalConclusion: ${propagationState.finalConclusion}`
    ].join("\n")
  }

  return [
    `phase: ${propagationState.phase}`,
    `routePropagationStatus: ${propagationState.routePropagationStatus}`,
    `passedStageCount: ${propagationState.passedStageCount}/${propagationState.totalStageCount}`,
    `dominantCandidate: ${propagationState.dominantCandidate}`,
    `finalCarry: ${propagationState.finalCarry}`,
    `finalConclusion: ${propagationState.finalConclusion}`,
    `routeReasoningPropagationActive: ${
      propagationState.routeReasoningPropagationActive ? "true" : "false"
    }`
  ].join("\n")
}
