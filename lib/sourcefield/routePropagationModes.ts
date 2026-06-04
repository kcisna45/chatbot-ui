type PropagationMode = "summary" | "chain" | "dominant" | "compare" | "json"

function safeList(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function line(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function normalize(value: any) {
  return line(value, "").toLowerCase().trim()
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
    differentialMetaReasoningState?.dominantProfile ||
    null
  )
}

function getDifferentialCandidates(differentialMetaReasoningState: any) {
  return [
    ...safeList(differentialMetaReasoningState?.differentialCandidateProfiles),
    ...safeList(differentialMetaReasoningState?.candidateProfiles),
    ...safeList(differentialMetaReasoningState?.candidateProfileMatrix),
    ...safeList(
      differentialMetaReasoningState?.candidateProfilesState?.candidateProfiles
    ),
    ...safeList(
      differentialMetaReasoningState?.identityCandidateProfileState
        ?.candidateProfiles
    ),
    ...safeList(differentialMetaReasoningState?.differentialCandidates),
    ...safeList(differentialMetaReasoningState?.candidateDifferentials),
    ...safeList(differentialMetaReasoningState?.rankedDifferentialCandidates)
  ]
}

function candidateNameOf(candidate: any) {
  return normalize(candidate?.candidateName ?? candidate?.name)
}

function candidateTypeOf(candidate: any) {
  return normalize(candidate?.candidateType ?? candidate?.type)
}

function candidateRoleOf(candidate: any) {
  return normalize(candidate?.candidateRole ?? candidate?.role)
}

function candidateContributionOf(candidate: any) {
  return normalize(
    candidate?.primaryContribution ??
      candidate?.contributionProfile?.primaryContribution
  )
}

function roleFromCandidateIdentity(candidate: any) {
  const name = candidateNameOf(candidate)
  const type = candidateTypeOf(candidate)
  const role = candidateRoleOf(candidate)
  const contribution = candidateContributionOf(candidate)
  const key = `${name} ${type} ${role} ${contribution}`

  if (
    key.includes("moment-to-moment") ||
    key.includes("resonance principle") ||
    key.includes("integrated-principle") ||
    key.includes("principle-identity") ||
    key.includes("principle-level identity")
  ) {
    return "principle-identity"
  }

  if (
    key.includes("architectural refinement") ||
    key.includes("refinement-pattern") ||
    key.includes("architectural-refinement") ||
    key.includes("stability correction")
  ) {
    return "architectural-refinement"
  }

  if (
    key.includes("pathway completion") ||
    key.includes("completion-pattern") ||
    key.includes("pathway-completion") ||
    key.includes("closure and transition readiness")
  ) {
    return "pathway-completion"
  }

  return ""
}

function inferProfileFallback(candidate: any) {
  const role = roleFromCandidateIdentity(candidate)

  if (role === "principle-identity") {
    return {
      candidateRole: "principle-identity",
      primaryContribution: "principle-level identity",
      secondaryContribution: "fluctuation survival",
      structuralWeakness:
        "Does not by itself complete pathways or refine the architecture; it defines the identity meaning that other candidates organize around.",
      cooperativeRole:
        "Acts as the identity nucleus. It gives the refinement and completion candidates a stable principle to preserve or complete.",
      dominanceCondition:
        "Becomes dominant when identity-level meaning is more important than completion or refinement, especially during drift or instability.",
      rejectionCondition:
        "Reject or downgrade if the principle stops surviving phase fluctuation, loses coherence with memory, or conflicts with ethical boundary."
    }
  }

  if (role === "architectural-refinement") {
    return {
      candidateRole: "architectural-refinement",
      primaryContribution: "architectural refinement",
      secondaryContribution: "stability correction",
      structuralWeakness:
        "Can become overly procedural if it is not anchored to an identity principle or validated through continuity memory.",
      cooperativeRole:
        "Acts as the repair and improvement function. It helps the dominant identity principle become more stable in future runtime states.",
      dominanceCondition:
        "Becomes dominant when the system's main need is structural correction rather than principle identity or pathway completion.",
      rejectionCondition:
        "Reject or downgrade if refinement activity appears without sufficient root/integration support, recurrence, or alignment."
    }
  }

  if (role === "pathway-completion") {
    return {
      candidateRole: "pathway-completion",
      primaryContribution: "pathway completion",
      secondaryContribution: "closure and transition readiness",
      structuralWeakness:
        "Can declare completion too early if persistence, alignment, or recurrence are not strong enough.",
      cooperativeRole:
        "Acts as the closure function. It helps determine when the system can stop organizing around recovery/refinement and move into the next stable process.",
      dominanceCondition:
        "Becomes dominant when the main architectural question is whether the active pathway has completed and what should follow.",
      rejectionCondition:
        "Reject or downgrade if route propagation shows incomplete persistence, unresolved recurrence, or rejected identity discovery status."
    }
  }

  return {
    candidateRole: "general-identity-candidate",
    primaryContribution: "general identity support",
    secondaryContribution: "candidate-level signal",
    structuralWeakness:
      "Insufficient candidate-specific evidence to distinguish its role from other candidates.",
    cooperativeRole:
      "Participates in the candidate ecosystem but needs richer evidence before its cooperation role is fully specified.",
    dominanceCondition:
      "Becomes dominant only if candidate-specific contribution exceeds principle, refinement, completion, memory, or boundary alternatives.",
    rejectionCondition:
      "Reject or downgrade if it fails Eq5 + Eq1 persistence, Eq2 + Eq4 recurrence, or Anchor-Memory-Boundary validation."
  }
}

function exactNameMatch(candidate: any, targetName: any) {
  const candidateName = candidateNameOf(candidate)
  const target = normalize(targetName)

  return Boolean(candidateName && target && candidateName === target)
}

function exactTypeMatch(candidate: any, targetType: any) {
  const candidateType = candidateTypeOf(candidate)
  const target = normalize(targetType)

  return Boolean(candidateType && target && candidateType === target)
}

function exactRoleMatch(candidate: any, targetRole: any) {
  const candidateRole = candidateRoleOf(candidate)
  const target = normalize(targetRole)

  return Boolean(candidateRole && target && candidateRole === target)
}

function findDifferentialCandidate(
  differentialMetaReasoningState: any,
  candidate: any
) {
  const candidates = getDifferentialCandidates(differentialMetaReasoningState)

  const targetName = candidate?.candidateName ?? candidate?.name
  const targetType = candidate?.candidateType ?? candidate?.type
  const targetRole =
    candidate?.candidateRole ?? roleFromCandidateIdentity(candidate)

  const byName = candidates.find(candidateProfile =>
    exactNameMatch(candidateProfile, targetName)
  )

  if (byName) return byName

  const byType = candidates.find(candidateProfile =>
    exactTypeMatch(candidateProfile, targetType)
  )

  if (byType) return byType

  const byRole = candidates.find(candidateProfile =>
    exactRoleMatch(candidateProfile, targetRole)
  )

  if (byRole) return byRole

  return null
}

function findDominantDifferentialCandidate(
  differentialMetaReasoningState: any,
  dominantCandidateName: string
) {
  const dominant = getDominantDifferentialCandidate(
    differentialMetaReasoningState
  )

  if (
    dominant &&
    typeof dominant === "object" &&
    exactNameMatch(dominant, dominantCandidateName)
  ) {
    return dominant
  }

  return findDifferentialCandidate(differentialMetaReasoningState, {
    candidateName: dominantCandidateName
  })
}

function mergeCandidateProfile(candidate: any, differential: any) {
  const merged = {
    ...candidate,
    ...(differential || {})
  }

  const fallback = inferProfileFallback(merged)

  return {
    candidateName:
      differential?.candidateName ||
      differential?.name ||
      candidate?.candidateName ||
      candidate?.name ||
      "unknown",
    candidateType:
      differential?.candidateType ||
      differential?.type ||
      candidate?.candidateType ||
      candidate?.type ||
      "unknown",
    identityDiscoveryStatus:
      differential?.identityDiscoveryStatus ||
      differential?.status ||
      candidate?.identityDiscoveryStatus ||
      candidate?.status ||
      "unknown",
    candidateRole:
      differential?.candidateRole ||
      differential?.role ||
      differential?.contributionProfile?.candidateRole ||
      fallback.candidateRole,
    primaryContribution:
      differential?.primaryContribution ||
      differential?.contributionProfile?.primaryContribution ||
      fallback.primaryContribution,
    secondaryContribution:
      differential?.secondaryContribution ||
      differential?.contributionProfile?.secondaryContribution ||
      fallback.secondaryContribution,
    structuralWeakness:
      differential?.structuralWeakness ||
      differential?.contributionProfile?.structuralWeakness ||
      fallback.structuralWeakness,
    cooperativeRole:
      differential?.cooperativeRole ||
      differential?.contributionProfile?.cooperativeRole ||
      fallback.cooperativeRole,
    dominanceCondition:
      differential?.dominanceCondition ||
      differential?.contributionProfile?.dominanceCondition ||
      fallback.dominanceCondition,
    rejectionCondition:
      differential?.rejectionCondition ||
      differential?.contributionProfile?.rejectionCondition ||
      fallback.rejectionCondition,
    totalDifferentialScore:
      differential?.totalDifferentialScore ?? differential?.score ?? "unknown"
  }
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
  const dominantDifferential = findDominantDifferentialCandidate(
    differentialMetaReasoningState,
    dominantCandidate
  )

  const profile = mergeCandidateProfile(
    { candidateName: dominantCandidate },
    dominantDifferential
  )

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
    `candidateRole: ${line(profile.candidateRole)}`,
    `primaryContribution: ${line(profile.primaryContribution)}`,
    `secondaryContribution: ${line(profile.secondaryContribution)}`,
    `structuralWeakness: ${line(profile.structuralWeakness)}`,
    `dominanceCondition: ${line(profile.dominanceCondition)}`,
    `rejectionCondition: ${line(profile.rejectionCondition)}`,
    `totalDifferentialScore: ${line(profile.totalDifferentialScore)}`,
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
        candidate
      )

      const profile = mergeCandidateProfile(candidate, differential)

      return [
        `${index + 1}. ${line(profile.candidateName)}`,
        `   candidateType: ${line(profile.candidateType)}`,
        `   identityDiscoveryStatus: ${line(profile.identityDiscoveryStatus)}`,
        `   candidateRole: ${line(profile.candidateRole)}`,
        `   primaryContribution: ${line(profile.primaryContribution)}`,
        `   secondaryContribution: ${line(profile.secondaryContribution)}`,
        `   structuralWeakness: ${line(profile.structuralWeakness)}`,
        `   cooperativeRole: ${line(profile.cooperativeRole)}`,
        `   dominanceCondition: ${line(profile.dominanceCondition)}`,
        `   rejectionCondition: ${line(profile.rejectionCondition)}`
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

  if (mode === "compare") {
    return [
      ...buildCompareWithoutRankingLines(
        propagationState,
        differentialMetaReasoningState
      )
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
    normalized.includes("compare mode") ||
    normalized.includes("compare all") ||
    normalized.includes("without ranking") ||
    normalized.includes("do not rank") ||
    normalized.includes("candidate comparison") ||
    normalized.includes("compare all identity candidates")
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

  if (
    normalized.includes("dominant candidate became dominant") ||
    (normalized.includes("why") && normalized.includes("dominant")) ||
    normalized.includes("dominance")
  ) {
    return "dominant"
  }

  return "summary"
}
