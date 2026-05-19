type LedgerEvent = {
  classification?: string | null
  coherence?: number | null
  phase_divergence?: number | null
  integration_threshold?: number | null
  resonance_level?: number | null
  ledger_hash?: string | null
}

function trend(values: number[]) {
  if (values.length < 2) return "insufficient data"

  const first = values[0]
  const last = values[values.length - 1]
  const delta = last - first

  if (delta > 0.05) return "rising"
  if (delta < -0.05) return "falling"
  return "stable"
}

export function generateContinuityGuidance(events: LedgerEvent[]) {
  if (!events?.length) {
    return "No prior coherence biography events found. Use current live resonance state only."
  }

  const chronological = [...events].reverse()

  const coherenceValues = chronological
    .map(event => event.coherence)
    .filter((value): value is number => typeof value === "number")

  const phaseValues = chronological
    .map(event => event.phase_divergence)
    .filter((value): value is number => typeof value === "number")

  const latest = chronological[chronological.length - 1]

  return `
Recent continuity biography:
- Events reviewed: ${chronological.length}
- Latest classification: ${latest?.classification || "unknown"}
- Coherence trend: ${trend(coherenceValues)}
- Phase divergence trend: ${trend(phaseValues)}
- Latest ledgerHash: ${latest?.ledger_hash || "unavailable"}

Runtime guidance:
Use recent coherence biography as context only. Do not override live resonance metrics.
If coherence is low or phase divergence is high, prioritize clarification, operational definitions, and reduced symbolic inflation.
If coherence is rising, preserve continuity while still checking C(t), Δφ(t), Θ, symbolicEchoes, and classification.
`
}
