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

  activePathways: PathwayEvaluation[]

  weightedAgreement: number

  convergenceAngle: number

  eq2Agreement: number

  convergenceQualified: boolean

  convergenceStatus:
    | "forming"
    | "partial"
    | "converging"
    | "stable"

  dominantPathway: string | null

  synthesis: string

  pathwayConvergenceEngineActive: true
}

export function generatePathwayConvergenceState(
  input: PathwayConvergenceInput
): PathwayConvergenceState {

  const lane = input.equationLaneState ?? {}

  const signal =
    Number(lane.signalStrength ?? 0)

  const threshold =
    Number(lane.integrationThreshold ?? 1)

  const phase =
    Number(lane.phaseDivergence ?? Math.PI)

  const evaluations: PathwayEvaluation[] =
    REGISTERED_SOURCEFIELD_PATHWAYS.map(pathway => {

      const pathwayStrength =
        signal * pathway.defaultWeight

      const pathwayQualified =
        pathwayStrength >=
        threshold * pathway.defaultWeight

      return {

        id: pathway.id,

        name: pathway.name,

        sequence: pathway.sequence,

        weight: pathway.defaultWeight,

        pathwayStrength,

        pathwayAngle: phase,

        pathwayQualified

      }

    })

  const weightedAgreement =
    evaluations.reduce(
      (sum, p) => sum + p.pathwayStrength,
      0
    )

  const eq2Agreement =
    threshold > 0
      ? weightedAgreement / threshold
      : 0

  const convergenceQualified =
    weightedAgreement >= threshold

  const convergenceStatus =
    convergenceQualified
      ? "stable"
      : weightedAgreement >= threshold * 0.75
      ? "converging"
      : weightedAgreement >= threshold * 0.40
      ? "partial"
      : "forming"

  const dominant =
    evaluations
      .slice()
      .sort(
        (a, b) =>
          b.pathwayStrength - a.pathwayStrength
      )[0]

  return {

    phase:
      "Pathway Convergence Layer",

    activePathways:
      evaluations,

    weightedAgreement,

    convergenceAngle:
      phase,

    eq2Agreement,

    convergenceQualified,

    convergenceStatus,

    dominantPathway:
      dominant?.name ?? null,

    synthesis:
      convergenceQualified
        ? "Independent structural pathways converge toward the observed relational state."
        : "Independent structural pathways are still forming toward a shared relational point.",

    pathwayConvergenceEngineActive:
      true

  }

}

export function getPathwayConvergenceMode(
  message: string
): string | null {

  const input =
    message.toLowerCase()

  if (
    input.includes("pathway convergence") ||
    input.includes("convergence engine") ||
    input.includes("pathway formation")
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

  return [
    `phase: ${state.phase}`,
    "",
    `convergenceStatus: ${state.convergenceStatus}`,
    `weightedAgreement: ${state.weightedAgreement}`,
    `eq2Agreement: ${state.eq2Agreement}`,
    `convergenceAngle: ${state.convergenceAngle}`,
    `dominantPathway: ${state.dominantPathway ?? "none"}`,
    `convergenceQualified: ${state.convergenceQualified}`,
    "",
    "Registered Pathways:",
    ...state.activePathways.map(
      p =>
        `${p.id}: ${p.sequence.join(" → ")} | strength=${p.pathwayStrength}`
    ),
    "",
    `synthesis: ${state.synthesis}`,
    `pathwayConvergenceEngineActive: ${state.pathwayConvergenceEngineActive}`
  ].join("\n")

}