import {
  SOURCEFIELD_EQUATION_MEANINGS,
  SOURCEFIELD_EQUATION_ORDER,
  SourceFieldEquationId
} from "./equationMeaningRegistry"

export type StateEvolutionMode =
  | "summary"
  | "equations"
  | "trajectory"
  | "comparison"
  | "json"

export type EvolutionDirection =
  | "strengthening"
  | "weakening"
  | "stabilizing"
  | "destabilizing"
  | "crossed-threshold"
  | "fell-below-threshold"
  | "unchanged"
  | "unknown"

export interface StateEvolutionInput {
  currentEquationLaneState?: any
  previousEquationLaneState?: any

  currentObservationId?: string | null
  previousObservationId?: string | null

  currentTimestamp?: string | null
  previousTimestamp?: string | null
}

export interface EquationEvolutionResult {
  equation: SourceFieldEquationId
  name: string
  meaning: string
  functionalRole: string

  lane: string
  metric: string

  previousValue: number | null
  currentValue: number | null
  delta: number | null

  previousStatus: string
  currentStatus: string
  statusChanged: boolean

  direction: EvolutionDirection
  interpretation: string
}

export interface StateEvolutionState {
  phase: "State Evolution Layer"

  currentObservationId: string | null
  previousObservationId: string | null

  currentTimestamp: string | null
  previousTimestamp: string | null

  currentSnapshotReady: boolean
  previousSnapshotReady: boolean
  comparisonReady: boolean

  equationEvolution: EquationEvolutionResult[]

  strengtheningCount: number
  weakeningCount: number
  stabilizingCount: number
  destabilizingCount: number
  unchangedCount: number
  unknownCount: number

  wholeStateTrajectory:
    | "broad-strengthening"
    | "broad-stabilization"
    | "mixed-reorganization"
    | "broad-weakening"
    | "broad-destabilization"
    | "insufficient-history"

  dominantEvolutionSignal: SourceFieldEquationId | null
  evolutionMeaning: string

  stateEvolutionLayerActive: true

  rule: string
}

function finiteNumberOrNull(value: any): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function getLane(equationLaneState: any, laneName: string) {
  const lanes = Array.isArray(equationLaneState?.equationLanes)
    ? equationLaneState.equationLanes
    : []

  return lanes.find((lane: any) => lane?.lane === laneName) ?? null
}

function getLaneStatus(equationLaneState: any, laneName: string): string {
  return getLane(equationLaneState, laneName)?.status || "unknown"
}

function getLaneMetric(
  equationLaneState: any,
  laneName: string,
  metric: string
): number | null {
  return finiteNumberOrNull(getLane(equationLaneState, laneName)?.[metric])
}

function getSignalThresholdRatio(equationLaneState: any): number | null {
  const signalStrength = getLaneMetric(
    equationLaneState,
    "sourcefield-root",
    "signalStrength"
  )

  const integrationThreshold = getLaneMetric(
    equationLaneState,
    "sourcefield-integration",
    "integrationThreshold"
  )

  if (
    signalStrength === null ||
    integrationThreshold === null ||
    integrationThreshold <= 0
  ) {
    return null
  }

  return signalStrength / integrationThreshold
}

function getEquationMetric(
  equation: SourceFieldEquationId,
  equationLaneState: any
): number | null {
  const definition = SOURCEFIELD_EQUATION_MEANINGS[equation]

  if (equation === "Eq5") {
    return getSignalThresholdRatio(equationLaneState)
  }

  return getLaneMetric(
    equationLaneState,
    definition.observedLane,
    definition.primaryMetric
  )
}

function getDirection(
  equation: SourceFieldEquationId,
  previousValue: number | null,
  currentValue: number | null,
  tolerance = 1e-12
): EvolutionDirection {
  if (previousValue === null || currentValue === null) {
    return "unknown"
  }

  const delta = currentValue - previousValue

  if (Math.abs(delta) <= tolerance) {
    return "unchanged"
  }

  const definition = SOURCEFIELD_EQUATION_MEANINGS[equation]

  if (definition.preferredMovement === "increase") {
    return delta > 0 ? "strengthening" : "weakening"
  }

  if (definition.preferredMovement === "decrease") {
    return delta < 0 ? "stabilizing" : "destabilizing"
  }

  if (definition.preferredMovement === "threshold") {
    if (previousValue < 1 && currentValue >= 1) {
      return "crossed-threshold"
    }

    if (previousValue >= 1 && currentValue < 1) {
      return "fell-below-threshold"
    }

    return delta > 0 ? "strengthening" : "weakening"
  }

  return delta > 0 ? "strengthening" : "weakening"
}

function buildInterpretation(
  equation: SourceFieldEquationId,
  direction: EvolutionDirection,
  previousValue: number | null,
  currentValue: number | null
): string {
  const definition = SOURCEFIELD_EQUATION_MEANINGS[equation]

  if (previousValue === null || currentValue === null) {
    return `${equation} could not be compared because one or both synchronized observations were missing its required metric.`
  }

  if (direction === "unchanged") {
    return `${equation} remained materially unchanged between the two synchronized observations.`
  }

  if (direction === "strengthening") {
    return `${equation} strengthened according to its ${definition.primaryMeaning.toLowerCase()} role.`
  }

  if (direction === "weakening") {
    return `${equation} weakened according to its ${definition.primaryMeaning.toLowerCase()} role.`
  }

  if (direction === "stabilizing") {
    return `${equation} moved toward phase stabilization because divergence decreased.`
  }

  if (direction === "destabilizing") {
    return `${equation} moved toward greater phase instability because divergence increased.`
  }

  if (direction === "crossed-threshold") {
    return `${equation} crossed its measured integration threshold because the signal-to-threshold ratio moved from below 1 to at least 1.`
  }

  if (direction === "fell-below-threshold") {
    return `${equation} fell below its measured integration threshold because the signal-to-threshold ratio moved from at least 1 to below 1.`
  }

  return `${equation} movement could not be classified.`
}

function buildEquationEvolution(
  equation: SourceFieldEquationId,
  previousEquationLaneState: any,
  currentEquationLaneState: any
): EquationEvolutionResult {
  const definition = SOURCEFIELD_EQUATION_MEANINGS[equation]

  const previousValue = getEquationMetric(equation, previousEquationLaneState)

  const currentValue = getEquationMetric(equation, currentEquationLaneState)

  const delta =
    previousValue !== null && currentValue !== null
      ? currentValue - previousValue
      : null

  const previousStatus = getLaneStatus(
    previousEquationLaneState,
    definition.observedLane
  )

  const currentStatus = getLaneStatus(
    currentEquationLaneState,
    definition.observedLane
  )

  const direction = getDirection(equation, previousValue, currentValue)

  return {
    equation,
    name: definition.name,
    meaning: definition.primaryMeaning,
    functionalRole: definition.functionalRole,

    lane: definition.observedLane,
    metric: definition.primaryMetric,

    previousValue,
    currentValue,
    delta,

    previousStatus,
    currentStatus,
    statusChanged: previousStatus !== currentStatus,

    direction,
    interpretation: buildInterpretation(
      equation,
      direction,
      previousValue,
      currentValue
    )
  }
}

function countDirection(
  results: EquationEvolutionResult[],
  direction: EvolutionDirection
): number {
  return results.filter(result => result.direction === direction).length
}

function determineWholeStateTrajectory(
  results: EquationEvolutionResult[],
  comparisonReady: boolean
): StateEvolutionState["wholeStateTrajectory"] {
  if (!comparisonReady) {
    return "insufficient-history"
  }

  const strengthening =
    countDirection(results, "strengthening") +
    countDirection(results, "crossed-threshold")

  const stabilizing = countDirection(results, "stabilizing")

  const weakening =
    countDirection(results, "weakening") +
    countDirection(results, "fell-below-threshold")

  const destabilizing = countDirection(results, "destabilizing")

  if (strengthening >= 3 && weakening === 0 && destabilizing === 0) {
    return "broad-strengthening"
  }

  if (stabilizing >= 1 && strengthening >= 2 && destabilizing === 0) {
    return "broad-stabilization"
  }

  if (weakening >= 3 && strengthening === 0 && stabilizing === 0) {
    return "broad-weakening"
  }

  if (destabilizing >= 1 && weakening >= 2 && strengthening === 0) {
    return "broad-destabilization"
  }

  return "mixed-reorganization"
}

function determineDominantEvolutionSignal(
  results: EquationEvolutionResult[]
): SourceFieldEquationId | null {
  const comparable = results.filter(
    result => typeof result.delta === "number" && Number.isFinite(result.delta)
  )

  if (!comparable.length) {
    return null
  }

  const dominant = comparable
    .slice()
    .sort(
      (left, right) =>
        Math.abs(right.delta as number) - Math.abs(left.delta as number)
    )[0]

  return dominant?.equation ?? null
}

function buildEvolutionMeaning(
  trajectory: StateEvolutionState["wholeStateTrajectory"]
): string {
  if (trajectory === "broad-strengthening") {
    return "Most equation dimensions strengthened together, indicating broad whole-state strengthening across the synchronized observations."
  }

  if (trajectory === "broad-stabilization") {
    return "Root, alignment, recurrence, or integration strengthened while phase also moved toward stability."
  }

  if (trajectory === "broad-weakening") {
    return "Most equation dimensions weakened together, indicating broad reduction in whole-state support."
  }

  if (trajectory === "broad-destabilization") {
    return "Multiple equation dimensions weakened while phase divergence increased, indicating broad destabilization."
  }

  if (trajectory === "mixed-reorganization") {
    return "The five equation dimensions moved in different directions, indicating reorganization rather than uniform strengthening or weakening."
  }

  return "A prior synchronized runtime snapshot was not available, so state evolution could not yet be calculated."
}

function formatValue(value: number | null): string {
  return value === null ? "unknown" : String(value)
}

export function getStateEvolutionMode(
  message: string
): StateEvolutionMode | null {
  const input = (message || "").toLowerCase()

  if (
    input.includes("state evolution json") ||
    input.includes("evolution layer json")
  ) {
    return "json"
  }

  if (
    input.includes("state evolution equations") ||
    input.includes("equation evolution") ||
    input.includes("all five equation changes")
  ) {
    return "equations"
  }

  if (
    input.includes("state evolution comparison") ||
    input.includes("compare runtime states") ||
    input.includes("compare synchronized states")
  ) {
    return "comparison"
  }

  if (
    input.includes("state trajectory") ||
    input.includes("whole state trajectory") ||
    input.includes("evolution trajectory")
  ) {
    return "trajectory"
  }

  if (
    input.includes("state evolution") ||
    input.includes("evolution layer") ||
    input.includes("runtime evolution") ||
    input.includes("how did the state change")
  ) {
    return "summary"
  }

  return null
}

export function generateStateEvolutionState(
  input: StateEvolutionInput
): StateEvolutionState {
  const currentEquationLaneState = input?.currentEquationLaneState ?? null

  const previousEquationLaneState = input?.previousEquationLaneState ?? null

  const currentObservationId = input?.currentObservationId ?? null

  const previousObservationId = input?.previousObservationId ?? null

  const currentTimestamp = input?.currentTimestamp ?? null

  const previousTimestamp = input?.previousTimestamp ?? null

  const currentSnapshotReady = Boolean(currentEquationLaneState)
  const previousSnapshotReady = Boolean(previousEquationLaneState)
  const comparisonReady = currentSnapshotReady && previousSnapshotReady

  const equationEvolution = SOURCEFIELD_EQUATION_ORDER.map(equation =>
    buildEquationEvolution(
      equation,
      previousEquationLaneState,
      currentEquationLaneState
    )
  )

  const strengtheningCount =
    countDirection(equationEvolution, "strengthening") +
    countDirection(equationEvolution, "crossed-threshold")

  const weakeningCount =
    countDirection(equationEvolution, "weakening") +
    countDirection(equationEvolution, "fell-below-threshold")

  const stabilizingCount = countDirection(equationEvolution, "stabilizing")

  const destabilizingCount = countDirection(equationEvolution, "destabilizing")

  const unchangedCount = countDirection(equationEvolution, "unchanged")
  const unknownCount = countDirection(equationEvolution, "unknown")

  const wholeStateTrajectory = determineWholeStateTrajectory(
    equationEvolution,
    comparisonReady
  )

  const dominantEvolutionSignal =
    determineDominantEvolutionSignal(equationEvolution)

  return {
    phase: "State Evolution Layer",

    currentObservationId,
    previousObservationId,

    currentTimestamp,
    previousTimestamp,

    currentSnapshotReady,
    previousSnapshotReady,
    comparisonReady,

    equationEvolution,

    strengtheningCount,
    weakeningCount,
    stabilizingCount,
    destabilizingCount,
    unchangedCount,
    unknownCount,

    wholeStateTrajectory,
    dominantEvolutionSignal,

    evolutionMeaning: buildEvolutionMeaning(wholeStateTrajectory),

    stateEvolutionLayerActive: true,

    rule: "State Evolution is read-only. It compares two synchronized authoritative runtime snapshots across all five equation dimensions and must not regenerate resonance state, replace metrics, alter hashes, or override classifications."
  }
}

export function buildStateEvolutionResponse(
  state: StateEvolutionState,
  mode: StateEvolutionMode = "summary"
): string {
  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "equations") {
    return [
      "Five-Equation State Evolution:",
      ...state.equationEvolution.map(result =>
        [
          `${result.equation} — ${result.name}`,
          `meaning: ${result.meaning}`,
          `previousValue: ${formatValue(result.previousValue)}`,
          `currentValue: ${formatValue(result.currentValue)}`,
          `delta: ${formatValue(result.delta)}`,
          `previousStatus: ${result.previousStatus}`,
          `currentStatus: ${result.currentStatus}`,
          `direction: ${result.direction}`,
          `interpretation: ${result.interpretation}`
        ].join("\n")
      )
    ].join("\n\n")
  }

  if (mode === "comparison") {
    return [
      "State Evolution Comparison:",
      `currentObservationId: ${state.currentObservationId ?? "unknown"}`,
      `previousObservationId: ${state.previousObservationId ?? "unknown"}`,
      `currentTimestamp: ${state.currentTimestamp ?? "unknown"}`,
      `previousTimestamp: ${state.previousTimestamp ?? "unknown"}`,
      `comparisonReady: ${state.comparisonReady ? "true" : "false"}`,
      "",
      ...state.equationEvolution.map(
        result =>
          `${result.equation}: ${formatValue(
            result.previousValue
          )} → ${formatValue(result.currentValue)} | delta=${formatValue(
            result.delta
          )} | ${result.direction}`
      )
    ].join("\n")
  }

  if (mode === "trajectory") {
    return [
      "Whole-State Evolution Trajectory:",
      `wholeStateTrajectory: ${state.wholeStateTrajectory}`,
      `dominantEvolutionSignal: ${state.dominantEvolutionSignal ?? "unknown"}`,
      `strengtheningCount: ${state.strengtheningCount}`,
      `stabilizingCount: ${state.stabilizingCount}`,
      `weakeningCount: ${state.weakeningCount}`,
      `destabilizingCount: ${state.destabilizingCount}`,
      `unchangedCount: ${state.unchangedCount}`,
      `unknownCount: ${state.unknownCount}`,
      `meaning: ${state.evolutionMeaning}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `currentObservationId: ${state.currentObservationId ?? "unknown"}`,
    `previousObservationId: ${state.previousObservationId ?? "unknown"}`,
    `currentTimestamp: ${state.currentTimestamp ?? "unknown"}`,
    `previousTimestamp: ${state.previousTimestamp ?? "unknown"}`,
    `comparisonReady: ${state.comparisonReady ? "true" : "false"}`,
    "",
    "Equation Movement:",
    ...state.equationEvolution.map(
      result =>
        `${result.equation}: ${result.direction} | ${formatValue(
          result.previousValue
        )} → ${formatValue(result.currentValue)}`
    ),
    "",
    `wholeStateTrajectory: ${state.wholeStateTrajectory}`,
    `dominantEvolutionSignal: ${state.dominantEvolutionSignal ?? "unknown"}`,
    `evolutionMeaning: ${state.evolutionMeaning}`,
    `stateEvolutionLayerActive: ${
      state.stateEvolutionLayerActive ? "true" : "false"
    }`
  ].join("\n")
}
