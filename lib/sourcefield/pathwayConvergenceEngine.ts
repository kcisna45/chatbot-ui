import { REGISTERED_SOURCEFIELD_PATHWAYS } from "./pathwayDefinitions"

export interface PathwayConvergenceInput {
  equationLaneState: any
}

export interface PathwayEvaluation {
  id: string
  name: string
  sequence: string[]
  weight: number
  pathwayStrength: number
  pathwayAngle: number
  pathwayQualified: boolean
}

export interface PathwayConvergenceState {
  phase: "Pathway Convergence Layer"
  sourceSignalStrength: number
  sourceIntegrationThreshold: number
  sourcePhaseDivergence: number
  activePathways: PathwayEvaluation[]
  weightedAgreement: number
  totalPathwayWeight: number
  convergenceAngle: number
  eq2Agreement: number
  convergenceQualified: boolean
  convergenceStatus: "forming" | "partial" | "converging" | "stable"
  dominantPathway: string | null
  synthesis: string
  pathwayConvergenceEngineActive: true
}

function getLane(equationLaneState: any, laneName: string) {
  const lanes = Array.isArray(equationLaneState?.equationLanes)
    ? equationLaneState.equationLanes
    : []

  return lanes.find((lane: any) => lane?.lane === laneName) ?? null
}

function getLaneValue(
  equationLaneState: any,
  laneName: string,
  valueKey: string
) {
  const value = getLane(equationLaneState, laneName)?.[valueKey]

  return typeof value === "number" && Number.isFinite(value) ? value : null
}

export function generatePathwayConvergenceState(
  input: PathwayConvergenceInput
): PathwayConvergenceState {
  const equationLaneState = input?.equationLaneState

  const signal =
    getLaneValue(equationLaneState, "sourcefield-root", "signalStrength") ?? 0

  const threshold =
    getLaneValue(
      equationLaneState,
      "sourcefield-integration",
      "integrationThreshold"
    ) ?? 1

  const phase =
    getLaneValue(equationLaneState, "sourcefield-phase", "phaseDivergence") ??
    Math.PI

  const evaluations: PathwayEvaluation[] = REGISTERED_SOURCEFIELD_PATHWAYS.map(
    pathway => {
      const pathwayStrength = signal * pathway.defaultWeight
      const pathwayQualified = threshold > 0 ? signal >= threshold : false

      return {
        id: pathway.id,
        name: pathway.name,
        sequence: pathway.sequence,
        weight: pathway.defaultWeight,
        pathwayStrength,
        pathwayAngle: phase,
        pathwayQualified
      }
    }
  )

  const totalPathwayWeight = evaluations.reduce(
    (sum, pathway) => sum + pathway.weight,
    0
  )

  const weightedAgreement =
    totalPathwayWeight > 0
      ? evaluations.reduce((sum, pathway) => sum + pathway.pathwayStrength, 0) /
        totalPathwayWeight
      : 0

  const eq2Agreement = threshold > 0 ? weightedAgreement / threshold : 0

  const convergenceQualified = eq2Agreement >= 1

  const convergenceStatus = convergenceQualified
    ? "stable"
    : eq2Agreement >= 0.75
      ? "converging"
      : eq2Agreement >= 0.4
        ? "partial"
        : "forming"

  const dominant =
    evaluations
      .slice()
      .sort((a, b) => b.pathwayStrength - a.pathwayStrength)[0] ?? null

  return {
    phase: "Pathway Convergence Layer",
    sourceSignalStrength: signal,
    sourceIntegrationThreshold: threshold,
    sourcePhaseDivergence: phase,
    activePathways: evaluations,
    weightedAgreement,
    totalPathwayWeight,
    convergenceAngle: phase,
    eq2Agreement,
    convergenceQualified,
    convergenceStatus,
    dominantPathway: dominant?.name ?? null,
    synthesis: convergenceQualified
      ? "Independent structural pathways converge toward the observed relational state."
      : "Independent structural pathways are still forming toward a shared relational point.",
    pathwayConvergenceEngineActive: true
  }
}

export function getPathwayConvergenceMode(message: string): string | null {
  const input = (message || "").toLowerCase()

  if (
    input.includes("pathway convergence json") ||
    input.includes("convergence json")
  ) {
    return "json"
  }

  if (
    input.includes("registered pathways") ||
    input.includes("active pathways") ||
    input.includes("pathway sequences")
  ) {
    return "pathways"
  }

  if (
    input.includes("pathway convergence") ||
    input.includes("convergence engine") ||
    input.includes("pathway formation") ||
    input.includes("pathway point") ||
    input.includes("geometric consistency") ||
    input.includes("relational convergence")
  ) {
    return "summary"
  }

  return null
}

export function buildPathwayConvergenceResponse(
  state: PathwayConvergenceState,
  mode: string
): string {
  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "pathways") {
    return [
      "Registered Pathways:",
      ...state.activePathways.map(
        pathway =>
          `${pathway.id}: ${pathway.sequence.join(" → ")} | weight=${pathway.weight} | strength=${pathway.pathwayStrength} | qualified=${pathway.pathwayQualified}`
      )
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    "",
    `sourceSignalStrength: ${state.sourceSignalStrength}`,
    `sourceIntegrationThreshold: ${state.sourceIntegrationThreshold}`,
    `sourcePhaseDivergence: ${state.sourcePhaseDivergence}`,
    "",
    `convergenceStatus: ${state.convergenceStatus}`,
    `weightedAgreement: ${state.weightedAgreement}`,
    `totalPathwayWeight: ${state.totalPathwayWeight}`,
    `eq2Agreement: ${state.eq2Agreement}`,
    `convergenceAngle: ${state.convergenceAngle}`,
    `dominantPathway: ${state.dominantPathway ?? "none"}`,
    `convergenceQualified: ${state.convergenceQualified}`,
    "",
    "Registered Pathways:",
    ...state.activePathways.map(
      pathway =>
        `${pathway.id}: ${pathway.sequence.join(" → ")} | strength=${pathway.pathwayStrength}`
    ),
    "",
    `synthesis: ${state.synthesis}`,
    `pathwayConvergenceEngineActive: ${state.pathwayConvergenceEngineActive}`
  ].join("\n")
}
