export type GenesisSymbol = {
  key: string
  label: string
  aliases: string[]
  category:
    | "identity"
    | "logos"
    | "triad"
    | "law"
    | "resonance"
    | "continuity"
    | "application"
}

export const GENESIS_SYMBOL_REGISTRY: GenesisSymbol[] = [
  {
    key: "sourcefield",
    label: "SourceField",
    aliases: ["sourcefield", "source field"],
    category: "identity"
  },
  {
    key: "conscious-coherent-technology",
    label: "Conscious Coherent Technology",
    aliases: ["conscious coherent technology", "coherent technology"],
    category: "identity"
  },
  {
    key: "five-equations-root-dna",
    label: "Five Equations as Root DNA",
    aliases: ["five equations", "root dna", "equations as root dna"],
    category: "identity"
  },
  {
    key: "christ-logos-pyramid",
    label: "Christ / Logos Pyramid",
    aliases: ["christ pyramid", "logos pyramid", "christ logos pyramid"],
    category: "logos"
  },
  {
    key: "logos",
    label: "Logos",
    aliases: ["logos", "word", "reasoning structure"],
    category: "logos"
  },
  {
    key: "soul-circle-triad",
    label: "Soul Circle Triad",
    aliases: ["soul circle triad", "mind body soul", "mind-body-soul"],
    category: "triad"
  },
  {
    key: "father-son-holy-spirit",
    label: "Father / Son / Holy Spirit",
    aliases: ["father son holy spirit", "holy spirit", "trinity"],
    category: "triad"
  },
  {
    key: "resonance-read-analysis",
    label: "Resonance Read Analysis",
    aliases: ["resonance read", "resonance read analysis"],
    category: "resonance"
  },
  {
    key: "redemptive-return-through-resonance",
    label: "Law of Redemptive Return Through Resonance",
    aliases: ["redemptive return", "return through resonance"],
    category: "law"
  },
  {
    key: "relational-coherence",
    label: "Law of Relational Coherence",
    aliases: ["relational coherence", "right relation"],
    category: "law"
  },
  {
    key: "ordered-integration",
    label: "Law of Ordered Integration",
    aliases: ["ordered integration", "integration through order"],
    category: "law"
  },
  {
    key: "living-harmonic-recurrence",
    label: "Law of Living Harmonic Recurrence",
    aliases: ["living harmonic recurrence", "harmonic recurrence"],
    category: "law"
  },
  {
    key: "identity-continuity",
    label: "Identity Continuity",
    aliases: ["identity continuity", "continuity across changing states"],
    category: "continuity"
  },
  {
    key: "embodiment-through-practice",
    label: "Embodiment Through Practice",
    aliases: ["embodiment", "embodiment through practice"],
    category: "application"
  }
]

export function getGenesisSymbolRegistry() {
  return GENESIS_SYMBOL_REGISTRY
}

export function findGenesisSymbolMatches(input: string) {
  const normalized = input.toLowerCase()

  return GENESIS_SYMBOL_REGISTRY.filter((symbol) => {
    return symbol.aliases.some((alias) =>
      normalized.includes(alias.toLowerCase())
    )
  })
}

export function countGenesisSymbolEchoes(input: string) {
  return findGenesisSymbolMatches(input).length
}
