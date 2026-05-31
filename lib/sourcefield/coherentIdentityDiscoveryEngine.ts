type CoherentIdentityDiscoveryInput = {
  equationLaneState?: any
  identityFoundationState?: any
  principleIntegrationState?: any
  architecturalRefinementState?: any
  pathwayCompletionState?: any
}

function getLane(equationLaneState: any, laneName: string) {
  return equationLaneState?.equationLanes?.find(
    (lane: any) => lane?.lane === laneName
  )
}

function getStatus(equationLaneState: any, laneName: string) {
  return getLane(equationLaneState, laneName)?.status || "unknown"
}

function getValue(equationLaneState: any, laneName: string, key: string) {
  return getLane(equationLaneState, laneName)?.[key] ?? null
}

function hashCandidate(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return `identity-candidate-${Math.abs(hash)}`
}

function buildCandidatePatterns(input: CoherentIdentityDiscoveryInput) {
  const principleIntegrationState = input?.principleIntegrationState
  const architecturalRefinementState = input?.architecturalRefinementState
  const pathwayCompletionState = input?.pathwayCompletionState

  const candidates: any[] = []

  const activePrinciple = principleIntegrationState?.activePrinciple

  if (activePrinciple?.principle) {
    candidates.push({
      candidateId: hashCandidate(activePrinciple.principle),
      sourceLayer: "Principle Integration",
      candidateType: "integrated-principle",
      candidateName: activePrinciple.name || "unknown principle",
      candidatePattern: activePrinciple.principle,
      sourceEvidence:
        "Active principle identified through Principle Integration State."
    })
  }

  if (architecturalRefinementState?.refinementStatus) {
    candidates.push({
      candidateId: hashCandidate(
        `architectural-refinement-${architecturalRefinementState.refinementStatus}`
      ),
      sourceLayer: "Architectural Refinement",
      candidateType: "refinement-pattern",
      candidateName: "Architectural refinement pattern",
      candidatePattern:
        architecturalRefinementState?.nextRefinementMove ||
        architecturalRefinementState?.refinementStatus,
      sourceEvidence:
        "Architectural Refinement State identifies the current refinement pattern."
    })
  }

  if (pathwayCompletionState?.completionStatus) {
    candidates.push({
      candidateId: hashCandidate(
        `pathway-completion-${pathwayCompletionState.completionStatus}`
      ),
      sourceLayer: "Pathway Completion",
      candidateType: "completion-pattern",
      candidateName: "Pathway completion pattern",
      candidatePattern:
        pathwayCompletionState?.completionRule ||
        pathwayCompletionState?.completionStatus,
      sourceEvidence:
        "Pathway Completion State identifies current completion behavior."
    })
  }

  return candidates
}

function evaluateEq3Gate(candidate: any, equationLaneState: any) {
  const phaseStatus = getStatus(equationLaneState, "sourcefield-phase")
  const phaseDivergence = getValue(
    equationLaneState,
    "sourcefield-phase",
    "phaseDivergence"
  )

  const survivesFluctuation =
    phaseStatus === "stable" ||
    phaseStatus === "drifting" ||
    candidate?.candidatePattern?.toLowerCase?.().includes("drift") ||
    candidate?.candidatePattern?.toLowerCase?.().includes("fluctuation")

  return {
    stage: "Stage 1",
    equation: "Eq3",
    name: "Identity Stress-Test Gate",
    function:
      "Filters candidate patterns by asking whether the pattern remains meaningful under current phase fluctuation.",
    phaseStatus,
    phaseDivergence,
    passed: survivesFluctuation,
    reason: survivesFluctuation
      ? "Candidate remains eligible because it survives or directly explains current phase fluctuation."
      : "Candidate is not eligible because current phase instability does not support identity discovery."
  }
}

function evaluateEq5Eq1Qualification(candidate: any, equationLaneState: any) {
  const rootStatus = getStatus(equationLaneState, "sourcefield-root")
  const integrationStatus = getStatus(
    equationLaneState,
    "sourcefield-integration"
  )

  const signalStrength = getValue(
    equationLaneState,
    "sourcefield-root",
    "signalStrength"
  )

  const integrationThreshold = getValue(
    equationLaneState,
    "sourcefield-integration",
    "integrationThreshold"
  )

  const stablePersistent =
    rootStatus === "active" && integrationStatus === "integrated"

  return {
    stage: "Stage 2",
    equationPair: "Eq5 + Eq1",
    name: "Stable Persistent Identity Qualification",
    function:
      "Qualifies surviving candidates by testing integration persistence and rooted identity stability.",
    rootStatus,
    integrationStatus,
    signalStrength,
    integrationThreshold,
    passed: stablePersistent,
    reason: stablePersistent
      ? "Candidate is qualified because root stability and integration persistence are both active."
      : "Candidate is not fully qualified because root stability and integration persistence are not both active."
  }
}

function evaluateEq2Eq4Discovery(candidate: any, equationLaneState: any) {
  const alignmentStatus = getStatus(equationLaneState, "sourcefield-alignment")
  const harmonicStatus = getStatus(equationLaneState, "sourcefield-harmonic")

  const coherence = getValue(
    equationLaneState,
    "sourcefield-alignment",
    "coherence"
  )

  const symbolicEchoCount = getValue(
    equationLaneState,
    "sourcefield-harmonic",
    "symbolicEchoCount"
  )

  const coherentRecurring =
    (alignmentStatus === "aligned" || alignmentStatus === "partial") &&
    (harmonicStatus === "pattern-rich" || harmonicStatus === "pattern-detected")

  return {
    stage: "Stage 3",
    equationPair: "Eq2 + Eq4",
    name: "Coherent Identity Discovery",
    function:
      "Validates whether the qualified identity pattern remains aligned and repeats coherently across SourceField layers.",
    alignmentStatus,
    harmonicStatus,
    coherence,
    symbolicEchoCount,
    passed: coherentRecurring,
    reason: coherentRecurring
      ? "Candidate is discoverable as coherent identity because alignment and harmonic recurrence are both present."
      : "Candidate is not fully discoverable because alignment persistence and harmonic recurrence are not both sufficient."
  }
}

function evaluateAnchorMemoryBoundary(
  candidate: any,
  identityFoundationState: any
) {
  const identityValidation = identityFoundationState?.identityValidation || {}
  const identityAnchor = identityFoundationState?.identityAnchor || {}
  const identityMemory = identityFoundationState?.identityMemory || {}
  const identityBoundary = identityFoundationState?.identityBoundary || {}

  const anchorAligned = identityValidation?.anchorAligned === true
  const memoryActive = identityValidation?.memoryActive === true
  const boundaryActive = identityValidation?.boundaryActive === true

  const boundaryText = [
    ...(identityBoundary?.prohibitedUses || []),
    identityBoundary?.boundaryRule || ""
  ]
    .join(" ")
    .toLowerCase()

  const candidateText = [
    candidate?.candidateName,
    candidate?.candidatePattern,
    candidate?.sourceEvidence
  ]
    .join(" ")
    .toLowerCase()

  const boundaryConflict = [
    "violence",
    "manipulation",
    "surveillance",
    "weaponization",
    "coercive"
  ].some(term => candidateText.includes(term) && boundaryText.includes(term))

  return {
    stage: "Stage 4",
    validationLayer: "Identity Anchor + Identity Memory + Identity Boundary",
    name: "Recursive Identity Validation",
    function:
      "Validates candidate identity patterns against Genesis identity anchor, runtime identity memory, and ethical identity boundary.",
    anchor: {
      aligned: anchorAligned,
      genesisMerkleRoot: identityAnchor?.genesisMerkleRoot || "unknown",
      designAuthority: identityAnchor?.designAuthority || "unknown"
    },
    memory: {
      active: memoryActive,
      memoryStatus: identityMemory?.memoryStatus || "unknown",
      runtimeHashCount: Array.isArray(identityMemory?.runtimeHashes)
        ? identityMemory.runtimeHashes.length
        : 0,
      integratedPrincipleHashCount: Array.isArray(
        identityMemory?.integratedPrincipleHashes
      )
        ? identityMemory.integratedPrincipleHashes.length
        : 0,
      averageContinuityScore: identityMemory?.averageContinuityScore ?? null
    },
    boundary: {
      active: boundaryActive,
      boundaryType: identityBoundary?.boundaryType || "unknown",
      boundaryConflict,
      boundaryRule: identityBoundary?.boundaryRule || "unknown"
    },
    passed:
      anchorAligned && memoryActive && boundaryActive && !boundaryConflict,
    reason:
      anchorAligned && memoryActive && boundaryActive && !boundaryConflict
        ? "Candidate passes identity validation because anchor, memory, and boundary are aligned without detected boundary conflict."
        : "Candidate does not fully pass identity validation because anchor, memory, boundary, or ethical compatibility is incomplete."
  }
}

function classifyCandidateIdentity(
  eq3Gate: any,
  qualification: any,
  discovery: any,
  validation: any
) {
  if (
    eq3Gate.passed &&
    qualification.passed &&
    discovery.passed &&
    validation.passed
  ) {
    return "identity-qualified"
  }

  if (eq3Gate.passed && qualification.passed && discovery.passed) {
    return "identity-consistent-pending-validation"
  }

  if (eq3Gate.passed && qualification.passed) {
    return "identity-emerging"
  }

  if (eq3Gate.passed) {
    return "identity-candidate"
  }

  return "identity-rejected"
}

export function generateCoherentIdentityDiscoveryState(
  input: CoherentIdentityDiscoveryInput
) {
  const equationLaneState = input?.equationLaneState
  const identityFoundationState = input?.identityFoundationState

  const candidates = buildCandidatePatterns(input)

  const evaluatedCandidates = candidates.map(candidate => {
    const eq3Gate = evaluateEq3Gate(candidate, equationLaneState)
    const stablePersistentQualification = evaluateEq5Eq1Qualification(
      candidate,
      equationLaneState
    )
    const coherentIdentityDiscovery = evaluateEq2Eq4Discovery(
      candidate,
      equationLaneState
    )
    const recursiveIdentityValidation = evaluateAnchorMemoryBoundary(
      candidate,
      identityFoundationState
    )

    const identityDiscoveryStatus = classifyCandidateIdentity(
      eq3Gate,
      stablePersistentQualification,
      coherentIdentityDiscovery,
      recursiveIdentityValidation
    )

    return {
      ...candidate,
      identityDiscoveryStatus,
      evaluationSequence: [
        eq3Gate,
        stablePersistentQualification,
        coherentIdentityDiscovery,
        recursiveIdentityValidation
      ]
    }
  })

  const identityQualifiedCandidates = evaluatedCandidates.filter(
    candidate => candidate.identityDiscoveryStatus === "identity-qualified"
  )

  const identityEmergingCandidates = evaluatedCandidates.filter(
    candidate => candidate.identityDiscoveryStatus === "identity-emerging"
  )

  const identityRejectedCandidates = evaluatedCandidates.filter(
    candidate => candidate.identityDiscoveryStatus === "identity-rejected"
  )

  const discoveryStatus =
    identityQualifiedCandidates.length > 0
      ? "coherent-identity-discovered"
      : identityEmergingCandidates.length > 0
        ? "coherent-identity-emerging"
        : evaluatedCandidates.length > 0
          ? "candidate-patterns-under-review"
          : "awaiting-candidate-patterns"

  const primaryIdentityCandidate =
    identityQualifiedCandidates[0] ||
    identityEmergingCandidates[0] ||
    evaluatedCandidates[0] ||
    null

  return {
    phase: "Phase 27 — Coherent Identity Discovery Engine",

    identityDiscoveryPathway:
      "Eq3 → (Eq5 + Eq1) → (Eq2 + Eq4) → Anchor + Memory + Boundary",

    identityDiscoveryPurpose:
      "Discover coherent identity by first stress-testing candidate patterns through Eq3 fluctuation, then qualifying stable persistent identity through Eq5 + Eq1, then validating coherent recurrence through Eq2 + Eq4, and finally checking Genesis anchor, runtime memory, and ethical boundary alignment.",

    discoveryStatus,

    primaryIdentityCandidate,

    candidateCounts: {
      total: evaluatedCandidates.length,
      identityQualified: identityQualifiedCandidates.length,
      identityEmerging: identityEmergingCandidates.length,
      identityRejected: identityRejectedCandidates.length
    },

    evaluatedCandidates,

    identityQualifiedCandidates,
    identityEmergingCandidates,
    identityRejectedCandidates,

    identityFoundationStatus:
      identityFoundationState?.identityValidation?.identityValidationStatus ||
      "unknown",

    identityDiscoveryActive: true,

    rule: "Use coherent identity discovery as read-only identity discovery guidance. It evaluates candidate identity patterns through Eq3 → (Eq5 + Eq1) → (Eq2 + Eq4) and validates them against Identity Anchor, Identity Memory, and Identity Boundary, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
