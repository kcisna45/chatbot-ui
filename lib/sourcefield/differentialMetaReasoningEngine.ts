type DifferentialMetaReasoningInput = {
  metaReasoningState?: any
  coherentIdentityDiscoveryState?: any
  principleIntegrationState?: any
  identityFoundationState?: any
  equationLaneState?: any
}

type CandidateProfile = {
  candidateId: string
  candidateName: string
  candidateType: string
  sourceLayer: string
  candidatePattern: string
  engineStatus: string
  metaReasoningStatus: string
  inheritedScore: any
  differentialScore: {
    fluctuationContribution: number
    persistenceContribution: number
    completionContribution: number
    refinementContribution: number
    principleContribution: number
    synthesisContribution: number
    weaknessLoad: number
    total: number
  }
  primaryContribution: string
  secondaryContribution: string
  structuralWeakness: string
  cooperativeRole: string
  dominanceReason: string
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function lower(value: any) {
  return String(value || "").toLowerCase()
}

function includesAny(value: string, terms: string[]) {
  return terms.some(term => value.includes(term))
}

function getRankedCandidates(metaReasoningState: any) {
  const ranked = Array.isArray(metaReasoningState?.rankedIdentityCandidates)
    ? metaReasoningState.rankedIdentityCandidates
    : []

  if (ranked.length > 0) return ranked

  return Array.isArray(metaReasoningState?.evaluatedCandidates)
    ? metaReasoningState.evaluatedCandidates
    : []
}

function getCandidateText(candidate: any) {
  return lower(
    [
      candidate?.candidateName,
      candidate?.candidateType,
      candidate?.sourceLayer,
      candidate?.candidatePattern,
      candidate?.sourceEvidence
    ].join(" ")
  )
}

function deriveCandidateDifferentialScore(candidate: any) {
  const text = getCandidateText(candidate)
  const inheritedTotal =
    typeof candidate?.score?.total === "number" ? candidate.score.total : 0.5

  const fluctuationContribution = clamp01(
    0.2 +
      (includesAny(text, ["drift", "fluctuation", "moment", "phase"])
        ? 0.45
        : 0) +
      (includesAny(text, ["survive", "invalidate", "trajectory"]) ? 0.25 : 0) +
      inheritedTotal * 0.1
  )

  const persistenceContribution = clamp01(
    0.2 +
      (includesAny(text, [
        "complete",
        "completion",
        "stabilized",
        "stop requiring"
      ])
        ? 0.35
        : 0) +
      (includesAny(text, [
        "integration",
        "persistent",
        "dominant",
        "trajectory"
      ])
        ? 0.25
        : 0) +
      inheritedTotal * 0.1
  )

  const completionContribution = clamp01(
    0.15 +
      (includesAny(text, [
        "completion",
        "complete",
        "pathway",
        "selected purpose"
      ])
        ? 0.55
        : 0) +
      (includesAny(text, ["dominant organizing process", "stop requiring"])
        ? 0.2
        : 0) +
      inheritedTotal * 0.1
  )

  const refinementContribution = clamp01(
    0.15 +
      (includesAny(text, ["refine", "refinement", "stable", "preserving"])
        ? 0.55
        : 0) +
      (includesAny(text, [
        "root",
        "harmonic",
        "alignment support",
        "integration support"
      ])
        ? 0.2
        : 0) +
      inheritedTotal * 0.1
  )

  const principleContribution = clamp01(
    0.15 +
      (includesAny(text, [
        "principle",
        "resonance",
        "trajectory",
        "coherent structure"
      ])
        ? 0.55
        : 0) +
      (candidate?.candidateType === "integrated-principle" ? 0.2 : 0) +
      inheritedTotal * 0.1
  )

  const synthesisContribution = clamp01(
    (fluctuationContribution +
      persistenceContribution +
      completionContribution +
      refinementContribution +
      principleContribution) /
      5
  )

  const contributionSpread =
    Math.max(
      fluctuationContribution,
      persistenceContribution,
      completionContribution,
      refinementContribution,
      principleContribution
    ) -
    Math.min(
      fluctuationContribution,
      persistenceContribution,
      completionContribution,
      refinementContribution,
      principleContribution
    )

  const weaknessLoad = clamp01(
    1 - synthesisContribution + contributionSpread * 0.25
  )

  const total = clamp01(
    fluctuationContribution * 0.18 +
      persistenceContribution * 0.16 +
      completionContribution * 0.14 +
      refinementContribution * 0.14 +
      principleContribution * 0.2 +
      synthesisContribution * 0.18 -
      weaknessLoad * 0.08
  )

  return {
    fluctuationContribution,
    persistenceContribution,
    completionContribution,
    refinementContribution,
    principleContribution,
    synthesisContribution,
    weaknessLoad,
    total
  }
}

function strongestDimension(score: CandidateProfile["differentialScore"]) {
  const dimensions = [
    ["fluctuation survival", score.fluctuationContribution],
    ["persistence and integration", score.persistenceContribution],
    ["pathway completion", score.completionContribution],
    ["architectural refinement", score.refinementContribution],
    ["principle-level identity", score.principleContribution],
    ["cross-candidate synthesis", score.synthesisContribution]
  ] as const

  return [...dimensions].sort((a, b) => b[1] - a[1])[0][0]
}

function secondStrongestDimension(
  score: CandidateProfile["differentialScore"]
) {
  const dimensions = [
    ["fluctuation survival", score.fluctuationContribution],
    ["persistence and integration", score.persistenceContribution],
    ["pathway completion", score.completionContribution],
    ["architectural refinement", score.refinementContribution],
    ["principle-level identity", score.principleContribution],
    ["cross-candidate synthesis", score.synthesisContribution]
  ] as const

  return [...dimensions].sort((a, b) => b[1] - a[1])[1][0]
}

function weakestDimension(score: CandidateProfile["differentialScore"]) {
  const dimensions = [
    ["fluctuation survival", score.fluctuationContribution],
    ["persistence and integration", score.persistenceContribution],
    ["pathway completion", score.completionContribution],
    ["architectural refinement", score.refinementContribution],
    ["principle-level identity", score.principleContribution],
    ["cross-candidate synthesis", score.synthesisContribution]
  ] as const

  return [...dimensions].sort((a, b) => a[1] - b[1])[0][0]
}

function buildCandidateProfile(candidate: any): CandidateProfile {
  const differentialScore = deriveCandidateDifferentialScore(candidate)
  const primaryContribution = strongestDimension(differentialScore)
  const secondaryContribution = secondStrongestDimension(differentialScore)
  const structuralWeakness = weakestDimension(differentialScore)

  return {
    candidateId: candidate?.candidateId || "unknown",
    candidateName: candidate?.candidateName || "unknown candidate",
    candidateType: candidate?.candidateType || "unknown",
    sourceLayer: candidate?.sourceLayer || "unknown",
    candidatePattern: candidate?.candidatePattern || "unknown",
    engineStatus:
      candidate?.engineStatus ||
      candidate?.identityDiscoveryStatus ||
      "unknown",
    metaReasoningStatus: candidate?.metaReasoningStatus || "unknown",
    inheritedScore: candidate?.score || null,
    differentialScore,
    primaryContribution,
    secondaryContribution,
    structuralWeakness,
    cooperativeRole: `This candidate contributes primarily through ${primaryContribution} and secondarily through ${secondaryContribution}.`,
    dominanceReason: `${candidate?.candidateName || "This candidate"} differentiates itself by contributing strongest support through ${primaryContribution}, while its weakest structural contribution is ${structuralWeakness}.`
  }
}

function buildDifferentialComparisons(profiles: CandidateProfile[]) {
  const comparisons: any[] = []

  for (let index = 0; index < profiles.length; index++) {
    for (let next = index + 1; next < profiles.length; next++) {
      const a = profiles[index]
      const b = profiles[next]
      const stronger =
        a.differentialScore.total >= b.differentialScore.total ? a : b
      const weaker = stronger === a ? b : a

      const dimensions = [
        {
          dimension: "fluctuationContribution",
          a: a.differentialScore.fluctuationContribution,
          b: b.differentialScore.fluctuationContribution
        },
        {
          dimension: "persistenceContribution",
          a: a.differentialScore.persistenceContribution,
          b: b.differentialScore.persistenceContribution
        },
        {
          dimension: "completionContribution",
          a: a.differentialScore.completionContribution,
          b: b.differentialScore.completionContribution
        },
        {
          dimension: "refinementContribution",
          a: a.differentialScore.refinementContribution,
          b: b.differentialScore.refinementContribution
        },
        {
          dimension: "principleContribution",
          a: a.differentialScore.principleContribution,
          b: b.differentialScore.principleContribution
        },
        {
          dimension: "synthesisContribution",
          a: a.differentialScore.synthesisContribution,
          b: b.differentialScore.synthesisContribution
        }
      ]

      const differentiators = dimensions
        .map(dimension => {
          const difference = Math.abs(dimension.a - dimension.b)
          const leader =
            dimension.a >= dimension.b ? a.candidateName : b.candidateName

          return {
            dimension: dimension.dimension,
            leader,
            difference
          }
        })
        .sort((x, y) => y.difference - x.difference)

      comparisons.push({
        comparison: `${a.candidateName} vs ${b.candidateName}`,
        strongerCandidate: stronger.candidateName,
        weakerCandidate: weaker.candidateName,
        differentialScoreDifference: Math.abs(
          a.differentialScore.total - b.differentialScore.total
        ),
        strongestDifferentiators: differentiators.slice(0, 3),
        reason: `${stronger.candidateName} ranks above ${weaker.candidateName} because its candidate-specific contribution profile is stronger after evaluating fluctuation, persistence, completion, refinement, principle, and synthesis dimensions.`
      })
    }
  }

  return comparisons
}

function buildCooperationMap(profiles: CandidateProfile[]) {
  return profiles.map(profile => ({
    candidateName: profile.candidateName,
    cooperativeRole: profile.cooperativeRole,
    complements: profiles
      .filter(other => other.candidateId !== profile.candidateId)
      .map(other => ({
        candidateName: other.candidateName,
        complementReason: `${profile.candidateName} contributes ${profile.primaryContribution}, while ${other.candidateName} contributes ${other.primaryContribution}. Together they broaden coherent identity reasoning across multiple structural functions.`
      }))
  }))
}

function buildDifferentialSynthesis(profiles: CandidateProfile[]) {
  if (!profiles.length) {
    return {
      synthesisStatus: "awaiting-candidates",
      synthesis: "No candidates are available for differential synthesis.",
      meaning:
        "Differential meta-reasoning requires candidate profiles before it can synthesize structural differences."
    }
  }

  const dominant = profiles[0]
  const contributionSet = Array.from(
    new Set(profiles.map(profile => profile.primaryContribution))
  )

  return {
    synthesisStatus: "differential-synthesis-active",
    dominantCandidate: dominant.candidateName,
    sharedContributionField: contributionSet,
    synthesis: `Current coherent identity is differentially organized around ${dominant.candidateName}, while the candidate ecosystem distributes support across ${contributionSet.join(", ")}.`,
    meaning:
      "Differential meta-reasoning explains not only which candidate is strongest, but what each candidate contributes, where each candidate is weaker, and how candidates cooperate to form a more complete identity reasoning field."
  }
}

export function generateDifferentialMetaReasoningState(
  input: DifferentialMetaReasoningInput
) {
  const metaReasoningState = input?.metaReasoningState || {}
  const candidates = getRankedCandidates(metaReasoningState)

  const candidateProfiles = candidates
    .map(buildCandidateProfile)
    .sort((a, b) => b.differentialScore.total - a.differentialScore.total)

  const dominantDifferentialCandidate = candidateProfiles[0] || null
  const weakestDifferentialCandidate =
    candidateProfiles[candidateProfiles.length - 1] || null

  const differentialComparisons =
    buildDifferentialComparisons(candidateProfiles)
  const cooperationMap = buildCooperationMap(candidateProfiles)
  const differentialSynthesis = buildDifferentialSynthesis(candidateProfiles)

  return {
    phase: "Phase 27.2 — Differential Meta-Reasoning Layer",

    differentialReasoningPurpose:
      "Differentiate identity candidates by deriving candidate-specific contribution profiles instead of ranking candidates only by shared global metrics or source priority.",

    reasoningPathway:
      "Meta Reasoning State → candidate-specific contribution extraction → differential scoring → structural comparison → cooperation mapping → differential synthesis",

    sourceStates: {
      metaReasoningAvailable: Boolean(input?.metaReasoningState),
      coherentIdentityDiscoveryAvailable: Boolean(
        input?.coherentIdentityDiscoveryState
      ),
      principleIntegrationAvailable: Boolean(input?.principleIntegrationState),
      identityFoundationAvailable: Boolean(input?.identityFoundationState),
      equationLaneAvailable: Boolean(input?.equationLaneState)
    },

    dominantDifferentialCandidate,
    weakestDifferentialCandidate,
    differentialCandidateProfiles: candidateProfiles,
    differentialComparisons,
    cooperationMap,
    differentialSynthesis,

    differentialMetaReasoningClassification:
      candidateProfiles.length > 1
        ? "candidate-specific-differential-reasoning-active"
        : candidateProfiles.length === 1
          ? "single-candidate-differential-reasoning-active"
          : "awaiting-differential-candidates",

    adjustmentGuidance:
      "If multiple candidates receive identical base metrics, use differential contribution profiles to explain structural differences, candidate roles, cooperation patterns, and dominance reasons.",

    differentialMetaReasoningActive: true,

    rule: "Use differential meta-reasoning as read-only reasoning guidance. It explains structural differences between identity candidates and how they cooperate, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
