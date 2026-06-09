import { getGenesisSymbolRegistry } from "./GenesisSymbolRegistry"
import { getGenesisCorpus, buildGenesisCorpusEchoSummary } from "./GenesisCorpus"
import {
  detectSymbolicEchoes,
  buildSymbolicEchoResponse
} from "./SymbolicEchoDetector"

export function generateGenesisReferenceState(input: string) {
  const registry = getGenesisSymbolRegistry()
  const corpus = getGenesisCorpus()
  const echoState = detectSymbolicEchoes(input)
  const corpusSummary = buildGenesisCorpusEchoSummary(input)

  return {
    phase: "Genesis Reference Engine",
    genesisReferenceActive: true,
    registrySymbolCount: registry.length,
    corpusSectionCount: corpus.length,
    symbolicEchoDetected: echoState.symbolicEchoDetected,
    symbolicEchoCount: echoState.symbolicEchoCount,
    matchedSymbols: echoState.matchedSymbols,
    matchedCorpusSections: echoState.matchedCorpusSections,
    corpusSummary,
    referenceMeaning: echoState.symbolicEchoDetected
      ? "Current input is resonating with the SourceField Genesis Seed symbolic architecture."
      : "Current input does not yet show a direct Genesis symbolic echo.",
    rule:
      "The Genesis Reference Engine is read-only. It can identify symbolic echoes against the SourceField Genesis Seed, but it must not override metrics, hashes, memory, classifications, retrieved context, user intent, or runtime state."
  }
}

export function buildGenesisReferenceResponse(input: string) {
  const state = generateGenesisReferenceState(input)

  return [
    `phase: ${state.phase}`,
    `genesisReferenceActive: ${state.genesisReferenceActive ? "true" : "false"}`,
    `registrySymbolCount: ${state.registrySymbolCount}`,
    `corpusSectionCount: ${state.corpusSectionCount}`,
    `symbolicEchoDetected: ${state.symbolicEchoDetected ? "true" : "false"}`,
    `symbolicEchoCount: ${state.symbolicEchoCount}`,
    `matchedSymbols: ${
      state.matchedSymbols.length
        ? state.matchedSymbols.map((symbol: any) => symbol.label).join(", ")
        : "none"
    }`,
    `matchedCorpusSections: ${
      state.matchedCorpusSections.length
        ? state.matchedCorpusSections
            .map((section: any) => section.title)
            .join(", ")
        : "none"
    }`,
    `referenceMeaning: ${state.referenceMeaning}`
  ].join("\n")
}

export function getGenesisReferenceMode(message: string) {
  const normalized = message.toLowerCase()

  if (
    normalized.includes("genesis reference") ||
    normalized.includes("genesis seed reference") ||
    normalized.includes("sourcefield genesis") ||
    normalized.includes("genesis symbolic") ||
    normalized.includes("symbolic echo") ||
    normalized.includes("seed echo")
  ) {
    return "summary"
  }

  return null
}
