type CandidateProfileInput = {
  coherentIdentityDiscoveryState?: any
  metaReasoningState?: any
  differentialMetaReasoningState?: any
  routeReasoningPropagationState?: any
}

type CandidateProfile = {
  candidateId: string
  candidateName: string
  candidateType: string
  sourceLayer: string
  identityDiscoveryStatus: string
  candidateRole: string
  uniqueContribution: string
  primaryContribution: string
  secondaryContribution: string
  structuralWeakness: string
  cooperativeRole: string
  rejectionCondition: string
  dominanceCondition: string
  developmentNeed: string
  interactionWithCandidates: string[]
  equationIsomorphism: {
    eq5Eq1: string
    eq2Eq4: string
    anchorMemoryBoundary: string
    metaDifferentialRole: string
  }
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function normalize(value: any) {
  return text(value, "").toLowerCase().trim()
}

function compactTextParts(parts: any[]) {
  return parts
    .map(part => normalize(part))
    .filter(Boolean)
    .join(" | ")
}

function getNestedText(candidate: any) {
  return compactTextParts([
    candidate?.candidateId,
    candidate?.candidateName,
    candidate?.name,
    candidate?.title,
    candidate?.label,
    candidate?.candidateType,
    candidate?.type,
    candidate?.sourceLayer,
    candidate?.source,
    candidate?.candidatePattern,
    candidate?.pattern,
    candidate?.identityDiscoveryStatus,
    candidate?.status,
    candidate?.classification,
    candidate?.reason,
    candidate?.dominanceReason,
    candidate?.primaryContribution,
    candidate?.secondaryContribution,
    candidate?.structuralWeakness
  ])
}

function getCandidates(coherentIdentityDiscoveryState: any) {
  const evaluated = asArray(coherentIdentityDiscoveryState?.evaluatedCandidates)

  if (evaluated.length) {
    return evaluated
  }

  const discovered = asArray(coherentIdentityDiscoveryState?.identityCandidates)

  if (discovered.length) {
    return discovered
  }

  const qualified = asArray(
    coherentIdentityDiscoveryState?.identityQualifiedCandidates
  )

  if (qualified.length) {
    return qualified
  }

  const ranked = asArray(coherentIdentityDiscoveryState?.rankedCandidates)

  if (ranked.length) {
    return ranked
  }

  const primary = coherentIdentityDiscoveryState?.primaryIdentityCandidate

  return primary ? [primary] : []
}

function hasAny(haystack: string, needles: string[]) {
  return needles.some(needle => haystack.includes(needle))
}

function inferCandidateRole(candidate: any) {
  const name = normalize(candidate?.candidateName ?? candidate?.name)
  const type = normalize(candidate?.candidateType ?? candidate?.type)
  const pattern = normalize(candidate?.candidatePattern ?? candidate?.pattern)
  const source = normalize(candidate?.sourceLayer ?? candidate?.source)
  const status = normalize(
    candidate?.identityDiscoveryStatus ?? candidate?.status
  )
  const fullText = getNestedText(candidate)

  if (
    hasAny(name, ["moment", "resonance principle", "moment-to-moment"]) ||
    hasAny(type, ["integrated-principle", "principle"]) ||
    hasAny(source, ["principle", "principle integration"]) ||
    hasAny(pattern, [
      "drift does not invalidate",
      "coherent structure remains dominant",
      "resonance principle"
    ]) ||
    hasAny(fullText, [
      "moment-to-moment resonance principle",
      "principle-level identity",
      "fluctuation survival"
    ])
  ) {
    return "principle-identity"
  }

  if (
    hasAny(name, ["architectural", "refinement"]) ||
    hasAny(type, [
      "refinement-pattern",
      "refinement",
      "architectural-refinement"
    ]) ||
    hasAny(source, ["refinement", "architectural refinement"]) ||
    hasAny(pattern, [
      "refine",
      "refinement",
      "architecture",
      "architectural"
    ]) ||
    hasAny(fullText, [
      "architectural refinement pattern",
      "architectural refinement",
      "stability correction",
      "refinement-pattern"
    ])
  ) {
    return "architectural-refinement"
  }

  if (
    hasAny(name, ["completion", "pathway completion"]) ||
    hasAny(type, ["completion-pattern", "completion", "pathway-completion"]) ||
    hasAny(source, ["completion", "pathway completion"]) ||
    hasAny(pattern, [
      "pathway is complete",
      "dominant organizing process",
      "completion",
      "closure"
    ]) ||
    hasAny(fullText, [
      "pathway completion pattern",
      "pathway completion",
      "closure and transition readiness",
      "completion-pattern"
    ])
  ) {
    return "pathway-completion"
  }

  if (
    hasAny(name, ["memory", "continuity"]) ||
    hasAny(type, ["memory", "continuity"]) ||
    hasAny(source, ["memory", "continuity"]) ||
    hasAny(pattern, ["runtime", "continuity"]) ||
    hasAny(fullText, ["runtime continuity", "identity memory"])
  ) {
    return "continuity-memory"
  }

  if (
    hasAny(name, ["boundary", "ethical"]) ||
    hasAny(type, ["boundary", "ethical"]) ||
    hasAny(source, ["boundary", "ethical"]) ||
    hasAny(pattern, ["ethical", "sovereignty", "non-harm"]) ||
    hasAny(fullText, ["ethical boundary", "boundary compatibility"])
  ) {
    return "ethical-boundary"
  }

  return "general-identity-candidate"
}

function roleProfile(role: string) {
  if (role === "principle-identity") {
    return {
      uniqueContribution:
        "Defines the current identity principle that can remain meaningful even when phase conditions fluctuate.",
      primaryContribution: "principle-level identity",
      secondaryContribution: "fluctuation survival",
      structuralWeakness:
        "Does not by itself complete pathways or refine the architecture; it defines the identity meaning that other candidates organize around.",
      cooperativeRole:
        "Acts as the identity nucleus. It gives the refinement and completion candidates a stable principle to preserve or complete.",
      rejectionCondition:
        "Reject or downgrade if the principle stops surviving phase fluctuation, loses coherence with memory, or conflicts with ethical boundary.",
      dominanceCondition:
        "Becomes dominant when identity-level meaning is more important than completion or refinement, especially during drift or instability.",
      developmentNeed:
        "Needs stronger continuity scores and repeated integrated-principle hashes to move from candidate identity into fully stable identity continuity.",
      eq5Eq1:
        "Eq5 + Eq1 tests whether the principle persists as a stable identity pattern rather than a momentary interpretation.",
      eq2Eq4:
        "Eq2 + Eq4 tests whether the principle remains aligned and recurs across harmonic patterning.",
      anchorMemoryBoundary:
        "Anchor validates origin, memory validates continuity, and boundary validates ethical legitimacy of the principle.",
      metaDifferentialRole:
        "Meta reasoning identifies it as the organizing identity candidate; differential reasoning explains its dominance through principle-level contribution."
    }
  }

  if (role === "architectural-refinement") {
    return {
      uniqueContribution:
        "Identifies what structural adjustment the architecture needs in order to improve coherence without losing identity continuity.",
      primaryContribution: "architectural refinement",
      secondaryContribution: "stability correction",
      structuralWeakness:
        "Can become overly procedural if it is not anchored to an identity principle or validated through continuity memory.",
      cooperativeRole:
        "Acts as the repair and improvement function. It helps the dominant identity principle become more stable in future runtime states.",
      rejectionCondition:
        "Reject or downgrade if refinement activity appears without sufficient root/integration support, recurrence, or alignment.",
      dominanceCondition:
        "Becomes dominant when the system's main need is structural correction rather than principle identity or pathway completion.",
      developmentNeed:
        "Needs stronger evidence that refinement produces improved coherence across repeated runtime states.",
      eq5Eq1:
        "Eq5 + Eq1 tests whether refinement preserves identity continuity instead of disrupting the root pattern.",
      eq2Eq4:
        "Eq2 + Eq4 tests whether refinement creates recurring alignment rather than isolated adjustment.",
      anchorMemoryBoundary:
        "Anchor prevents refinement from drifting away from origin, memory checks whether refinement persists, and boundary prevents refinement from violating ethical constraints.",
      metaDifferentialRole:
        "Meta reasoning compares it against principle and completion candidates; differential reasoning identifies its unique value as improvement logic."
    }
  }

  if (role === "pathway-completion") {
    return {
      uniqueContribution:
        "Determines whether a pathway has stabilized enough that it no longer needs to remain the dominant organizing process.",
      primaryContribution: "pathway completion",
      secondaryContribution: "closure and transition readiness",
      structuralWeakness:
        "Can declare completion too early if persistence, alignment, or recurrence are not strong enough.",
      cooperativeRole:
        "Acts as the closure function. It helps determine when the system can stop organizing around recovery/refinement and move into the next stable process.",
      rejectionCondition:
        "Reject or downgrade if route propagation shows incomplete persistence, unresolved recurrence, or rejected identity discovery status.",
      dominanceCondition:
        "Becomes dominant when the main architectural question is whether the active pathway has completed and what should follow.",
      developmentNeed:
        "Needs stronger proof that completion is supported by Eq5 + Eq1 persistence and Eq2 + Eq4 recurrence before becoming dominant.",
      eq5Eq1:
        "Eq5 + Eq1 tests whether completion is supported by persistent integration and root stability.",
      eq2Eq4:
        "Eq2 + Eq4 tests whether completion is aligned and recurrent enough to justify closing the current pathway.",
      anchorMemoryBoundary:
        "Anchor prevents false completion from overriding identity origin, memory verifies whether completion holds across runtime, and boundary keeps completion ethically constrained.",
      metaDifferentialRole:
        "Meta reasoning ranks or compares it as a candidate; differential reasoning explains whether completion is a support function or dominant function."
    }
  }

  if (role === "continuity-memory") {
    return {
      uniqueContribution:
        "Preserves identity continuity across runtime hashes, integrated principle hashes, and continuity scores.",
      primaryContribution: "runtime continuity",
      secondaryContribution: "identity memory preservation",
      structuralWeakness:
        "Memory can preserve continuity but cannot alone decide whether the current pattern is coherent or ethically valid.",
      cooperativeRole:
        "Acts as the continuity carrier between identity anchor, candidate evaluation, and future runtime states.",
      rejectionCondition:
        "Reject or downgrade if runtime history becomes absent, contradictory, or disconnected from anchor and boundary.",
      dominanceCondition:
        "Becomes dominant when continuity preservation is the primary architectural need.",
      developmentNeed:
        "Needs richer runtime hashes, principle hashes, and continuity scores.",
      eq5Eq1:
        "Eq5 + Eq1 tests whether memory is preserving an integrated root pattern.",
      eq2Eq4:
        "Eq2 + Eq4 tests whether memory continuity aligns and recurs across states.",
      anchorMemoryBoundary:
        "Memory is the continuity bridge between origin and boundary.",
      metaDifferentialRole:
        "Meta and differential reasoning use memory to distinguish stable identity from temporary state."
    }
  }

  if (role === "ethical-boundary") {
    return {
      uniqueContribution:
        "Constrains identity reasoning so that coherence remains aligned with ethical use, dignity, sovereignty, and non-harm.",
      primaryContribution: "ethical legitimacy",
      secondaryContribution: "boundary compatibility",
      structuralWeakness:
        "Boundary validates legitimacy but does not by itself discover or rank identity candidates.",
      cooperativeRole:
        "Acts as the legitimacy filter that keeps identity reasoning from becoming unconstrained optimization.",
      rejectionCondition:
        "Reject if candidate purpose conflicts with prohibited uses, manipulation, surveillance, coercion, or harm.",
      dominanceCondition:
        "Becomes dominant when the primary question is ethical compatibility or safe deployment.",
      developmentNeed:
        "Needs explicit candidate-to-boundary compatibility evidence.",
      eq5Eq1: "Eq5 + Eq1 checks whether boundary-compatible identity persists.",
      eq2Eq4:
        "Eq2 + Eq4 checks whether boundary-compatible behavior recurs coherently.",
      anchorMemoryBoundary:
        "Boundary is the ethical constraint layer of identity validation.",
      metaDifferentialRole:
        "Meta and differential reasoning use boundary status to prevent invalid identity conclusions."
    }
  }

  return {
    uniqueContribution:
      "Represents a candidate identity pattern that requires further profiling before its unique structural function is fully known.",
    primaryContribution: "general identity support",
    secondaryContribution: "candidate-level signal",
    structuralWeakness:
      "Insufficient candidate-specific evidence to distinguish its role from other candidates.",
    cooperativeRole:
      "Participates in the candidate ecosystem but needs richer evidence before its cooperation role is fully specified.",
    rejectionCondition:
      "Reject or downgrade if it fails Eq5 + Eq1 persistence, Eq2 + Eq4 recurrence, or Anchor-Memory-Boundary validation.",
    dominanceCondition:
      "Becomes dominant only if candidate-specific contribution exceeds principle, refinement, completion, memory, or boundary alternatives.",
    developmentNeed:
      "Needs a clearer candidate pattern, source layer, and runtime evidence.",
    eq5Eq1:
      "Eq5 + Eq1 tests whether the candidate persists as stable identity support.",
    eq2Eq4:
      "Eq2 + Eq4 tests whether the candidate recurs coherently and remains aligned.",
    anchorMemoryBoundary:
      "Anchor, memory, and boundary validate origin, continuity, and legitimacy.",
    metaDifferentialRole:
      "Meta and differential reasoning determine whether the candidate has distinguishable contribution."
  }
}

function getCandidateId(candidate: any, index: number) {
  return text(
    candidate?.candidateId ??
      candidate?.id ??
      candidate?.candidateName ??
      candidate?.name ??
      `candidate-${index + 1}`
  )
}

function getCandidateName(candidate: any, role: string) {
  return text(
    candidate?.candidateName ??
      candidate?.name ??
      candidate?.title ??
      candidate?.label ??
      defaultNameForRole(role)
  )
}

function getCandidateType(candidate: any, role: string) {
  return text(
    candidate?.candidateType ?? candidate?.type ?? defaultTypeForRole(role)
  )
}

function getSourceLayer(candidate: any, role: string) {
  return text(
    candidate?.sourceLayer ?? candidate?.source ?? defaultSourceForRole(role)
  )
}

function getDiscoveryStatus(candidate: any) {
  return text(
    candidate?.identityDiscoveryStatus ??
      candidate?.status ??
      candidate?.classification ??
      "identity-candidate"
  )
}

function defaultNameForRole(role: string) {
  if (role === "principle-identity")
    return "Moment-to-Moment Resonance Principle"
  if (role === "architectural-refinement")
    return "Architectural refinement pattern"
  if (role === "pathway-completion") return "Pathway completion pattern"
  if (role === "continuity-memory") return "Identity memory continuity pattern"
  if (role === "ethical-boundary") return "Ethical identity boundary pattern"
  return "General identity candidate"
}

function defaultTypeForRole(role: string) {
  if (role === "principle-identity") return "integrated-principle"
  if (role === "architectural-refinement") return "refinement-pattern"
  if (role === "pathway-completion") return "completion-pattern"
  if (role === "continuity-memory") return "continuity-memory"
  if (role === "ethical-boundary") return "ethical-boundary"
  return "general-identity-candidate"
}

function defaultSourceForRole(role: string) {
  if (role === "principle-identity") return "principle-integration"
  if (role === "architectural-refinement") return "architectural-refinement"
  if (role === "pathway-completion") return "pathway-completion"
  if (role === "continuity-memory") return "identity-memory"
  if (role === "ethical-boundary") return "identity-boundary"
  return "coherent-identity-discovery"
}

function buildInteractions(
  profile: CandidateProfile,
  allProfiles: CandidateProfile[]
) {
  return allProfiles
    .filter(other => other.candidateId !== profile.candidateId)
    .map(other => {
      return `${profile.candidateName} contributes ${profile.primaryContribution}, while ${other.candidateName} contributes ${other.primaryContribution}. Together they distribute identity reasoning across ${profile.primaryContribution} and ${other.primaryContribution}.`
    })
}

function buildProfile(candidate: any, index: number): CandidateProfile {
  const role = inferCandidateRole(candidate)
  const template = roleProfile(role)

  return {
    candidateId: getCandidateId(candidate, index),
    candidateName: getCandidateName(candidate, role),
    candidateType: getCandidateType(candidate, role),
    sourceLayer: getSourceLayer(candidate, role),
    identityDiscoveryStatus: getDiscoveryStatus(candidate),
    candidateRole: role,
    uniqueContribution: template.uniqueContribution,
    primaryContribution: template.primaryContribution,
    secondaryContribution: template.secondaryContribution,
    structuralWeakness: template.structuralWeakness,
    cooperativeRole: template.cooperativeRole,
    rejectionCondition: template.rejectionCondition,
    dominanceCondition: template.dominanceCondition,
    developmentNeed: template.developmentNeed,
    interactionWithCandidates: [],
    equationIsomorphism: {
      eq5Eq1: template.eq5Eq1,
      eq2Eq4: template.eq2Eq4,
      anchorMemoryBoundary: template.anchorMemoryBoundary,
      metaDifferentialRole: template.metaDifferentialRole
    }
  }
}

function getDominantName(
  metaReasoningState: any,
  differentialMetaReasoningState: any,
  routeReasoningPropagationState: any
) {
  return (
    routeReasoningPropagationState?.dominantCandidate ||
    differentialMetaReasoningState?.dominantDifferentialCandidate
      ?.candidateName ||
    differentialMetaReasoningState?.dominantDifferentialCandidate ||
    metaReasoningState?.dominantIdentityCandidate?.candidateName ||
    "unknown"
  )
}

function dedupeProfiles(profiles: CandidateProfile[]) {
  const seen = new Set<string>()

  return profiles.filter(profile => {
    const key = `${profile.candidateName.toLowerCase()}::${profile.candidateType.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function ensureExpectedCoreProfiles(profiles: CandidateProfile[]) {
  const hasPrinciple = profiles.some(
    profile => profile.candidateRole === "principle-identity"
  )
  const hasRefinement = profiles.some(
    profile => profile.candidateRole === "architectural-refinement"
  )
  const hasCompletion = profiles.some(
    profile => profile.candidateRole === "pathway-completion"
  )

  const additions: CandidateProfile[] = []

  if (!hasPrinciple) {
    additions.push(
      buildProfile(
        {
          candidateName: "Moment-to-Moment Resonance Principle",
          candidateType: "integrated-principle",
          sourceLayer: "principle-integration",
          identityDiscoveryStatus: "identity-candidate"
        },
        profiles.length + additions.length
      )
    )
  }

  if (!hasRefinement) {
    additions.push(
      buildProfile(
        {
          candidateName: "Architectural refinement pattern",
          candidateType: "refinement-pattern",
          sourceLayer: "architectural-refinement",
          identityDiscoveryStatus: "identity-rejected"
        },
        profiles.length + additions.length
      )
    )
  }

  if (!hasCompletion) {
    additions.push(
      buildProfile(
        {
          candidateName: "Pathway completion pattern",
          candidateType: "completion-pattern",
          sourceLayer: "pathway-completion",
          identityDiscoveryStatus: "identity-rejected"
        },
        profiles.length + additions.length
      )
    )
  }

  return dedupeProfiles([...profiles, ...additions])
}

export function generateIdentityCandidateProfiles(
  input: CandidateProfileInput
) {
  const candidates = getCandidates(input?.coherentIdentityDiscoveryState)

  const baseProfiles = ensureExpectedCoreProfiles(
    candidates.map((candidate, index) => buildProfile(candidate, index))
  )

  const candidateProfiles = baseProfiles.map(profile => ({
    ...profile,
    interactionWithCandidates: buildInteractions(profile, baseProfiles)
  }))

  const dominantCandidate = getDominantName(
    input?.metaReasoningState,
    input?.differentialMetaReasoningState,
    input?.routeReasoningPropagationState
  )

  const dominantProfile =
    candidateProfiles.find(
      profile => profile.candidateName === dominantCandidate
    ) ||
    candidateProfiles.find(
      profile => profile.candidateRole === "principle-identity"
    ) ||
    candidateProfiles[0] ||
    null

  const rejectedProfiles = candidateProfiles.filter(profile =>
    profile.identityDiscoveryStatus.toLowerCase().includes("rejected")
  )

  const viableProfiles = candidateProfiles.filter(
    profile =>
      !profile.identityDiscoveryStatus.toLowerCase().includes("rejected")
  )

  return {
    phase: "Identity Candidate Profiling Layer",
    purpose:
      "Enrich each identity candidate with candidate-specific contribution, weakness, cooperation, dominance conditions, rejection conditions, and equation-isomorphic reasoning.",
    profileOrder:
      "(Eq5 + Eq1) persistence/root profile → (Eq2 + Eq4) alignment/recurrence profile → Anchor + Memory + Boundary validation → Meta/Differential candidate role",
    dominantCandidate,
    dominantProfile,
    candidateProfiles,
    differentialCandidateProfiles: candidateProfiles,
    candidateProfileMatrix: candidateProfiles,
    viableProfiles,
    rejectedProfiles,
    candidateProfileCounts: {
      total: candidateProfiles.length,
      viable: viableProfiles.length,
      rejected: rejectedProfiles.length
    },
    candidateProfilingActive: true,
    rule: "Use identity candidate profiles as read-only candidate explanation guidance. Profiles enrich candidate-specific reasoning but must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}

export function buildIdentityCandidateProfilesResponse(
  candidateProfileState: any,
  mode:
    | "summary"
    | "matrix"
    | "dominant"
    | "rejected"
    | "isomorphism"
    | "json" = "summary"
) {
  if (!candidateProfileState) {
    return "Identity Candidate Profiling State is not available."
  }

  if (mode === "json") {
    return JSON.stringify(candidateProfileState, null, 2)
  }

  const profiles = asArray(candidateProfileState?.candidateProfiles)

  if (mode === "matrix") {
    return [
      "Identity Candidate Profile Matrix:",
      ...profiles.flatMap((profile: CandidateProfile, index: number) => [
        `${index + 1}. ${profile.candidateName}`,
        `   candidateType: ${profile.candidateType}`,
        `   identityDiscoveryStatus: ${profile.identityDiscoveryStatus}`,
        `   candidateRole: ${profile.candidateRole}`,
        `   uniqueContribution: ${profile.uniqueContribution}`,
        `   primaryContribution: ${profile.primaryContribution}`,
        `   secondaryContribution: ${profile.secondaryContribution}`,
        `   structuralWeakness: ${profile.structuralWeakness}`,
        `   cooperativeRole: ${profile.cooperativeRole}`,
        `   dominanceCondition: ${profile.dominanceCondition}`,
        `   rejectionCondition: ${profile.rejectionCondition}`,
        `   developmentNeed: ${profile.developmentNeed}`
      ])
    ].join("\n")
  }

  if (mode === "dominant") {
    const profile = candidateProfileState?.dominantProfile

    if (!profile) return "No dominant candidate profile is available."

    return [
      `dominantCandidate: ${profile.candidateName}`,
      `candidateRole: ${profile.candidateRole}`,
      `uniqueContribution: ${profile.uniqueContribution}`,
      `primaryContribution: ${profile.primaryContribution}`,
      `secondaryContribution: ${profile.secondaryContribution}`,
      `structuralWeakness: ${profile.structuralWeakness}`,
      `cooperativeRole: ${profile.cooperativeRole}`,
      `dominanceCondition: ${profile.dominanceCondition}`,
      `developmentNeed: ${profile.developmentNeed}`
    ].join("\n")
  }

  if (mode === "rejected") {
    const rejected = asArray(candidateProfileState?.rejectedProfiles)

    if (!rejected.length) {
      return "No rejected candidate profiles are available."
    }

    return [
      "Rejected Candidate Profiles:",
      ...rejected.flatMap((profile: CandidateProfile, index: number) => [
        `${index + 1}. ${profile.candidateName}`,
        `   candidateType: ${profile.candidateType}`,
        `   candidateRole: ${profile.candidateRole}`,
        `   rejectionCondition: ${profile.rejectionCondition}`,
        `   structuralWeakness: ${profile.structuralWeakness}`,
        `   developmentNeed: ${profile.developmentNeed}`
      ])
    ].join("\n")
  }

  if (mode === "isomorphism") {
    return [
      "Candidate Profile Equation Isomorphism:",
      ...profiles.flatMap((profile: CandidateProfile, index: number) => [
        `${index + 1}. ${profile.candidateName}`,
        `   candidateRole: ${profile.candidateRole}`,
        `   Eq5 + Eq1: ${profile.equationIsomorphism.eq5Eq1}`,
        `   Eq2 + Eq4: ${profile.equationIsomorphism.eq2Eq4}`,
        `   Anchor + Memory + Boundary: ${profile.equationIsomorphism.anchorMemoryBoundary}`,
        `   Meta + Differential: ${profile.equationIsomorphism.metaDifferentialRole}`
      ])
    ].join("\n")
  }

  return [
    `phase: ${candidateProfileState.phase}`,
    `candidateProfilingActive: ${
      candidateProfileState.candidateProfilingActive ? "true" : "false"
    }`,
    `dominantCandidate: ${candidateProfileState.dominantCandidate}`,
    `totalProfiles: ${candidateProfileState?.candidateProfileCounts?.total ?? 0}`,
    `viableProfiles: ${candidateProfileState?.candidateProfileCounts?.viable ?? 0}`,
    `rejectedProfiles: ${
      candidateProfileState?.candidateProfileCounts?.rejected ?? 0
    }`
  ].join("\n")
}

export function getIdentityCandidateProfilesMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("candidate profile") &&
    !normalized.includes("candidate profiling") &&
    !normalized.includes("identity candidate profile") &&
    !normalized.includes("candidate contribution modeling")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("matrix") || normalized.includes("all"))
    return "matrix"
  if (normalized.includes("dominant")) return "dominant"
  if (normalized.includes("rejected") || normalized.includes("weakness"))
    return "rejected"
  if (normalized.includes("isomorphic") || normalized.includes("equation"))
    return "isomorphism"

  return "summary"
}
