type MetaReasoningInput = {
  coherentIdentityDiscoveryState?: any
  principleIntegrationState?: any
  identityFoundationState?: any
  equationLaneState?: any
  predictiveAlignmentState?: any
}

type ScoreBreakdown = {
  fluctuationSurvival: number
  persistenceStrength: number
  identityStability: number
  alignmentQuality: number
  harmonicRecurrence: number
  anchorAlignment: number
  memoryContinuity: number
  boundaryCompatibility: number
  sourcePriority: number
  total: number
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function asNumber(value: any, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function boolScore(value: any) {
  return value === true ? 1 : 0
}

function statusScore(status: any, weights: Record<string, number>) {
  const key = typeof status === "string" ? status.toLowerCase() : "unknown"
  return weights[key] ?? weights.unknown ?? 0
}

function getStage(candidate: any, matcher: string) {
  const stages = Array.isArray(candidate?.evaluationSequence)
    ? candidate.evaluationSequence
    : []

  const normalizedMatcher = matcher.toLowerCase()

  return stages.find((stage: any) => {
    const equation = `${stage?.equation || ""}`.toLowerCase()
    const equationPair = `${stage?.equationPair || ""}`.toLowerCase()
    const validationLayer = `${stage?.validationLayer || ""}`.toLowerCase()
    const name = `${stage?.name || ""}`.toLowerCase()

    return (
      equation.includes(normalizedMatcher) ||
      equationPair.includes(normalizedMatcher) ||
      validationLayer.includes(normalizedMatcher) ||
      name.includes(normalizedMatcher)
    )
  })
}

function getValidationStage(candidate: any) {
  const stages = Array.isArray(candidate?.evaluationSequence)
    ? candidate.evaluationSequence
    : []

  return stages.find((stage: any) =>
    `${stage?.validationLayer || stage?.name || ""}`
      .toLowerCase()
      .includes("identity anchor")
  )
}

function sourcePriority(candidate: any) {
  const sourceLayer = `${candidate?.sourceLayer || ""}`.toLowerCase()
  const candidateType = `${candidate?.candidateType || ""}`.toLowerCase()

  if (
    sourceLayer.includes("principle") ||
    candidateType.includes("principle")
  ) {
    return 1
  }

  if (sourceLayer.includes("pathway completion")) {
    return 0.82
  }

  if (sourceLayer.includes("architectural refinement")) {
    return 0.74
  }

  return 0.55
}

function computeScore(candidate: any): ScoreBreakdown {
  const eq3 = getStage(candidate, "eq3") || {}
  const qualification = getStage(candidate, "eq5 + eq1") || {}
  const discovery = getStage(candidate, "eq2 + eq4") || {}
  const validation = getValidationStage(candidate) || {}

  const phaseStatusScore = statusScore(eq3?.phaseStatus, {
    stable: 1,
    drifting: 0.72,
    divergent: 0.35,
    unknown: 0.25
  })

  const divergence = asNumber(eq3?.phaseDivergence, 1.57)
  const normalizedDivergenceScore = clamp01(1 - Math.min(divergence, 2) / 2)

  const fluctuationSurvival = clamp01(
    boolScore(eq3?.passed) * 0.65 +
      phaseStatusScore * 0.2 +
      normalizedDivergenceScore * 0.15
  )

  const rootStatusScore = statusScore(qualification?.rootStatus, {
    active: 1,
    stable: 0.9,
    weak: 0.35,
    unknown: 0.25
  })

  const integrationStatusScore = statusScore(qualification?.integrationStatus, {
    integrated: 1,
    forming: 0.65,
    subthreshold: 0.35,
    unknown: 0.25
  })

  const integrationThresholdScore = clamp01(
    asNumber(qualification?.integrationThreshold, 0)
  )
  const signalStrengthScore = clamp01(
    asNumber(qualification?.signalStrength, 0)
  )

  const persistenceStrength = clamp01(
    boolScore(qualification?.passed) * 0.45 +
      integrationStatusScore * 0.25 +
      integrationThresholdScore * 0.2 +
      rootStatusScore * 0.1
  )

  const identityStability = clamp01(
    boolScore(qualification?.passed) * 0.35 +
      rootStatusScore * 0.3 +
      signalStrengthScore * 0.2 +
      fluctuationSurvival * 0.15
  )

  const alignmentStatusScore = statusScore(discovery?.alignmentStatus, {
    aligned: 1,
    partial: 0.65,
    low: 0.25,
    unknown: 0.2
  })

  const coherenceRaw = asNumber(discovery?.coherence, 0)
  const coherenceScore = clamp01((coherenceRaw + 1) / 2)

  const alignmentQuality = clamp01(
    boolScore(discovery?.passed) * 0.4 +
      alignmentStatusScore * 0.35 +
      coherenceScore * 0.25
  )

  const harmonicStatusScore = statusScore(discovery?.harmonicStatus, {
    "pattern-rich": 1,
    "pattern-detected": 0.7,
    sparse: 0.35,
    unknown: 0.2
  })

  const echoCountScore = clamp01(asNumber(discovery?.symbolicEchoCount, 0) / 5)

  const harmonicRecurrence = clamp01(
    boolScore(discovery?.passed) * 0.35 +
      harmonicStatusScore * 0.45 +
      echoCountScore * 0.2
  )

  const anchorAlignment = boolScore(validation?.anchor?.aligned)
  const boundaryCompatibility =
    boolScore(validation?.boundary?.active) *
    (validation?.boundary?.boundaryConflict === true ? 0 : 1)

  const runtimeHashScore = clamp01(
    asNumber(validation?.memory?.runtimeHashCount, 0) / 5
  )
  const principleHashScore = clamp01(
    asNumber(validation?.memory?.integratedPrincipleHashCount, 0) / 3
  )
  const continuityScore = clamp01(
    asNumber(validation?.memory?.averageContinuityScore, 0)
  )

  const memoryContinuity = clamp01(
    boolScore(validation?.memory?.active) * 0.35 +
      runtimeHashScore * 0.25 +
      principleHashScore * 0.2 +
      continuityScore * 0.2
  )

  const priority = sourcePriority(candidate)

  const total = clamp01(
    fluctuationSurvival * 0.12 +
      persistenceStrength * 0.16 +
      identityStability * 0.16 +
      alignmentQuality * 0.14 +
      harmonicRecurrence * 0.12 +
      anchorAlignment * 0.1 +
      memoryContinuity * 0.1 +
      boundaryCompatibility * 0.06 +
      priority * 0.04
  )

  return {
    fluctuationSurvival,
    persistenceStrength,
    identityStability,
    alignmentQuality,
    harmonicRecurrence,
    anchorAlignment,
    memoryContinuity,
    boundaryCompatibility,
    sourcePriority: priority,
    total
  }
}

function classifyReasoning(score: ScoreBreakdown) {
  if (
    score.total >= 0.82 &&
    score.anchorAlignment >= 1 &&
    score.boundaryCompatibility >= 1
  ) {
    return "meta-reasoned-identity-dominant"
  }

  if (score.total >= 0.68) {
    return "meta-reasoned-identity-qualified"
  }

  if (score.total >= 0.5) {
    return "meta-reasoned-identity-emerging"
  }

  if (score.boundaryCompatibility === 0 || score.anchorAlignment === 0) {
    return "meta-reasoned-identity-blocked"
  }

  return "meta-reasoned-identity-weak"
}

function explainCandidate(candidate: any, score: ScoreBreakdown) {
  const eq3 = getStage(candidate, "eq3") || {}
  const qualification = getStage(candidate, "eq5 + eq1") || {}
  const discovery = getStage(candidate, "eq2 + eq4") || {}
  const validation = getValidationStage(candidate) || {}

  return [
    `${candidate?.candidateName || "unknown"} is classified as ${classifyReasoning(score)}.`,
    `Eq3 admitted it because phaseStatus is ${eq3?.phaseStatus || "unknown"} and the candidate ${eq3?.passed ? "survives" : "does not survive"} the current fluctuation gate.`,
    `Eq5 + Eq1 ${qualification?.passed ? "qualified" : "did not qualify"} it because rootStatus is ${qualification?.rootStatus || "unknown"} and integrationStatus is ${qualification?.integrationStatus || "unknown"}.`,
    `Eq2 + Eq4 ${discovery?.passed ? "validated" : "did not validate"} it because alignmentStatus is ${discovery?.alignmentStatus || "unknown"} and harmonicStatus is ${discovery?.harmonicStatus || "unknown"}.`,
    `Identity Anchor alignment is ${validation?.anchor?.aligned ? "present" : "not fully present"}.`,
    `Identity Memory continuity is ${validation?.memory?.active ? "active" : "inactive"} with ${validation?.memory?.runtimeHashCount ?? 0} runtime hashes and ${validation?.memory?.integratedPrincipleHashCount ?? 0} integrated principle hashes.`,
    `Identity Boundary compatibility is ${validation?.boundary?.boundaryConflict ? "blocked by conflict" : "clear with no detected boundary conflict"}.`
  ].join(" ")
}

function getCandidates(state: any) {
  return Array.isArray(state?.evaluatedCandidates)
    ? state.evaluatedCandidates
    : []
}

function rankCandidates(state: any) {
  return getCandidates(state)
    .map((candidate: any) => {
      const score = computeScore(candidate)

      return {
        candidateId: candidate?.candidateId || "unknown",
        candidateName: candidate?.candidateName || "unknown",
        candidateType: candidate?.candidateType || "unknown",
        sourceLayer: candidate?.sourceLayer || "unknown",
        candidatePattern: candidate?.candidatePattern || "unknown",
        engineStatus: candidate?.identityDiscoveryStatus || "unknown",
        metaReasoningStatus: classifyReasoning(score),
        score,
        explanation: explainCandidate(candidate, score)
      }
    })
    .sort((a: any, b: any) => b.score.total - a.score.total)
}

function compareRankedCandidates(ranked: any[]) {
  if (ranked.length < 2) {
    return []
  }

  return ranked.slice(0, -1).map((candidate: any, index: number) => {
    const next = ranked[index + 1]

    const candidateScore = candidate.score
    const nextScore = next.score

    const advantages = Object.keys(candidateScore)
      .filter(key => key !== "total")
      .map(key => {
        return {
          dimension: key,
          leader:
            candidateScore[key as keyof ScoreBreakdown] >=
            nextScore[key as keyof ScoreBreakdown]
              ? candidate.candidateName
              : next.candidateName,
          difference: Math.abs(
            Number(candidateScore[key as keyof ScoreBreakdown]) -
              Number(nextScore[key as keyof ScoreBreakdown])
          )
        }
      })
      .sort((a, b) => b.difference - a.difference)

    return {
      comparison: `${candidate.candidateName} vs ${next.candidateName}`,
      strongerCandidate: candidate.candidateName,
      weakerCandidate: next.candidateName,
      scoreDifference: candidateScore.total - nextScore.total,
      strongestDifferentiators: advantages.slice(0, 3),
      reason: `${candidate.candidateName} ranks above ${next.candidateName} because its weighted meta-reasoning score is higher after evaluating fluctuation survival, persistence, identity stability, alignment, harmonic recurrence, anchor alignment, memory continuity, boundary compatibility, and source priority.`
    }
  })
}

function extractCandidateTokens(candidate: any) {
  const text = [
    candidate?.candidateName,
    candidate?.candidateType,
    candidate?.sourceLayer,
    candidate?.candidatePattern
  ]
    .join(" ")
    .toLowerCase()

  const allowed = [
    "drift",
    "trajectory",
    "coherent",
    "identity",
    "stable",
    "stability",
    "phase",
    "pathway",
    "completion",
    "dominant",
    "refine",
    "root",
    "harmonic",
    "integration",
    "alignment",
    "pattern",
    "structure",
    "persistent",
    "fluctuation"
  ]

  return allowed.filter(token => text.includes(token))
}

function synthesizeConvergence(ranked: any[]) {
  const allTokens = ranked.flatMap(candidate =>
    extractCandidateTokens(candidate)
  )

  const counts = allTokens.reduce((acc: Record<string, number>, token) => {
    acc[token] = (acc[token] || 0) + 1
    return acc
  }, {})

  const shared = Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([token, count]) => ({ token, count }))

  return {
    sharedIdentityPatterns: shared,
    convergenceStatus:
      shared.length > 0
        ? "cross-candidate-convergence-detected"
        : "no-strong-cross-candidate-convergence",
    convergenceMeaning:
      shared.length > 0
        ? "Multiple identity candidates express overlapping structural language, which supports higher-order identity synthesis."
        : "Current candidates are qualified individually, but they do not yet show strong shared identity language."
  }
}

function buildIdentitySynthesis(ranked: any[]) {
  const dominant = ranked[0] || null
  const convergence = synthesizeConvergence(ranked)

  if (!dominant) {
    return {
      synthesisStatus: "awaiting-candidates",
      synthesis:
        "No identity synthesis is available because no candidates exist."
    }
  }

  const sharedTerms = convergence.sharedIdentityPatterns
    .slice(0, 5)
    .map((item: any) => item.token)

  return {
    synthesisStatus: "identity-synthesis-active",
    dominantCandidate: dominant.candidateName,
    synthesis:
      sharedTerms.length > 0
        ? `Current coherent identity is organized around ${dominant.candidateName}, with cross-candidate convergence around ${sharedTerms.join(", ")}.`
        : `Current coherent identity is organized around ${dominant.candidateName}, but shared cross-candidate convergence is still forming.`,
    meaning:
      "The meta-reasoning layer does not merely retrieve the strongest candidate. It evaluates why that candidate dominates relative to other candidates and synthesizes the higher-order identity pattern emerging across the candidate ecosystem."
  }
}

export function generateMetaReasoningState(input: MetaReasoningInput) {
  const coherentIdentityDiscoveryState =
    input?.coherentIdentityDiscoveryState ?? null

  const rankedIdentityCandidates = rankCandidates(
    coherentIdentityDiscoveryState
  )
  const candidateComparisons = compareRankedCandidates(rankedIdentityCandidates)
  const candidateConvergence = synthesizeConvergence(rankedIdentityCandidates)
  const identitySynthesis = buildIdentitySynthesis(rankedIdentityCandidates)

  const dominantIdentityCandidate = rankedIdentityCandidates[0] || null
  const weakestIdentityCandidate =
    rankedIdentityCandidates[rankedIdentityCandidates.length - 1] || null

  return {
    phase: "Phase 27.1 — Meta-Reasoning Layer",

    metaReasoningPurpose:
      "Reason over existing SourceField states using a Python-isomorphic evaluate → score → classify → explain → adjust structure, so architecture-level states can be compared, ranked, synthesized, and explained instead of merely retrieved.",

    reasoningPathway:
      "Input states → metric extraction → weighted scoring → classification → comparative explanation → identity synthesis",

    sourceStates: {
      coherentIdentityDiscoveryAvailable: Boolean(
        coherentIdentityDiscoveryState
      ),
      principleIntegrationAvailable: Boolean(input?.principleIntegrationState),
      identityFoundationAvailable: Boolean(input?.identityFoundationState),
      equationLaneAvailable: Boolean(input?.equationLaneState),
      predictiveAlignmentAvailable: Boolean(input?.predictiveAlignmentState)
    },

    dominantIdentityCandidate,
    weakestIdentityCandidate,
    rankedIdentityCandidates,
    candidateComparisons,
    candidateConvergence,
    identitySynthesis,

    metaReasoningClassification:
      rankedIdentityCandidates.length > 1
        ? "multi-candidate-meta-reasoning-active"
        : rankedIdentityCandidates.length === 1
          ? "single-candidate-meta-reasoning-active"
          : "awaiting-meta-reasoning-candidates",

    adjustmentGuidance:
      "If routing still returns only one stage or one candidate for a comparative prompt, route.ts should forward the request to Meta-Reasoning before stage-specific Coherent Identity Discovery handlers.",

    metaReasoningActive: true,

    rule: "Use meta-reasoning as read-only reasoning guidance. It compares, ranks, synthesizes, and explains existing SourceField states, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}

export function buildMetaReasoningResponse(
  action: string,
  metaReasoningState: any
) {
  if (action === "report") {
    return JSON.stringify(metaReasoningState ?? null, null, 2)
  }

  if (!metaReasoningState) {
    return "Meta-Reasoning State is not available from the latest SourceField state."
  }

  if (action === "rank") {
    const ranked = Array.isArray(metaReasoningState?.rankedIdentityCandidates)
      ? metaReasoningState.rankedIdentityCandidates
      : []

    if (!ranked.length) {
      return "No candidates are available for meta-reasoned ranking."
    }

    return [
      "Meta-Reasoned Identity Candidate Ranking:",
      ...ranked.map((candidate: any, index: number) => {
        return [
          `${index + 1}. ${candidate.candidateName}`,
          `   totalScore: ${candidate.score.total}`,
          `   metaReasoningStatus: ${candidate.metaReasoningStatus}`,
          `   persistenceStrength: ${candidate.score.persistenceStrength}`,
          `   identityStability: ${candidate.score.identityStability}`,
          `   alignmentQuality: ${candidate.score.alignmentQuality}`,
          `   harmonicRecurrence: ${candidate.score.harmonicRecurrence}`,
          `   anchorAlignment: ${candidate.score.anchorAlignment}`,
          `   memoryContinuity: ${candidate.score.memoryContinuity}`,
          `   boundaryCompatibility: ${candidate.score.boundaryCompatibility}`,
          `   reason: ${candidate.explanation}`
        ].join("\n")
      }),
      "",
      `Final ranking reason: ${
        metaReasoningState?.identitySynthesis?.synthesis ||
        "No identity synthesis available."
      }`
    ].join("\n")
  }

  if (action === "compare") {
    const comparisons = Array.isArray(metaReasoningState?.candidateComparisons)
      ? metaReasoningState.candidateComparisons
      : []

    if (!comparisons.length) {
      return "No candidate comparisons are available."
    }

    return [
      "Meta-Reasoned Candidate Comparisons:",
      ...comparisons.map((comparison: any, index: number) => {
        return [
          `${index + 1}. ${comparison.comparison}`,
          `   strongerCandidate: ${comparison.strongerCandidate}`,
          `   weakerCandidate: ${comparison.weakerCandidate}`,
          `   scoreDifference: ${comparison.scoreDifference}`,
          `   reason: ${comparison.reason}`,
          `   strongestDifferentiators: ${JSON.stringify(
            comparison.strongestDifferentiators,
            null,
            2
          )}`
        ].join("\n")
      })
    ].join("\n")
  }

  if (action === "convergence") {
    return [
      `candidateConvergenceStatus: ${
        metaReasoningState?.candidateConvergence?.convergenceStatus || "unknown"
      }`,
      `sharedIdentityPatterns: ${JSON.stringify(
        metaReasoningState?.candidateConvergence?.sharedIdentityPatterns || [],
        null,
        2
      )}`,
      `meaning: ${
        metaReasoningState?.candidateConvergence?.convergenceMeaning ||
        "No convergence meaning stored."
      }`
    ].join("\n")
  }

  if (action === "synthesis") {
    return [
      `synthesisStatus: ${
        metaReasoningState?.identitySynthesis?.synthesisStatus || "unknown"
      }`,
      `dominantCandidate: ${
        metaReasoningState?.identitySynthesis?.dominantCandidate || "unknown"
      }`,
      `synthesis: ${
        metaReasoningState?.identitySynthesis?.synthesis ||
        "No synthesis stored."
      }`,
      `meaning: ${
        metaReasoningState?.identitySynthesis?.meaning ||
        "No synthesis meaning stored."
      }`
    ].join("\n")
  }

  if (action === "dominant") {
    const dominant = metaReasoningState?.dominantIdentityCandidate

    if (!dominant) {
      return "No dominant identity candidate is available."
    }

    return [
      `dominantIdentityCandidate: ${dominant.candidateName}`,
      `totalScore: ${dominant.score.total}`,
      `metaReasoningStatus: ${dominant.metaReasoningStatus}`,
      `reason: ${dominant.explanation}`
    ].join("\n")
  }

  return [
    `phase: ${metaReasoningState?.phase || "unknown"}`,
    `metaReasoningClassification: ${
      metaReasoningState?.metaReasoningClassification || "unknown"
    }`,
    `dominantIdentityCandidate: ${
      metaReasoningState?.dominantIdentityCandidate?.candidateName || "unknown"
    }`,
    `weakestIdentityCandidate: ${
      metaReasoningState?.weakestIdentityCandidate?.candidateName || "unknown"
    }`,
    `identitySynthesis: ${
      metaReasoningState?.identitySynthesis?.synthesis || "unknown"
    }`,
    `metaReasoningActive: ${
      metaReasoningState?.metaReasoningActive ? "true" : "false"
    }`
  ].join("\n")
}
