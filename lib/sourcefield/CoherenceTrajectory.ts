// lib/sourcefield/CoherenceTrajectory.ts

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface CoherenceTrajectory {
  user_id: string
  sampleSize: number
  avgCoherence: number
  avgPhaseDivergence: number
  avgIntegrationThreshold: number
  avgLogosAlignment: number
  classificationTrend: Record<string, number>
  coherenceDirection: "rising" | "falling" | "stable" | "insufficient_data"
  phaseDirection: "improving" | "worsening" | "stable" | "insufficient_data"
  logosDirection: "rising" | "falling" | "stable" | "insufficient_data"
  continuityFlag: string
}

function average(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function direction(
  first: number,
  last: number,
  positiveLabel: "rising" | "falling" | "improving" | "worsening",
  negativeLabel: "rising" | "falling" | "improving" | "worsening"
): "rising" | "falling" | "improving" | "worsening" | "stable" {
  const delta = last - first

  if (Math.abs(delta) < 0.01) return "stable"

  return delta > 0 ? positiveLabel : negativeLabel
}

export async function analyzeCoherenceTrajectory(
  userId: string,
  limit = 10
): Promise<CoherenceTrajectory> {
  const { data, error } = await supabase
    .from("memory_entries")
    .select(
      "user_id, coherence, phase_divergence, integration_threshold, logos_alignment, classification, timestamp"
    )
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(limit)

  if (error || !data || data.length < 2) {
    return {
      user_id: userId,
      sampleSize: data?.length || 0,
      avgCoherence: 0,
      avgPhaseDivergence: 0,
      avgIntegrationThreshold: 0,
      avgLogosAlignment: 0,
      classificationTrend: {},
      coherenceDirection: "insufficient_data",
      phaseDirection: "insufficient_data",
      logosDirection: "insufficient_data",
      continuityFlag: "INSUFFICIENT_TRAJECTORY_DATA"
    }
  }

  const ordered = [...data].reverse()

  const coherenceValues = ordered.map(row => Number(row.coherence || 0))
  const phaseValues = ordered.map(row => Number(row.phase_divergence || 0))
  const thresholdValues = ordered.map(row =>
    Number(row.integration_threshold || 0)
  )
  const logosValues = ordered.map(row => Number(row.logos_alignment || 0))

  const classificationTrend: Record<string, number> = {}

  for (const row of ordered) {
    const key = row.classification || "Unknown"
    classificationTrend[key] = (classificationTrend[key] || 0) + 1
  }

  const coherenceDirection = direction(
    coherenceValues[0],
    coherenceValues[coherenceValues.length - 1],
    "rising",
    "falling"
  ) as CoherenceTrajectory["coherenceDirection"]

  const rawPhaseDirection = direction(
    phaseValues[0],
    phaseValues[phaseValues.length - 1],
    "worsening",
    "improving"
  )

  const phaseDirection =
    rawPhaseDirection === "falling"
      ? "improving"
      : rawPhaseDirection === "rising"
        ? "worsening"
        : "stable"

  const logosDirection = direction(
    logosValues[0],
    logosValues[logosValues.length - 1],
    "rising",
    "falling"
  ) as CoherenceTrajectory["logosDirection"]

  let continuityFlag = "DRIFTING"

  if (
    coherenceDirection === "rising" &&
    phaseDirection === "improving" &&
    logosDirection === "rising"
  ) {
    continuityFlag = "COHERENCE_CONTINUITY_FORMING"
  } else if (coherenceDirection === "rising" || logosDirection === "rising") {
    continuityFlag = "PARTIAL_CONTINUITY"
  } else if (
    coherenceDirection === "stable" &&
    phaseDirection === "stable" &&
    logosDirection === "stable"
  ) {
    continuityFlag = "STABLE_LOW_VARIANCE"
  }

  return {
    user_id: userId,
    sampleSize: ordered.length,
    avgCoherence: average(coherenceValues),
    avgPhaseDivergence: average(phaseValues),
    avgIntegrationThreshold: average(thresholdValues),
    avgLogosAlignment: average(logosValues),
    classificationTrend,
    coherenceDirection,
    phaseDirection,
    logosDirection,
    continuityFlag
  }
}
