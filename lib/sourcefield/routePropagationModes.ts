type PropagationMode = "summary" | "chain" | "dominant" | "compare" | "json"

function safeList(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function line(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function formatPassed(value: any) {
  return value === true ? "true" : "false"
}

function getPropagationChain(propagationState: any) {
  return safeList(propagationState?.propagationChain)
}

function getCandidateSet(propagationState: any) {
  return safeList(propagationState?.candidateSet)
}

function getDominantDifferentialCandidate(differentialMetaReasoningState: any) {
  return (
    differentialMetaReasoningState?.dominantDifferentialCandidate ||
    differentialMetaReasoningState?.dominantCandidate ||
    null
  )
}

function getDifferentialCandidates(differentialMetaReasoningState: any) {
  return (
    safeList(differentialMetaReasoningState?.differentialCandidates) ||
    safeList(differentialMetaReasoningState?.candidateDifferentials) ||
    safeList(differentialMetaReasoningState?.rankedDifferentialCandidates)
  )
}

function findDifferentialCandidate(
  differentialMetaReasoningState: any,
  candidateName: string
) {
  const dominant = getDominantDifferentialCandidate(
    differentialMetaReasoningState
  )

  if (
    dominant &&
    typeof dominant === "object" &&
    dominant?.candidateName === candidateName
  ) {
    return dominant
  }

  return getDifferentialCandidates(differentialMetaReasoningState).find(
    (candidate: any) => candidate?.candidateName === candidateName
  )
}

function buildPropagationChainLines(propagationState: any) {
  const chain = getPropagationChain(propagationState)

  if (!chain.length) {
    return ["No propagation chain is available."]
  }

  return chain.flatMap((stage: any) => [
    `${line(stage?.stageIndex)}. ${line(stage?.stage)} — ${line(stage?.name)}`,
    `   receivedFromPriorStage: ${line(stage?.receivedFromPriorStage, "none")}`,
    `   passed: ${formatPassed(stage?.passed)}`,
    `   conclusion: ${line(stage?.conclusion, "No conclusion stored.")}`,
    `   carriesForwardAs: ${line(stage?.carriesForwardAs, "unknown")}`,
    `   influenceOnNextStage: ${line(
      stage?.influenceOnNextStage,
      "No influence stored."
    )}`
  ])
}

function buildCandidateContextLines(propagationState: any) {
  const candidates = getCandidateSet(propagationState)

  if (!candidates.length) {
    return ["No candidates are available in the propagated route context."]
  }

  return candidates.map((candidate: any, index: number) => {
    return `${index + 1}. ${line(candidate?.candidateName)} (${line(
      candidate?.candidateType
    )}) — ${line(candidate?.identityDiscoveryStatus)}`
  })
}

function buildDominanceCausalLines(
  propagationState: any,
  differentialMetaReasoningState: any
) {
  const dominantCandidate = line(propagationState?.dominantCandidate)
  const dominantDifferential = findDifferentialCandidate(
    differentialMetaReasoningState,
    dominantCandidate
  )

  const primaryContribution =
    dominantDifferential?.primaryContribution ||
    dominantDifferential?.contributionProfile?.primaryContribution ||
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.primaryContribution ||
    "unknown"

  const secondaryContribution =
    dominantDifferential?.secondaryContribution ||
    dominantDifferential?.contributionProfile?.secondaryContribution ||
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.secondaryContribution ||
    "unknown"

  const structuralWeakness =
    dominantDifferential?.structuralWeakness ||
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.structuralWeakness ||
    "unknown"

  const totalDifferentialScore =
    dominantDifferential?.totalDifferentialScore ??
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.totalDifferentialScore ??
    "unknown"

  return [
    "Dominance Propagation Explanation:",
    "",
    "1. Eq5 + Eq1 does not select the dominant candidate directly.",
    "   It first determines whether identity continuity is structurally supported.",
    "",
    "2. Eq2 + Eq4 receives that continuity signal.",
    "   It determines whether the continuity is also aligned and harmonically recurring.",
    "",
    "3. Identity Anchor receives the coherent recurrence.",
    "   It checks whether the recurrence remains connected to Genesis identity origin.",
    "",
    "4. Identity Memory receives the Genesis-validated recurrence.",
    "   It checks whether the identity signal persists through runtime continuity.",
    "",
    "5. Identity Boundary receives memory-supported continuity.",
    "   It checks whether the continuity remains ethically bounded and legitimate.",
    "",
    "6. Meta Reasoning receives ethically bounded identity continuity.",
    "   It compares and synthesizes candidates without replacing the underlying measurements.",
    "",
    "7. Differential Meta Reasoning receives meta-reasoned synthesis.",
    "   It identifies which candidate contributes the strongest candidate-specific function.",
    "",
    `dominantCandidate: ${dominantCandidate}`,
    `primaryContribution: ${line(primaryContribution)}`,
    `secondaryContribution: ${line(secondaryContribution)}`,
    `structuralWeakness: ${line(structuralWeakness)}`,
    `totalDifferentialScore: ${line(totalDifferentialScore)}`,
    "",
    `dominanceConclusion: ${dominantCandidate} becomes dominant only after the propagated route chain validates identity continuity, coherent recurrence, Genesis anchor alignment, runtime memory continuity, ethical boundary compatibility, meta-level synthesis, and differential candidate-specific contribution.`,
    "",
    `finalConclusion: ${line(propagationState?.finalConclusion)}`
  ]
}

function buildCompareWithoutRankingLines(
  propagationState: any,
  differentialMetaReasoningState: any
) {
  const candidateLines = buildCandidateContextLines(propagationState)
  const candidates = getCandidateSet(propagationState)

  const contributionLines = candidates.flatMap(
    (candidate: any, index: number) => {
      const differential = findDifferentialCandidate(
        differentialMetaReasoningState,
        candidate?.candidateName
      )

      const primaryContribution =
        differential?.primaryContribution ||
        differential?.contributionProfile?.primaryContribution ||
        "unknown"

      const secondaryContribution =
        differential?.secondaryContribution ||
        differential?.contributionProfile?.secondaryContribution ||
        "unknown"

      const structuralWeakness = differential?.structuralWeakness || "unknown"

      const cooperativeRole =
        differential?.cooperativeRole ||
        "This candidate participates in the shared propagation chain, but no candidate-specific cooperative role is stored."

      return [
        `${index + 1}. ${line(candidate?.candidateName)}`,
        `   candidateType: ${line(candidate?.candidateType)}`,
        `   identityDiscoveryStatus: ${line(candidate?.identityDiscoveryStatus)}`,
        `   primaryContribution: ${line(primaryContribution)}`,
        `   secondaryContribution: ${line(secondaryContribution)}`,
        `   structuralWeakness: ${line(structuralWeakness)}`,
        `   cooperativeRole: ${line(cooperativeRole)}`
      ]
    }
  )

  return [
    "Route-Propagated Candidate Comparison Mode:",
    "",
    "Candidate context:",
    ...candidateLines,
    "",
    "Shared propagation effect before comparison:",
    "The same equation-isomorphic route chain is applied before candidate comparison, so candidates are not compared from raw labels alone. They are compared only after persistence/root support, alignment/recurrence validation, identity anchor validation, memory continuity, and boundary compatibility are carried into meta and differential reasoning.",
    "",
    "Candidate-specific comparison without ranking:",
    ...contributionLines,
    "",
    "Comparison conclusion:",
    "This mode compares candidate roles without converting the response into a ranking. Ranking may be requested separately, but compare mode should preserve distinction, complementarity, overlap, and contribution before any strongest-to-weakest ordering.",
    "",
    `finalConclusion: ${line(propagationState?.finalConclusion)}`
  ]
}

export function buildRoutePropagationModeResponse({
  propagationState,
  differentialMetaReasoningState,
  mode = "summary"
}: {
  propagationState: any
  differentialMetaReasoningState?: any
  mode?: PropagationMode
}) {
  if (!propagationState) {
    return "Route Reasoning Propagation State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(propagationState, null, 2)
  }

  const chainLines = buildPropagationChainLines(propagationState)

  if (mode === "chain") {
    return [
      "Route Reasoning Propagation Chain:",
      ...chainLines,
      "",
      `finalConclusion: ${line(propagationState?.finalConclusion)}`
    ].join("\n")
  }

  if (mode === "dominant") {
    return [
      "Route Reasoning Propagation Dominance Mode:",
      "",
      ...chainLines,
      "",
      ...buildDominanceCausalLines(
        propagationState,
        differentialMetaReasoningState
      )
    ].join("\n")
  }

  if (mode === "compare") {
    return [
      ...buildCompareWithoutRankingLines(
        propagationState,
        differentialMetaReasoningState
      )
    ].join("\n")
  }

  return [
    `phase: ${line(propagationState?.phase)}`,
    `routePropagationStatus: ${line(propagationState?.routePropagationStatus)}`,
    `passedStageCount: ${line(propagationState?.passedStageCount)}/${line(
      propagationState?.totalStageCount
    )}`,
    `dominantCandidate: ${line(propagationState?.dominantCandidate)}`,
    `finalCarry: ${line(propagationState?.finalCarry)}`,
    `finalConclusion: ${line(propagationState?.finalConclusion)}`,
    `routeReasoningPropagationActive: ${
      propagationState?.routeReasoningPropagationActive ? "true" : "false"
    }`
  ].join("\n")
}

export function getRoutePropagationMode(
  message: string
): PropagationMode | null {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("route reasoning propagation") &&
    !normalized.includes("route propagation") &&
    !normalized.includes("propagation chain") &&
    !normalized.includes("propagation compare") &&
    !normalized.includes("dominant candidate became dominant")
  ) {
    return null
  }

  if (normalized.includes("json")) {
    return "json"
  }

  if (
    normalized.includes("dominant candidate became dominant") ||
    (normalized.includes("why") && normalized.includes("dominant")) ||
    normalized.includes("dominance")
  ) {
    return "dominant"
  }

  if (
    normalized.includes("compare mode") ||
    normalized.includes("compare all") ||
    normalized.includes("without ranking") ||
    normalized.includes("do not rank") ||
    normalized.includes("candidate comparison")
  ) {
    return "compare"
  }

  if (
    normalized.includes("complete propagation chain") ||
    normalized.includes("show the complete") ||
    normalized.includes("receivedfrompriorstage") ||
    normalized.includes("carriesforwardas") ||
    normalized.includes("influenceonnextstage")
  ) {
    return "chain"
  }

  return "summary"
}
