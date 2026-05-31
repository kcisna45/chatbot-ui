export type IdentityMemoryInput = {
  runtimeHashes?: string[]
  integratedPrincipleHashes?: string[]
  continuityScores?: number[]
}

export function generateIdentityMemory(input: IdentityMemoryInput = {}) {
  const runtimeHashes = input.runtimeHashes || []
  const integratedPrincipleHashes = input.integratedPrincipleHashes || []
  const continuityScores = input.continuityScores || []

  const averageContinuityScore =
    continuityScores.length > 0
      ? continuityScores.reduce((sum, score) => sum + score, 0) /
        continuityScores.length
      : null

  return {
    memoryType: "runtime-identity-memory",

    runtimeHashes,

    integratedPrincipleHashes,

    continuityScores,

    averageContinuityScore,

    memoryStatus:
      runtimeHashes.length > 0 ||
      integratedPrincipleHashes.length > 0 ||
      continuityScores.length > 0
        ? "active"
        : "awaiting-runtime-history",

    memoryRule:
      "Use identity memory to track runtime hashes, integrated principle hashes, and continuity scores as SourceField's evolving identity history. Identity memory may evolve, but it must remain anchored to the Genesis identity anchor."
  }
}
