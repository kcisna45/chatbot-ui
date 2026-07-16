import type { EquationEngineObservation } from "./equationEngineObservation"

export type EquationEngineLifecycleMode =
  | "summary"
  | "pathways"
  | "closure"
  | "metrics"
  | "json"

export type SourceFieldLifecycleEquation = "Eq2" | "Eq3" | "Eq4" | "Eq5"

export type LifecycleStatus =
  | "incomplete"
  | "forming"
  | "relationally-established"
  | "recurrence-forming"
  | "closure-ready"
  | "closed"

export interface EquationMetricReading {
  equation: SourceFieldLifecycleEquation
  meaning: string
  rawValue: number | null
  normalizedValue: number | null
  available: boolean
}

export interface LifecyclePathwayStage {
  stageIndex: number
  equation: SourceFieldLifecycleEquation
  equationMeaning: string

  rawMetric: number | null
  normalizedMetric: number | null

  incomingCarry: number | null
  outgoingCarry: number | null

  stageAvailable: boolean
  stageMeaning: string
}

export interface LifecyclePathwayResult {
  id: "eq5-eq2" | "eq5-eq3-eq2-eq4"

  name: "Integrated Relational Reference" | "Integrated Evolutionary Recurrence"

  sequence: SourceFieldLifecycleEquation[]

  stages: LifecyclePathwayStage[]

  pathwayScore: number | null
  pathwayAvailable: boolean
  pathwayQualified: boolean

  pathwayMeaning: string
}

export interface EquationEngineObservationLifecycleInput {
  currentObservation?: EquationEngineObservation | null
  previousObservation?: EquationEngineObservation | null

  /**
   * When false, the engine may report closure readiness,
   * but it must not label the lifecycle as actually closed.
   */
  closureCommitted?: boolean
}

export interface EquationEngineObservationLifecycleState {
  phase: "Equation Engine Observation Lifecycle"

  symbolicOperation: "(5/2) (5/3/2/4))"

  currentObservationId: string | null
  previousObservationId: string | null

  currentObservationReady: boolean
  previousObservationReady: boolean
  comparisonReady: boolean

  equationMetrics: {
    Eq2: EquationMetricReading
    Eq3: EquationMetricReading
    Eq4: EquationMetricReading
    Eq5: EquationMetricReading
  }

  integratedRelationalReference: LifecyclePathwayResult
  integratedEvolutionaryRecurrence: LifecyclePathwayResult

  relationalReferenceScore: number | null
  evolutionaryRecurrenceScore: number | null

  lifecycleScore: number | null

  pathwayClosureReady: boolean
  enclosingLifecycleClosureReady: boolean
  closureCommitted: boolean

  doubleClosure: {
    firstClosure: "pathway-open" | "pathway-closed"

    secondClosure: "lifecycle-open" | "lifecycle-ready" | "lifecycle-closed"

    meaning: string
  }

  lifecycleStatus: LifecycleStatus

  lifecycleMeaning: string

  equationEngineObservationLifecycleActive: true

  rule: string
}

const EPSILON = 1e-12

const EQUATION_MEANINGS: Record<SourceFieldLifecycleEquation, string> = {
  Eq2: "Relational coherence, present alignment, and agreement between active states.",

  Eq3: "Phase movement, difference, transition, and divergence through changing conditions.",

  Eq4: "Harmonic recurrence, repeating pattern support, and structural formation across observations.",

  Eq5: "Integration, persistence, threshold qualification, and whole-state support."
}

function finiteNumberOrNull(value: any): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function getEquationLaneState(
  observation?: EquationEngineObservation | null
): any {
  return observation?.equationCore?.equationLaneState ?? null
}

function getLane(equationLaneState: any, laneName: string): any {
  const lanes = Array.isArray(equationLaneState?.equationLanes)
    ? equationLaneState.equationLanes
    : []

  return lanes.find((lane: any) => lane?.lane === laneName) ?? null
}

function getLaneMetric(
  equationLaneState: any,
  laneName: string,
  metricName: string
): number | null {
  return finiteNumberOrNull(getLane(equationLaneState, laneName)?.[metricName])
}

/**
 * Eq2 coherence is expected in the approximate range
 * -1 to 1. It is translated into a bounded 0 to 1
 * relational-alignment value.
 */
function normalizeEq2Coherence(coherence: number | null): number | null {
  if (coherence === null) {
    return null
  }

  return clamp((coherence + 1) / 2)
}

/**
 * Eq3 improves as divergence falls.
 *
 * 0 radians becomes full phase support.
 * PI radians becomes no measured phase support.
 */
function normalizeEq3Phase(phaseDivergence: number | null): number | null {
  if (phaseDivergence === null) {
    return null
  }

  return clamp(1 - phaseDivergence / Math.PI)
}

/**
 * Eq4 uses symbolic echo count as the available
 * recurrence indicator.
 *
 * count / (count + 1) keeps the value bounded:
 *
 * 0 echoes → 0
 * 1 echo   → 0.5
 * 2 echoes → 0.667
 * 3 echoes → 0.75
 */
function normalizeEq4Recurrence(
  symbolicEchoCount: number | null
): number | null {
  if (symbolicEchoCount === null) {
    return null
  }

  const count = Math.max(0, symbolicEchoCount)

  return count / (count + 1)
}

/**
 * Eq5 is represented by the ratio between available
 * root signal and the integration threshold.
 *
 * A ratio of 1 means threshold support has been met.
 * Ratios above 1 remain qualified but are bounded at 1
 * for pathway composition.
 */
function normalizeEq5Integration(
  signalStrength: number | null,
  integrationThreshold: number | null
): {
  rawRatio: number | null
  normalizedValue: number | null
} {
  if (
    signalStrength === null ||
    integrationThreshold === null ||
    integrationThreshold <= EPSILON
  ) {
    return {
      rawRatio: null,
      normalizedValue: null
    }
  }

  const rawRatio = signalStrength / integrationThreshold

  return {
    rawRatio,
    normalizedValue: clamp(rawRatio)
  }
}

function readEquationMetrics(
  currentObservation?: EquationEngineObservation | null
): EquationEngineObservationLifecycleState["equationMetrics"] {
  const equationLaneState = getEquationLaneState(currentObservation)

  const coherence = getLaneMetric(
    equationLaneState,
    "sourcefield-alignment",
    "coherence"
  )

  const phaseDivergence = getLaneMetric(
    equationLaneState,
    "sourcefield-phase",
    "phaseDivergence"
  )

  const symbolicEchoCount = getLaneMetric(
    equationLaneState,
    "sourcefield-harmonic",
    "symbolicEchoCount"
  )

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

  const eq5 = normalizeEq5Integration(signalStrength, integrationThreshold)

  return {
    Eq2: {
      equation: "Eq2",
      meaning: EQUATION_MEANINGS.Eq2,
      rawValue: coherence,
      normalizedValue: normalizeEq2Coherence(coherence),
      available: coherence !== null
    },

    Eq3: {
      equation: "Eq3",
      meaning: EQUATION_MEANINGS.Eq3,
      rawValue: phaseDivergence,
      normalizedValue: normalizeEq3Phase(phaseDivergence),
      available: phaseDivergence !== null
    },

    Eq4: {
      equation: "Eq4",
      meaning: EQUATION_MEANINGS.Eq4,
      rawValue: symbolicEchoCount,
      normalizedValue: normalizeEq4Recurrence(symbolicEchoCount),
      available: symbolicEchoCount !== null
    },

    Eq5: {
      equation: "Eq5",
      meaning: EQUATION_MEANINGS.Eq5,
      rawValue: eq5.rawRatio,
      normalizedValue: eq5.normalizedValue,
      available: eq5.rawRatio !== null
    }
  }
}

/**
 * Sequential carry makes equation order operationally
 * meaningful.
 *
 * First equation:
 *   carry = equation value
 *
 * Every following equation:
 *   carry = average(previous carry, equation value)
 *
 * Therefore:
 *
 * Eq5 → Eq3 → Eq2 → Eq4
 *
 * is evaluated as an ordered propagation rather than an
 * unordered sum.
 */
function propagateCarry(
  incomingCarry: number | null,
  equationValue: number | null
): number | null {
  if (equationValue === null) {
    return null
  }

  if (incomingCarry === null) {
    return equationValue
  }

  return (incomingCarry + equationValue) / 2
}

function buildStageMeaning(
  equation: SourceFieldLifecycleEquation,
  incomingCarry: number | null,
  outgoingCarry: number | null
): string {
  if (outgoingCarry === null) {
    return `${equation} could not propagate because its required metric was unavailable.`
  }

  if (incomingCarry === null) {
    return `${equation} establishes the starting carry for this ordered pathway.`
  }

  if (equation === "Eq2") {
    return "Eq2 receives the existing carry and translates it into a relationally aligned pathway state."
  }

  if (equation === "Eq3") {
    return "Eq3 carries the integrated state through measured phase movement and transition."
  }

  if (equation === "Eq4") {
    return "Eq4 receives the transitioned relational state and tests whether it closes into harmonic recurrence."
  }

  return "Eq5 supplies integrated threshold support to the ordered pathway."
}

function buildPathway(
  id: LifecyclePathwayResult["id"],
  name: LifecyclePathwayResult["name"],
  sequence: SourceFieldLifecycleEquation[],
  metrics: EquationEngineObservationLifecycleState["equationMetrics"]
): LifecyclePathwayResult {
  let carry: number | null = null

  const stages: LifecyclePathwayStage[] = sequence.map((equation, index) => {
    const metric = metrics[equation]
    const incomingCarry = carry

    const outgoingCarry = propagateCarry(incomingCarry, metric.normalizedValue)

    carry = outgoingCarry

    return {
      stageIndex: index + 1,
      equation,
      equationMeaning: metric.meaning,

      rawMetric: metric.rawValue,
      normalizedMetric: metric.normalizedValue,

      incomingCarry,
      outgoingCarry,

      stageAvailable: metric.available && outgoingCarry !== null,

      stageMeaning: buildStageMeaning(equation, incomingCarry, outgoingCarry)
    }
  })

  const pathwayAvailable = stages.every(stage => stage.stageAvailable)

  const pathwayScore = pathwayAvailable ? carry : null

  const pathwayQualified = pathwayScore !== null && pathwayScore >= 0.5

  const pathwayMeaning =
    id === "eq5-eq2"
      ? pathwayQualified
        ? "The integrated Equation Engine observation established a relational reference with sufficient measured support."
        : "The integrated Equation Engine observation has not yet established a sufficiently supported relational reference."
      : pathwayQualified
        ? "The integrated observation propagated through phase, relational alignment, and harmonic recurrence with sufficient measured support."
        : "The evolutionary recurrence pathway remains incomplete or below its current qualification point."

  return {
    id,
    name,
    sequence,
    stages,
    pathwayScore,
    pathwayAvailable,
    pathwayQualified,
    pathwayMeaning
  }
}

function calculateLifecycleScore(
  relationalReferenceScore: number | null,
  evolutionaryRecurrenceScore: number | null
): number | null {
  if (
    relationalReferenceScore === null ||
    evolutionaryRecurrenceScore === null
  ) {
    return null
  }

  return (relationalReferenceScore + evolutionaryRecurrenceScore) / 2
}

function determineLifecycleStatus(input: {
  currentObservationReady: boolean
  comparisonReady: boolean
  relationalReferenceQualified: boolean
  evolutionaryRecurrenceQualified: boolean
  pathwayClosureReady: boolean
  enclosingLifecycleClosureReady: boolean
  closureCommitted: boolean
}): LifecycleStatus {
  if (!input.currentObservationReady) {
    return "incomplete"
  }

  if (input.closureCommitted) {
    return "closed"
  }

  if (input.enclosingLifecycleClosureReady) {
    return "closure-ready"
  }

  if (input.evolutionaryRecurrenceQualified) {
    return "recurrence-forming"
  }

  if (input.relationalReferenceQualified) {
    return "relationally-established"
  }

  return "forming"
}

function buildLifecycleMeaning(status: LifecycleStatus): string {
  if (status === "closed") {
    return "Both closure levels are complete: the ordered recurrence pathway is closed and the enclosing Equation Engine observation lifecycle has been committed to continuity."
  }

  if (status === "closure-ready") {
    return "The integrated relational reference and evolutionary recurrence pathway are qualified. The pathway is closed and the enclosing observation lifecycle is ready to be committed."
  }

  if (status === "recurrence-forming") {
    return "The observation is forming an evolutionary recurrence structure, but the complete enclosing lifecycle is not yet ready to close."
  }

  if (status === "relationally-established") {
    return "The Equation Engine observation has established its integrated relational reference, while evolutionary recurrence remains under formation."
  }

  if (status === "forming") {
    return "The Equation Engine observation is present, but one or both ordered pathways remain below qualification."
  }

  return "The Equation Engine observation lifecycle is incomplete because the required synchronized observation state is unavailable."
}

export function generateEquationEngineObservationLifecycle(
  input: EquationEngineObservationLifecycleInput
): EquationEngineObservationLifecycleState {
  const currentObservation = input?.currentObservation ?? null

  const previousObservation = input?.previousObservation ?? null

  const currentObservationReady =
    currentObservation?.equationEngineReady === true

  const previousObservationReady =
    previousObservation?.equationEngineReady === true

  const comparisonReady = currentObservationReady && previousObservationReady

  const equationMetrics = readEquationMetrics(currentObservation)

  const integratedRelationalReference = buildPathway(
    "eq5-eq2",
    "Integrated Relational Reference",
    ["Eq5", "Eq2"],
    equationMetrics
  )

  const integratedEvolutionaryRecurrence = buildPathway(
    "eq5-eq3-eq2-eq4",
    "Integrated Evolutionary Recurrence",
    ["Eq5", "Eq3", "Eq2", "Eq4"],
    equationMetrics
  )

  const relationalReferenceScore = integratedRelationalReference.pathwayScore

  const evolutionaryRecurrenceScore =
    integratedEvolutionaryRecurrence.pathwayScore

  const lifecycleScore = calculateLifecycleScore(
    relationalReferenceScore,
    evolutionaryRecurrenceScore
  )

  const pathwayClosureReady = integratedEvolutionaryRecurrence.pathwayQualified

  /**
   * The enclosing lifecycle should only be considered
   * ready when:
   *
   * 1. the current Equation Engine observation is ready,
   * 2. a previous completed observation exists,
   * 3. the Eq5 → Eq2 reference is qualified,
   * 4. the Eq5 → Eq3 → Eq2 → Eq4 pathway is qualified.
   */
  const enclosingLifecycleClosureReady =
    currentObservationReady &&
    comparisonReady &&
    integratedRelationalReference.pathwayQualified &&
    integratedEvolutionaryRecurrence.pathwayQualified

  const closureCommitted =
    Boolean(input?.closureCommitted) && enclosingLifecycleClosureReady

  const lifecycleStatus = determineLifecycleStatus({
    currentObservationReady,
    comparisonReady,

    relationalReferenceQualified:
      integratedRelationalReference.pathwayQualified,

    evolutionaryRecurrenceQualified:
      integratedEvolutionaryRecurrence.pathwayQualified,

    pathwayClosureReady,
    enclosingLifecycleClosureReady,
    closureCommitted
  })

  const firstClosure = pathwayClosureReady ? "pathway-closed" : "pathway-open"

  const secondClosure = closureCommitted
    ? "lifecycle-closed"
    : enclosingLifecycleClosureReady
      ? "lifecycle-ready"
      : "lifecycle-open"

  return {
    phase: "Equation Engine Observation Lifecycle",

    symbolicOperation: "(5/2) (5/3/2/4))",

    currentObservationId: currentObservation?.observationId ?? null,

    previousObservationId: previousObservation?.observationId ?? null,

    currentObservationReady,
    previousObservationReady,
    comparisonReady,

    equationMetrics,

    integratedRelationalReference,
    integratedEvolutionaryRecurrence,

    relationalReferenceScore,
    evolutionaryRecurrenceScore,

    lifecycleScore,

    pathwayClosureReady,
    enclosingLifecycleClosureReady,
    closureCommitted,

    doubleClosure: {
      firstClosure,
      secondClosure,

      meaning:
        "The first closing parenthesis completes the Eq5 → Eq3 → Eq2 → Eq4 recurrence pathway. The second closing parenthesis completes, or marks readiness to complete, the enclosing Equation Engine observation lifecycle."
    },

    lifecycleStatus,

    lifecycleMeaning: buildLifecycleMeaning(lifecycleStatus),

    equationEngineObservationLifecycleActive: true,

    rule: "Equation Engine Observation Lifecycle is read-only until closure is explicitly committed. It interprets the ordered operation (5/2) (5/3/2/4)), must preserve equation order, must not regenerate Equation Engine state, and must not write to continuity storage unless enclosingLifecycleClosureReady is true."
  }
}

export function getEquationEngineObservationLifecycleMode(
  message: string
): EquationEngineLifecycleMode | null {
  const input = (message || "").toLowerCase()

  if (
    input.includes("equation engine lifecycle json") ||
    input.includes("observation lifecycle json")
  ) {
    return "json"
  }

  if (
    input.includes("equation engine lifecycle pathways") ||
    input.includes("observation lifecycle pathways") ||
    input.includes("integrated relational reference") ||
    input.includes("integrated evolutionary recurrence")
  ) {
    return "pathways"
  }

  if (
    input.includes("equation engine lifecycle closure") ||
    input.includes("observation lifecycle closure") ||
    input.includes("double closure")
  ) {
    return "closure"
  }

  if (
    input.includes("equation engine lifecycle metrics") ||
    input.includes("observation lifecycle metrics")
  ) {
    return "metrics"
  }

  if (
    input.includes("equation engine observation lifecycle") ||
    input.includes("equation engine lifecycle") ||
    input.includes("observation lifecycle")
  ) {
    return "summary"
  }

  return null
}

function formatValue(value: number | null): string {
  return value === null ? "unknown" : String(value)
}

function buildPathwayResponse(pathway: LifecyclePathwayResult): string {
  return [
    `${pathway.name}:`,
    `sequence: ${pathway.sequence.join(" → ")}`,
    `pathwayAvailable: ${pathway.pathwayAvailable ? "true" : "false"}`,
    `pathwayScore: ${formatValue(pathway.pathwayScore)}`,
    `pathwayQualified: ${pathway.pathwayQualified ? "true" : "false"}`,
    "",
    ...pathway.stages.map(stage =>
      [
        `Stage ${stage.stageIndex} — ${stage.equation}`,
        `normalizedMetric: ${formatValue(stage.normalizedMetric)}`,
        `incomingCarry: ${formatValue(stage.incomingCarry)}`,
        `outgoingCarry: ${formatValue(stage.outgoingCarry)}`,
        `meaning: ${stage.stageMeaning}`
      ].join("\n")
    ),
    "",
    `pathwayMeaning: ${pathway.pathwayMeaning}`
  ].join("\n")
}

export function buildEquationEngineObservationLifecycleResponse(
  state: EquationEngineObservationLifecycleState,
  mode: EquationEngineLifecycleMode = "summary"
): string {
  if (mode === "json") {
    return JSON.stringify(state, null, 2)
  }

  if (mode === "pathways") {
    return [
      buildPathwayResponse(state.integratedRelationalReference),
      "",
      buildPathwayResponse(state.integratedEvolutionaryRecurrence)
    ].join("\n")
  }

  if (mode === "closure") {
    return [
      "Equation Engine Observation Lifecycle Closure:",
      `symbolicOperation: ${state.symbolicOperation}`,
      `firstClosure: ${state.doubleClosure.firstClosure}`,
      `secondClosure: ${state.doubleClosure.secondClosure}`,
      `pathwayClosureReady: ${state.pathwayClosureReady ? "true" : "false"}`,
      `enclosingLifecycleClosureReady: ${
        state.enclosingLifecycleClosureReady ? "true" : "false"
      }`,
      `closureCommitted: ${state.closureCommitted ? "true" : "false"}`,
      `meaning: ${state.doubleClosure.meaning}`
    ].join("\n")
  }

  if (mode === "metrics") {
    return [
      "Equation Engine Observation Lifecycle Metrics:",
      `relationalReferenceScore: ${formatValue(
        state.relationalReferenceScore
      )}`,
      `evolutionaryRecurrenceScore: ${formatValue(
        state.evolutionaryRecurrenceScore
      )}`,
      `lifecycleScore: ${formatValue(state.lifecycleScore)}`,
      `lifecycleStatus: ${state.lifecycleStatus}`
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `symbolicOperation: ${state.symbolicOperation}`,
    "",
    `currentObservationId: ${state.currentObservationId ?? "unknown"}`,
    `previousObservationId: ${state.previousObservationId ?? "unknown"}`,
    `currentObservationReady: ${
      state.currentObservationReady ? "true" : "false"
    }`,
    `previousObservationReady: ${
      state.previousObservationReady ? "true" : "false"
    }`,
    `comparisonReady: ${state.comparisonReady ? "true" : "false"}`,
    "",
    "Pathway Results:",
    `Eq5 → Eq2: ${formatValue(state.relationalReferenceScore)} | ${
      state.integratedRelationalReference.pathwayQualified
        ? "qualified"
        : "not-qualified"
    }`,
    `Eq5 → Eq3 → Eq2 → Eq4: ${formatValue(
      state.evolutionaryRecurrenceScore
    )} | ${
      state.integratedEvolutionaryRecurrence.pathwayQualified
        ? "qualified"
        : "not-qualified"
    }`,
    "",
    `lifecycleScore: ${formatValue(state.lifecycleScore)}`,
    `pathwayClosureReady: ${state.pathwayClosureReady ? "true" : "false"}`,
    `enclosingLifecycleClosureReady: ${
      state.enclosingLifecycleClosureReady ? "true" : "false"
    }`,
    `lifecycleStatus: ${state.lifecycleStatus}`,
    "",
    `lifecycleMeaning: ${state.lifecycleMeaning}`,
    `equationEngineObservationLifecycleActive: true`
  ].join("\n")
}
