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

function weightedMostCommon(values: string[]) {
  if (!values.length) return "unknown"

  const scores = new Map<string, number>()

  values.forEach((value, index) => {
    const weight = index + 1
    scores.set(value, (scores.get(value) || 0) + weight)
  })

  return [...scores.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function weightedAverage(values: number[]) {
  if (!values.length) return 0

  let weightedSum = 0
  let weightTotal = 0

  values.forEach((value, index) => {
    const weight = index + 1
    weightedSum += value * weight
    weightTotal += weight
  })

  return weightedSum / weightTotal
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
- Weighted adaptation mode: ${weightedMostCommon(modes)}
- Weighted symbolic restraint: ${weightedMostCommon(restraints)}
- Weighted synthesis depth: ${weightedMostCommon(depths)}
- Weighted runtime stability: ${weightedMostCommon(stabilities)}
- Weighted continuity confidence: ${weightedAverage(confidenceValues).toFixed(3)}
- Latest runtime ledgerHash: ${latest?.ledger_hash || "unavailable"}

Runtime adaptation memory guidance:
Use newer runtime adaptation events as stronger guidance than older events.
If recent runtime stability is fragmented or symbolic restraint is high, prioritize directness, clarification, and operational definitions.
If recent adaptation mode is synthesize and weighted continuity confidence is rising, allow deeper synthesis while preserving metric boundaries.
Do not let runtime adaptation memory override live resonance metrics, classifications, retrieved context, or ledger state.
`
}
