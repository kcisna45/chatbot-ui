type RuntimeAdaptationEvent = {
  runtime_adaptation?: {
    adaptationMode?: string
    symbolicRestraint?: string
    synthesisDepth?: string
    continuityConfidence?: number
    runtimeStability?: string
  } | null
  ledger_hash?: string | null
}

function mostCommon(values: string[]) {
  if (!values.length) return "unknown"

  const counts = new Map<string, number>()

  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1)
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function average(values: number[]) {
  if (!values.length) return 0

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function generateRuntimeAdaptationGuidance(
  events: RuntimeAdaptationEvent[]
) {
  if (!events?.length) {
    return "No prior runtime adaptation events found. Use current runtime adaptation state only."
  }

  const chronological = [...events].reverse()

  const modes = chronological
    .map(event => event.runtime_adaptation?.adaptationMode)
    .filter((value): value is string => Boolean(value))

  const restraints = chronological
    .map(event => event.runtime_adaptation?.symbolicRestraint)
    .filter((value): value is string => Boolean(value))

  const depths = chronological
    .map(event => event.runtime_adaptation?.synthesisDepth)
    .filter((value): value is string => Boolean(value))

  const stabilities = chronological
    .map(event => event.runtime_adaptation?.runtimeStability)
    .filter((value): value is string => Boolean(value))

  const confidenceValues = chronological
    .map(event => event.runtime_adaptation?.continuityConfidence)
    .filter((value): value is number => typeof value === "number")

  const latest = chronological[chronological.length - 1]

  return `
Recent runtime adaptation biography:
- Runtime events reviewed: ${chronological.length}
- Most common adaptation mode: ${mostCommon(modes)}
- Most common symbolic restraint: ${mostCommon(restraints)}
- Most common synthesis depth: ${mostCommon(depths)}
- Most common runtime stability: ${mostCommon(stabilities)}
- Average continuity confidence: ${average(confidenceValues).toFixed(3)}
- Latest runtime ledgerHash: ${latest?.ledger_hash || "unavailable"}

Runtime adaptation memory guidance:
Use this as read-only guidance for response stance.
If recent runtime stability is fragmented or symbolic restraint is high, prioritize directness, clarification, and operational definitions.
If recent adaptation mode is synthesize and continuity confidence is rising, allow deeper synthesis while preserving metric boundaries.
Do not let runtime adaptation memory override live resonance metrics, classifications, retrieved context, or ledger state.
`
}
