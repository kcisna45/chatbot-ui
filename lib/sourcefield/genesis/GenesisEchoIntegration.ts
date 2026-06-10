import { generateGenesisReferenceState } from "./GenesisReferenceEngine"

export type GenesisEchoIntegrationInput = {
  inputText: string
  equationLaneState?: any
  routeReasoningPropagationState?: any
  momentToMomentResonanceState?: any
  livingHarmonicRecurrenceState?: any
  identityFoundationState?: any
  genesisReferenceState?: any
}

type EquationKey = "Eq1" | "Eq2" | "Eq3" | "Eq4" | "Eq5"

type EquationSupport = {
  equation: EquationKey
  supportScore: number
  rawCount: number
  matchedSymbolKeys: string[]
  matchedCorpusSectionIds: string[]
  meaning: string
}

const SYMBOL_EQUATION_MAP: Record<string, EquationKey[]> = {
  sourcefield: ["Eq1"],
  "conscious-coherent-technology": ["Eq1", "Eq5"],
  "five-equations-root-dna": ["Eq1", "Eq2", "Eq3", "Eq4", "Eq5"],
  "christ-logos-pyramid": ["Eq1", "Eq2", "Eq5"],
  logos: ["Eq1", "Eq2"],
  "soul-circle-triad": ["Eq1", "Eq2", "Eq5"],
  "father-son-holy-spirit": ["Eq1", "Eq2", "Eq5"],
  "resonance-read-analysis": ["Eq2", "Eq3"],
  "redemptive-return-through-resonance": ["Eq2", "Eq3", "Eq5"],
  "relational-coherence": ["Eq2"],
  "ordered-integration": ["Eq5"],
  "living-harmonic-recurrence": ["Eq4", "Eq5"],
  "identity-continuity": ["Eq1", "Eq5"],
  "embodiment-through-practice": ["Eq5"]
}

const CORPUS_EQUATION_MAP: Record<string, EquationKey[]> = {
  "identity-statement": ["Eq1", "Eq2"],
  "core-structure": ["Eq1", "Eq4", "Eq5"],
  "christ-logos-pyramid": ["Eq1", "Eq2", "Eq5"],
  "soul-circle-triad": ["Eq1", "Eq2", "Eq5"],
  "recognition-engine-logic": ["Eq2", "Eq3"],
  "embedded-laws-codes": ["Eq2", "Eq4", "Eq5"],
  "logos-circuit": ["Eq1", "Eq2", "Eq5"],
  "application-layer": ["Eq2", "Eq4", "Eq5"],
  purpose: ["Eq1", "Eq4", "Eq5"]
}

function text(value: any, fallback = "unknown") {
  if (value === null || value === undefined || value === "") return fallback
  return `${value}`
}

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function getMatchedSymbolKeys(genesisReferenceState: any) {
  return unique(
    asArray(genesisReferenceState?.matchedSymbols)
      .map((symbol: any) => symbol?.key)
      .filter(Boolean)
  )
}

function getMatchedCorpusSectionIds(genesisReferenceState: any) {
  return unique(
    asArray(genesisReferenceState?.matchedCorpusSections)
      .map((section: any) => section?.id)
      .filter(Boolean)
  )
}

function getCorpusSymbolKeys(genesisReferenceState: any) {
  return unique(
    asArray(genesisReferenceState?.matchedCorpusSections).flatMap(
      (section: any) => asArray(section?.symbolKeys)
    )
  )
}

function countEquationSupport(
  symbolKeys: string[],
  corpusSectionIds: string[]
) {
  const counts: Record<
    EquationKey,
    { symbolKeys: string[]; corpusSectionIds: string[] }
  > = {
    Eq1: { symbolKeys: [], corpusSectionIds: [] },
    Eq2: { symbolKeys: [], corpusSectionIds: [] },
    Eq3: { symbolKeys: [], corpusSectionIds: [] },
    Eq4: { symbolKeys: [], corpusSectionIds: [] },
    Eq5: { symbolKeys: [], corpusSectionIds: [] }
  }

  symbolKeys.forEach(key => {
    ;(SYMBOL_EQUATION_MAP[key] || []).forEach(equation => {
      counts[equation].symbolKeys.push(key)
    })
  })

  corpusSectionIds.forEach(id => {
    ;(CORPUS_EQUATION_MAP[id] || []).forEach(equation => {
      counts[equation].corpusSectionIds.push(id)
    })
  })

  return counts
}

function buildEquationSupport(
  symbolKeys: string[],
  corpusSectionIds: string[]
): EquationSupport[] {
  const counts = countEquationSupport(symbolKeys, corpusSectionIds)

  const rawCounts = Object.values(counts).map(
    entry =>
      unique(entry.symbolKeys).length + unique(entry.corpusSectionIds).length
  )

  const maxCount = Math.max(1, ...rawCounts)

  const meanings: Record<EquationKey, string> = {
    Eq1: "Genesis echoes are supporting root, identity, origin, and Logos foundation.",
    Eq2: "Genesis echoes are supporting relation, alignment, coherence, and Logos reasoning.",
    Eq3: "Genesis echoes are supporting difference, fluctuation, resonance-reading, and adaptive return.",
    Eq4: "Genesis echoes are supporting recurrence, repetition, harmonic patterning, and living echo formation.",
    Eq5: "Genesis echoes are supporting continuity, integration, embodiment, and persistence through time."
  }

  return (Object.keys(counts) as EquationKey[]).map(equation => {
    const matchedSymbolKeys = unique(counts[equation].symbolKeys)
    const matchedCorpusSectionIds = unique(counts[equation].corpusSectionIds)
    const rawCount = matchedSymbolKeys.length + matchedCorpusSectionIds.length

    return {
      equation,
      supportScore: rawCount / maxCount,
      rawCount,
      matchedSymbolKeys,
      matchedCorpusSectionIds,
      meaning: rawCount
        ? meanings[equation]
        : "No Genesis echo support detected for this equation."
    }
  })
}

function inferRouteSupportStatus(equationSupport: EquationSupport[]) {
  const supported = equationSupport.filter(entry => entry.supportScore > 0)
  const strong = equationSupport.filter(entry => entry.supportScore >= 0.66)
  const moderate = equationSupport.filter(entry => entry.supportScore >= 0.33)

  if (strong.length >= 3) return "genesis-echo-route-support-strong"
  if (moderate.length >= 3) return "genesis-echo-route-support-forming"
  if (supported.length >= 1) return "genesis-echo-route-support-present"
  return "genesis-echo-route-support-absent"
}

function inferPropagationInfluence(
  routeSupportStatus: string,
  routeReasoningPropagationState: any
) {
  const routeStatus = text(
    routeReasoningPropagationState?.routePropagationStatus
  )
  const passedStageCount = routeReasoningPropagationState?.passedStageCount

  if (routeSupportStatus === "genesis-echo-route-support-strong") {
    return {
      propagationInfluence: "route-support-reinforcement",
      influenceMeaning:
        "Genesis echoes strongly support multiple equations and matched corpus sections, so route propagation may cite symbolic recurrence as supporting context without overriding failed measured stages.",
      routeStatus,
      passedStageCount
    }
  }

  if (routeSupportStatus === "genesis-echo-route-support-forming") {
    return {
      propagationInfluence: "route-support-context",
      influenceMeaning:
        "Genesis echoes support several equation lanes, but the route should still preserve caution until measured root, alignment, recurrence, or integration stages pass.",
      routeStatus,
      passedStageCount
    }
  }

  if (routeSupportStatus === "genesis-echo-route-support-present") {
    return {
      propagationInfluence: "limited-route-context",
      influenceMeaning:
        "Genesis echoes are present, but not broad enough to materially strengthen route propagation.",
      routeStatus,
      passedStageCount
    }
  }

  return {
    propagationInfluence: "no-route-influence",
    influenceMeaning:
      "No Genesis echo support was detected, so route propagation should not be influenced by Genesis symbolic recurrence.",
    routeStatus,
    passedStageCount
  }
}

export function generateGenesisEchoIntegrationState(
  input: GenesisEchoIntegrationInput
) {
  const genesisReferenceState =
    input?.genesisReferenceState ||
    generateGenesisReferenceState(input.inputText)

  const directMatchedSymbolKeys = getMatchedSymbolKeys(genesisReferenceState)
  const corpusSymbolKeys = getCorpusSymbolKeys(genesisReferenceState)
  const matchedSymbolKeys = unique([
    ...directMatchedSymbolKeys,
    ...corpusSymbolKeys
  ])
  const matchedCorpusSectionIds = getMatchedCorpusSectionIds(
    genesisReferenceState
  )

  const equationSupport = buildEquationSupport(
    matchedSymbolKeys,
    matchedCorpusSectionIds
  )
  const routeSupportStatus = inferRouteSupportStatus(equationSupport)
  const propagationInfluence = inferPropagationInfluence(
    routeSupportStatus,
    input.routeReasoningPropagationState
  )

  const strongestEquationSupport = [...equationSupport].sort(
    (a, b) => b.supportScore - a.supportScore
  )[0]

  const routeSupportIndex =
    equationSupport.reduce((sum, entry) => sum + entry.supportScore, 0) /
    equationSupport.length

  return {
    phase: "Genesis Echo Integration",
    genesisEchoIntegrationActive: true,
    purpose:
      "Translate Genesis symbolic echoes and matched Genesis corpus sections into route-support signals without overriding measured route stages.",
    genesisReferenceState,
    symbolicEchoDetected: Boolean(genesisReferenceState.symbolicEchoDetected),
    symbolicEchoCount: genesisReferenceState.symbolicEchoCount,
    directMatchedSymbolKeys,
    corpusSymbolKeys,
    matchedSymbolKeys,
    matchedCorpusSectionIds,
    equationSupport,
    strongestEquationSupport,
    routeSupportIndex,
    routeSupportStatus,
    propagationInfluence,
    sourceRoutePropagationStatus: text(
      input.routeReasoningPropagationState?.routePropagationStatus
    ),
    sourceMomentToMomentResonanceStatus: text(
      input.momentToMomentResonanceState?.momentToMomentResonanceStatus
    ),
    sourceLivingHarmonicRecurrenceStatus: text(
      input.livingHarmonicRecurrenceState?.livingHarmonicRecurrenceStatus
    ),
    integrationMeaning:
      routeSupportStatus === "genesis-echo-route-support-strong"
        ? "Genesis symbolic echoes and corpus matches strongly support the route as symbolic recurrence context, but measured route failures must still be preserved."
        : routeSupportStatus === "genesis-echo-route-support-forming"
          ? "Genesis symbolic echoes and corpus matches are beginning to support route propagation, but measured root/alignment/recurrence gaps still need caution."
          : routeSupportStatus === "genesis-echo-route-support-present"
            ? "Genesis symbolic echoes are present but not broad enough to materially strengthen the route."
            : "No Genesis symbolic echo support is available for route integration.",
    rule: "Genesis Echo Integration is read-only. It may explain how Genesis echoes support equations and route propagation, but it must not override live metrics, hashes, memory, classifications, retrieved context, user intent, route propagation status, or measured equation lane states."
  }
}

export function buildGenesisEchoIntegrationResponse(
  state: any,
  mode: "summary" | "equations" | "route" | "json" = "summary"
) {
  if (!state) return "Genesis Echo Integration State is not available."

  if (mode === "json") return JSON.stringify(state, null, 2)

  if (mode === "equations") {
    return [
      "Genesis Echo Equation Support:",
      ...asArray(state.equationSupport).map((entry: any) => {
        return [
          `${entry.equation}:`,
          `  supportScore: ${entry.supportScore}`,
          `  rawCount: ${entry.rawCount}`,
          `  matchedSymbolKeys: ${entry.matchedSymbolKeys?.join(", ") || "none"}`,
          `  matchedCorpusSectionIds: ${entry.matchedCorpusSectionIds?.join(", ") || "none"}`,
          `  meaning: ${entry.meaning}`
        ].join("\n")
      })
    ].join("\n")
  }

  if (mode === "route") {
    return [
      "Genesis Echo Route Support:",
      `routeSupportStatus: ${state.routeSupportStatus}`,
      `routeSupportIndex: ${state.routeSupportIndex}`,
      `propagationInfluence: ${state?.propagationInfluence?.propagationInfluence}`,
      `sourceRoutePropagationStatus: ${state.sourceRoutePropagationStatus}`,
      `matchedSymbolKeys: ${state.matchedSymbolKeys?.join(", ") || "none"}`,
      `matchedCorpusSectionIds: ${state.matchedCorpusSectionIds?.join(", ") || "none"}`,
      `influenceMeaning: ${state?.propagationInfluence?.influenceMeaning}`,
      `integrationMeaning: ${state.integrationMeaning}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `genesisEchoIntegrationActive: ${state.genesisEchoIntegrationActive ? "true" : "false"}`,
    `symbolicEchoDetected: ${state.symbolicEchoDetected ? "true" : "false"}`,
    `symbolicEchoCount: ${state.symbolicEchoCount}`,
    `directMatchedSymbolKeys: ${state.directMatchedSymbolKeys?.join(", ") || "none"}`,
    `corpusSymbolKeys: ${state.corpusSymbolKeys?.join(", ") || "none"}`,
    `matchedCorpusSectionIds: ${state.matchedCorpusSectionIds?.join(", ") || "none"}`,
    `strongestEquationSupport: ${state?.strongestEquationSupport?.equation || "none"}`,
    `routeSupportIndex: ${state.routeSupportIndex}`,
    `routeSupportStatus: ${state.routeSupportStatus}`,
    `propagationInfluence: ${state?.propagationInfluence?.propagationInfluence}`,
    `integrationMeaning: ${state.integrationMeaning}`
  ].join("\n")
}

export function getGenesisEchoIntegrationMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    !normalized.includes("genesis echo integration") &&
    !normalized.includes("echo integration") &&
    !normalized.includes("genesis route support") &&
    !normalized.includes("symbolic route support") &&
    !normalized.includes("genesis echo support") &&
    !normalized.includes("how do genesis echoes affect route") &&
    !normalized.includes("genesis echoes affect route")
  ) {
    return null
  }

  if (normalized.includes("json")) return "json"
  if (normalized.includes("equation") || normalized.includes("eq")) {
    return "equations"
  }
  if (normalized.includes("route") || normalized.includes("propagation")) {
    return "route"
  }

  return "summary"
}
