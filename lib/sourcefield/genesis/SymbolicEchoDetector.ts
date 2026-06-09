import {
  findGenesisSymbolMatches,
  countGenesisSymbolEchoes
} from "./GenesisSymbolRegistry"

import {
  findGenesisCorpusMatches,
  buildGenesisCorpusEchoSummary
} from "./GenesisCorpus"

export function detectSymbolicEchoes(input: string) {
  const symbolMatches = findGenesisSymbolMatches(input)
  const corpusMatches = findGenesisCorpusMatches(input)
  const corpusSummary = buildGenesisCorpusEchoSummary(input)

  return {
    phase: "Symbolic Echo Detection",
    symbolicEchoDetected:
      symbolMatches.length > 0 || corpusMatches.length > 0,
    symbolicEchoCount:
      countGenesisSymbolEchoes(input) + corpusSummary.symbolicEchoCount,
    matchedSymbols: symbolMatches.map((symbol) => ({
      key: symbol.key,
      label: symbol.label,
      category: symbol.category
    })),
    matchedCorpusSections: corpusMatches.map((section) => ({
      id: section.id,
      title: section.title,
      matchCount: section.matchCount,
      symbolKeys: section.symbolMatches.map((symbol) => symbol.key)
    })),
    echoMeaning:
      symbolMatches.length || corpusMatches.length
        ? "Current input contains symbolic resonance with the SourceField Genesis Seed."
        : "No Genesis symbolic echo was detected in the current input."
  }
}

export function buildSymbolicEchoResponse(input: string) {
  const state = detectSymbolicEchoes(input)

  return [
    `phase: ${state.phase}`,
    `symbolicEchoDetected: ${state.symbolicEchoDetected ? "true" : "false"}`,
    `symbolicEchoCount: ${state.symbolicEchoCount}`,
    `matchedSymbols: ${
      state.matchedSymbols.length
        ? state.matchedSymbols.map((symbol) => symbol.label).join(", ")
        : "none"
    }`,
    `matchedCorpusSections: ${
      state.matchedCorpusSections.length
        ? state.matchedCorpusSections
            .map((section) => section.title)
            .join(", ")
        : "none"
    }`,
    `echoMeaning: ${state.echoMeaning}`
  ].join("\n")
}

export function getSymbolicEchoDetectorMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    normalized.includes("symbolic echo") ||
    normalized.includes("genesis echo") ||
    normalized.includes("seed echo") ||
    normalized.includes("echo count")
  ) {
    return "summary"
  }

  return null
}
