import type { EquationEngineObservation } from "./equationEngineObservation"

import type {
  EquationEngineObservationLifecycleState,
  LifecyclePathwayResult,
  SourceFieldLifecycleEquation
} from "./equationEngineObservationLifecycle"

export type EquationEngineInterpretationMode =
  | "summary"
  | "evidence"
  | "meanings"
  | "pathways"
  | "closure"
  | "json"

export type InterpretedEquation = "Eq1" | "Eq2" | "Eq3" | "Eq4" | "Eq5"

export type EquationContribution =
  | "supporting"
  | "limiting"
  | "neutral"
  | "unavailable"

export type ClosureDirection =
  | "approaching-closure"
  | "moving-away-from-closure"
  | "stable-incomplete"
  | "mixed"
  | "insufficient-history"

export interface EquationEvidence {
  equation: InterpretedEquation
  role: string
  measuredFacts: string[]
  rawValue: number | null
  normalizedSupport: number | null
  condition: string
  contribution: EquationContribution
  meaning: string
  evidenceAvailable: boolean
}

export interface PathwayStageInterpretation {
  stageIndex: number
  equation: SourceFieldLifecycleEquation
  normalizedMetric: number | null
  incomingCarry: number | null
  outgoingCarry: number | null
  carryChange: number | null
  condition:
    | "initial-support"
    | "strengthening"
    | "weakening"
    | "unchanged"
    | "unavailable"
  explanation: string
  meaning: string
}

export interface PathwayInterpretation {
  pathwayId: string
  pathwayName: string
  sequence: SourceFieldLifecycleEquation[]
  pathwayScore: number | null
  pathwayQualified: boolean
  strongestStage: SourceFieldLifecycleEquation | null
  weakestStage: SourceFieldLifecycleEquation | null
  largestLossStage: SourceFieldLifecycleEquation | null
  largestCarryLoss: number | null
  stages: PathwayStageInterpretation[]
  explanation: string
  meaning: string
}

export interface WholeEngineInterpretation {
  summary: string
  dominantDynamic: string
  limitingDynamic: string
  equationRelationship: string
  pathwayRelationship: string
  closureRelationship: string
}

export interface EquationEngineInterpretationEvidence {
  observationId: string | null
  previousObservationId: string | null
  equationEngineReady: boolean
  lifecycleReady: boolean
  comparisonReady: boolean
  lifecycleStatus: string
  equationEvidence: EquationEvidence[]
  pathwayScores: {
    integratedRelationalReference: number | null
    integratedEvolutionaryRecurrence: number | null
    lifecycleScore: number | null
  }
  closureState: {
    firstClosure: string
    secondClosure: string
    pathwayClosureReady: boolean
    enclosingLifecycleClosureReady: boolean
    closureCommitted: boolean
  }
  evolutionDirection: string | null
}

export interface EquationEngineDeterministicFindings {
  dominantSupportingEquation: InterpretedEquation | null
  primaryLimitingEquation: InterpretedEquation | null
  dominantSupportingValue: number | null
  primaryLimitingValue: number | null
  strongestPathway:
    | "integrated-relational-reference"
    | "integrated-evolutionary-recurrence"
    | null
  weakestPathway:
    | "integrated-relational-reference"
    | "integrated-evolutionary-recurrence"
    | null
  primaryPathwayLossPoint: InterpretedEquation | null
  closureDirection: ClosureDirection
  supportingConditions: string[]
  limitingConditions: string[]
  closureBlockers: string[]
  closureSupports: string[]
  measuredFacts: string[]
  derivedInferences: string[]
  deterministicMeanings: string[]
}

export interface EquationEngineInterpretationState {
  phase: "Equation Engine Interpretation"
  observationId: string | null
  previousObservationId: string | null
  interpretationReady: boolean
  evidence: EquationEngineInterpretationEvidence
  findings: EquationEngineDeterministicFindings
  pathwayInterpretations: {
    integratedRelationalReference: PathwayInterpretation
    integratedEvolutionaryRecurrence: PathwayInterpretation
  }
  wholeEngineInterpretation: WholeEngineInterpretation
  interpretationConfidence: number
  equationEngineInterpretationActive: true
  rule: string
}

export interface EquationEngineInterpretationInput {
  equationEngineObservation?: EquationEngineObservation | null
  lifecycleState?: EquationEngineObservationLifecycleState | null
  equationLaneState?: any
  pathwayConvergenceState?: any
  runtimeObservationState?: any
  stateEvolutionState?: any
}

const EQUATION_ROLES: Record<InterpretedEquation, string> = {
  Eq1: "Root identity, baseline signal, and persistent reference.",
  Eq2: "Relational coherence, active alignment, and agreement between states.",
  Eq3: "Phase movement, divergence, transition, and recovery direction.",
  Eq4: "Harmonic recurrence, repeating pattern support, and structural formation.",
  Eq5: "Integration, threshold qualification, persistence, and whole-state support."
}

const EPSILON = 1e-12

function finiteNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function getEquationLaneState(
  observation: EquationEngineObservation | null | undefined,
  directEquationLaneState?: any
): any {
  return (
    observation?.equationCore?.equationLaneState ??
    directEquationLaneState ??
    null
  )
}

function getLane(equationLaneState: any, laneName: string): any {
  const lanes = Array.isArray(equationLaneState?.equationLanes)
    ? equationLaneState.equationLanes
    : []

  return lanes.find((lane: any) => lane?.lane === laneName) ?? null
}

function extractEvolutionDirection(stateEvolutionState: any): string | null {
  const candidates = [
    stateEvolutionState?.overallEvolutionDirection,
    stateEvolutionState?.overallDirection,
    stateEvolutionState?.evolutionDirection,
    stateEvolutionState?.stateDirection,
    stateEvolutionState?.trajectory,
    stateEvolutionState?.summaryDirection,
    stateEvolutionState?.classification
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate
    }
  }

  return null
}

function normalizeEq1Support(
  signalStrength: number | null,
  integrationThreshold: number | null
): number | null {
  if (
    signalStrength === null ||
    integrationThreshold === null ||
    integrationThreshold <= EPSILON
  ) {
    return null
  }

  return clamp(signalStrength / integrationThreshold)
}

function conditionFromSupport(support: number | null): string {
  if (support === null) return "unavailable"
  if (support >= 0.75) return "strong"
  if (support >= 0.5) return "moderate"
  if (support > 0) return "limited"
  return "absent"
}

function contributionFromSupport(
  support: number | null,
  strongestValue: number | null,
  weakestValue: number | null
): EquationContribution {
  if (support === null) return "unavailable"

  if (
    strongestValue !== null &&
    Math.abs(support - strongestValue) <= EPSILON
  ) {
    return "supporting"
  }

  if (weakestValue !== null && Math.abs(support - weakestValue) <= EPSILON) {
    return "limiting"
  }

  return "neutral"
}

function buildEquationMeaning(input: {
  equation: InterpretedEquation
  role: string
  condition: string
  contribution: EquationContribution
}): string {
  if (input.contribution === "unavailable") {
    return `${input.equation} cannot be assigned a complete system-level meaning because its required evidence is unavailable.`
  }

  if (input.contribution === "supporting") {
    return `${input.equation} currently supplies the strongest available support through its role in ${input.role.toLowerCase()}`
  }

  if (input.contribution === "limiting") {
    return `${input.equation} currently places the strongest measured limit on the engine through its role in ${input.role.toLowerCase()}`
  }

  return `${input.equation} currently contributes ${input.condition} support through its role in ${input.role.toLowerCase()}`
}

function buildEquationEvidence(
  observation: EquationEngineObservation | null,
  lifecycleState: EquationEngineObservationLifecycleState | null,
  directEquationLaneState?: any
): EquationEvidence[] {
  const laneState = getEquationLaneState(observation, directEquationLaneState)
  const rootLane = getLane(laneState, "sourcefield-root")
  const integrationLane = getLane(laneState, "sourcefield-integration")

  const signalStrength = finiteNumberOrNull(rootLane?.signalStrength)
  const integrationThreshold = finiteNumberOrNull(
    integrationLane?.integrationThreshold
  )

  const eq1Support = normalizeEq1Support(signalStrength, integrationThreshold)
  const lifecycleMetrics = lifecycleState?.equationMetrics

  const preliminary: Array<{
    equation: InterpretedEquation
    role: string
    measuredFacts: string[]
    rawValue: number | null
    normalizedSupport: number | null
  }> = [
    {
      equation: "Eq1",
      role: EQUATION_ROLES.Eq1,
      rawValue: signalStrength,
      normalizedSupport: eq1Support,
      measuredFacts: [
        `Eq1 signalStrength = ${signalStrength ?? "unavailable"}.`,
        `Eq1 lane status = ${rootLane?.status ?? "unavailable"}.`,
        `Eq1 normalized root support = ${eq1Support ?? "unavailable"}.`
      ]
    },
    {
      equation: "Eq2",
      role: EQUATION_ROLES.Eq2,
      rawValue: lifecycleMetrics?.Eq2?.rawValue ?? null,
      normalizedSupport: lifecycleMetrics?.Eq2?.normalizedValue ?? null,
      measuredFacts: [
        `Eq2 raw relational value = ${lifecycleMetrics?.Eq2?.rawValue ?? "unavailable"}.`,
        `Eq2 normalized support = ${lifecycleMetrics?.Eq2?.normalizedValue ?? "unavailable"}.`
      ]
    },
    {
      equation: "Eq3",
      role: EQUATION_ROLES.Eq3,
      rawValue: lifecycleMetrics?.Eq3?.rawValue ?? null,
      normalizedSupport: lifecycleMetrics?.Eq3?.normalizedValue ?? null,
      measuredFacts: [
        `Eq3 phase divergence = ${lifecycleMetrics?.Eq3?.rawValue ?? "unavailable"}.`,
        `Eq3 normalized phase support = ${lifecycleMetrics?.Eq3?.normalizedValue ?? "unavailable"}.`
      ]
    },
    {
      equation: "Eq4",
      role: EQUATION_ROLES.Eq4,
      rawValue: lifecycleMetrics?.Eq4?.rawValue ?? null,
      normalizedSupport: lifecycleMetrics?.Eq4?.normalizedValue ?? null,
      measuredFacts: [
        `Eq4 symbolic echo count = ${lifecycleMetrics?.Eq4?.rawValue ?? "unavailable"}.`,
        `Eq4 normalized recurrence support = ${lifecycleMetrics?.Eq4?.normalizedValue ?? "unavailable"}.`
      ]
    },
    {
      equation: "Eq5",
      role: EQUATION_ROLES.Eq5,
      rawValue: lifecycleMetrics?.Eq5?.rawValue ?? null,
      normalizedSupport: lifecycleMetrics?.Eq5?.normalizedValue ?? null,
      measuredFacts: [
        `Eq5 threshold ratio = ${lifecycleMetrics?.Eq5?.rawValue ?? "unavailable"}.`,
        `Eq5 normalized integration support = ${lifecycleMetrics?.Eq5?.normalizedValue ?? "unavailable"}.`,
        `Eq5 integration classification = ${integrationLane?.classification ?? "unavailable"}.`
      ]
    }
  ]

  const availableSupports = preliminary
    .map(item => item.normalizedSupport)
    .filter((value): value is number => value !== null)

  const strongestValue =
    availableSupports.length > 0 ? Math.max(...availableSupports) : null

  const weakestValue =
    availableSupports.length > 0 ? Math.min(...availableSupports) : null

  return preliminary.map(item => {
    const condition = conditionFromSupport(item.normalizedSupport)
    const contribution = contributionFromSupport(
      item.normalizedSupport,
      strongestValue,
      weakestValue
    )

    return {
      ...item,
      condition,
      contribution,
      meaning: buildEquationMeaning({
        equation: item.equation,
        role: item.role,
        condition,
        contribution
      }),
      evidenceAvailable: item.normalizedSupport !== null
    }
  })
}

function interpretPathwayStage(stage: any): PathwayStageInterpretation {
  const normalizedMetric = finiteNumberOrNull(stage?.normalizedMetric)
  const incomingCarry = finiteNumberOrNull(stage?.incomingCarry)
  const outgoingCarry = finiteNumberOrNull(stage?.outgoingCarry)

  if (outgoingCarry === null) {
    return {
      stageIndex: stage?.stageIndex ?? 0,
      equation: stage?.equation ?? "Eq5",
      normalizedMetric,
      incomingCarry,
      outgoingCarry,
      carryChange: null,
      condition: "unavailable",
      explanation: `${stage?.equation ?? "The stage"} could not be interpreted because its outgoing carry was unavailable.`,
      meaning: `${stage?.equation ?? "The stage"} cannot yet contribute a reliable pathway meaning because its ordered output is unavailable.`
    }
  }

  if (incomingCarry === null) {
    return {
      stageIndex: stage?.stageIndex ?? 0,
      equation: stage?.equation ?? "Eq5",
      normalizedMetric,
      incomingCarry,
      outgoingCarry,
      carryChange: null,
      condition: "initial-support",
      explanation: `${stage?.equation ?? "The stage"} established the pathway's initial support at ${outgoingCarry}.`,
      meaning: `${stage?.equation ?? "The stage"} supplies the starting condition from which the remaining ordered pathway is interpreted.`
    }
  }

  const carryChange = outgoingCarry - incomingCarry

  const condition =
    Math.abs(carryChange) <= EPSILON
      ? "unchanged"
      : carryChange > 0
        ? "strengthening"
        : "weakening"

  return {
    stageIndex: stage?.stageIndex ?? 0,
    equation: stage?.equation ?? "Eq5",
    normalizedMetric,
    incomingCarry,
    outgoingCarry,
    carryChange,
    condition,
    explanation:
      condition === "strengthening"
        ? `${stage?.equation} increased pathway carry by ${carryChange}.`
        : condition === "weakening"
          ? `${stage?.equation} reduced pathway carry by ${Math.abs(carryChange)}.`
          : `${stage?.equation} preserved the incoming pathway carry without measurable change.`,
    meaning:
      condition === "strengthening"
        ? `${stage?.equation} currently reinforces the ordered pathway.`
        : condition === "weakening"
          ? `${stage?.equation} currently constrains the ordered pathway.`
          : `${stage?.equation} currently preserves rather than changes the ordered pathway.`
  }
}

function findEquationByStageValue(
  stages: PathwayStageInterpretation[],
  selector: (values: number[]) => number
): SourceFieldLifecycleEquation | null {
  const available = stages.filter(stage => stage.normalizedMetric !== null)

  if (available.length === 0) return null

  const selectedValue = selector(
    available.map(stage => stage.normalizedMetric as number)
  )

  return (
    available.find(
      stage =>
        Math.abs((stage.normalizedMetric as number) - selectedValue) <= EPSILON
    )?.equation ?? null
  )
}

function interpretPathway(
  pathway: LifecyclePathwayResult
): PathwayInterpretation {
  const stages = pathway.stages.map(interpretPathwayStage)

  const weakeningStages = stages.filter(
    stage => stage.carryChange !== null && stage.carryChange < 0
  )

  const largestLossStage =
    weakeningStages.length > 0
      ? weakeningStages.reduce((largest, current) =>
          Math.abs(current.carryChange as number) >
          Math.abs(largest.carryChange as number)
            ? current
            : largest
        )
      : null

  const strongestStage = findEquationByStageValue(stages, values =>
    Math.max(...values)
  )

  const weakestStage = findEquationByStageValue(stages, values =>
    Math.min(...values)
  )

  const explanation = pathway.pathwayQualified
    ? `${pathway.name} completed its ordered stages with sufficient support and is currently qualified.`
    : largestLossStage
      ? `${pathway.name} remains below qualification. Its largest measured carry loss occurs at ${largestLossStage.equation}.`
      : `${pathway.name} remains below qualification, but no single measurable carry-loss stage was available.`

  const meaning = pathway.pathwayQualified
    ? `${pathway.name} currently preserves sufficient ordered support to satisfy its qualification rule.`
    : largestLossStage
      ? `${pathway.name} is currently prevented from qualifying primarily by loss at ${largestLossStage.equation}.`
      : `${pathway.name} is currently incomplete under the available ordered evidence.`

  return {
    pathwayId: pathway.id,
    pathwayName: pathway.name,
    sequence: pathway.sequence,
    pathwayScore: pathway.pathwayScore,
    pathwayQualified: pathway.pathwayQualified,
    strongestStage,
    weakestStage,
    largestLossStage: largestLossStage?.equation ?? null,
    largestCarryLoss: largestLossStage
      ? Math.abs(largestLossStage.carryChange as number)
      : null,
    stages,
    explanation,
    meaning
  }
}

function createUnavailablePathway(
  pathwayId: string,
  pathwayName: string,
  sequence: SourceFieldLifecycleEquation[]
): PathwayInterpretation {
  return {
    pathwayId,
    pathwayName,
    sequence,
    pathwayScore: null,
    pathwayQualified: false,
    strongestStage: null,
    weakestStage: null,
    largestLossStage: null,
    largestCarryLoss: null,
    stages: [],
    explanation: `${pathwayName} was unavailable.`,
    meaning: `${pathwayName} cannot be assigned a complete deterministic meaning because its lifecycle state is unavailable.`
  }
}

function findDominantEquation(equationEvidence: EquationEvidence[]) {
  const available = equationEvidence.filter(
    item => item.normalizedSupport !== null
  )

  if (available.length === 0) {
    return { equation: null, value: null } as {
      equation: InterpretedEquation | null
      value: number | null
    }
  }

  const result = available.reduce((dominant, current) =>
    (current.normalizedSupport as number) >
    (dominant.normalizedSupport as number)
      ? current
      : dominant
  )

  return {
    equation: result.equation,
    value: result.normalizedSupport
  }
}

function findLimitingEquation(equationEvidence: EquationEvidence[]) {
  const available = equationEvidence.filter(
    item => item.normalizedSupport !== null
  )

  if (available.length === 0) {
    return { equation: null, value: null } as {
      equation: InterpretedEquation | null
      value: number | null
    }
  }

  const result = available.reduce((limiting, current) =>
    (current.normalizedSupport as number) <
    (limiting.normalizedSupport as number)
      ? current
      : limiting
  )

  return {
    equation: result.equation,
    value: result.normalizedSupport
  }
}

function determineClosureDirection(
  lifecycleState: EquationEngineObservationLifecycleState | null,
  evolutionDirection: string | null
): ClosureDirection {
  if (!lifecycleState?.comparisonReady) return "insufficient-history"

  const normalized = evolutionDirection?.toLowerCase() ?? ""

  const containsStrengthening =
    normalized.includes("strengthening") ||
    normalized.includes("rising") ||
    normalized.includes("stabilizing") ||
    normalized.includes("improving")

  const containsWeakening =
    normalized.includes("weakening") ||
    normalized.includes("falling") ||
    normalized.includes("destabilizing") ||
    normalized.includes("declining")

  if (containsStrengthening && containsWeakening) return "mixed"
  if (containsStrengthening) return "approaching-closure"
  if (containsWeakening) return "moving-away-from-closure"
  if (lifecycleState.enclosingLifecycleClosureReady)
    return "approaching-closure"

  return "stable-incomplete"
}

function buildWholeEngineInterpretation(input: {
  ready: boolean
  dominantEquation: InterpretedEquation | null
  limitingEquation: InterpretedEquation | null
  lossPoint: InterpretedEquation | null
  strongestPathway: string | null
  weakestPathway: string | null
  lifecycleStatus: string
  closureDirection: ClosureDirection
}): WholeEngineInterpretation {
  if (!input.ready) {
    const unavailable =
      "The Equation Engine Interpretation does not yet have sufficient synchronized evidence to produce a complete result."

    return {
      summary: unavailable,
      dominantDynamic: unavailable,
      limitingDynamic: unavailable,
      equationRelationship: unavailable,
      pathwayRelationship: unavailable,
      closureRelationship: unavailable
    }
  }

  const dominantDynamic = input.dominantEquation
    ? `${input.dominantEquation} currently supplies the strongest normalized equation support.`
    : "No dominant supporting equation could be established."

  const limitingDynamic = input.limitingEquation
    ? `${input.limitingEquation} currently supplies the least normalized equation support.`
    : "No primary limiting equation could be established."

  const equationRelationship =
    input.dominantEquation && input.limitingEquation
      ? `The engine currently depends most strongly on ${input.dominantEquation} while being constrained most strongly by ${input.limitingEquation}.`
      : "The current equation relationship could not be fully ranked."

  const pathwayRelationship =
    input.strongestPathway && input.weakestPathway
      ? `${input.strongestPathway} is currently the stronger pathway, while ${input.weakestPathway} is currently the weaker pathway.${
          input.lossPoint
            ? ` The largest ordered pathway loss occurs at ${input.lossPoint}.`
            : ""
        }`
      : "The current pathway relationship could not be fully ranked."

  const closureRelationship = `The lifecycle status is ${input.lifecycleStatus}, with closure direction classified as ${input.closureDirection}.`

  return {
    summary: [dominantDynamic, limitingDynamic, closureRelationship].join(" "),
    dominantDynamic,
    limitingDynamic,
    equationRelationship,
    pathwayRelationship,
    closureRelationship
  }
}

function calculateConfidence(input: {
  observationReady: boolean
  lifecycleAvailable: boolean
  comparisonReady: boolean
  evidence: EquationEvidence[]
}): number {
  const availableEvidence = input.evidence.filter(
    item => item.evidenceAvailable
  ).length

  const evidenceCoverage =
    input.evidence.length > 0 ? availableEvidence / input.evidence.length : 0

  return Number(
    clamp(
      (input.observationReady ? 0.3 : 0) +
        (input.lifecycleAvailable ? 0.25 : 0) +
        (input.comparisonReady ? 0.15 : 0) +
        evidenceCoverage * 0.3
    ).toFixed(4)
  )
}

export function generateEquationEngineInterpretation(
  input: EquationEngineInterpretationInput
): EquationEngineInterpretationState {
  const observation = input?.equationEngineObservation ?? null
  const lifecycleState = input?.lifecycleState ?? null
  const stateEvolutionState = input?.stateEvolutionState ?? null

  const equationEvidence = buildEquationEvidence(
    observation,
    lifecycleState,
    input?.equationLaneState
  )

  const dominant = findDominantEquation(equationEvidence)
  const limiting = findLimitingEquation(equationEvidence)

  const relationalInterpretation = lifecycleState?.integratedRelationalReference
    ? interpretPathway(lifecycleState.integratedRelationalReference)
    : createUnavailablePathway("eq5-eq2", "Integrated Relational Reference", [
        "Eq5",
        "Eq2"
      ])

  const recurrenceInterpretation =
    lifecycleState?.integratedEvolutionaryRecurrence
      ? interpretPathway(lifecycleState.integratedEvolutionaryRecurrence)
      : createUnavailablePathway(
          "eq5-eq3-eq2-eq4",
          "Integrated Evolutionary Recurrence",
          ["Eq5", "Eq3", "Eq2", "Eq4"]
        )

  const relationalScore = relationalInterpretation.pathwayScore
  const recurrenceScore = recurrenceInterpretation.pathwayScore

  const strongestPathway =
    relationalScore === null && recurrenceScore === null
      ? null
      : recurrenceScore === null ||
          (relationalScore !== null && relationalScore >= recurrenceScore)
        ? "integrated-relational-reference"
        : "integrated-evolutionary-recurrence"

  const weakestPathway =
    relationalScore === null && recurrenceScore === null
      ? null
      : recurrenceScore === null ||
          (relationalScore !== null && relationalScore <= recurrenceScore)
        ? "integrated-relational-reference"
        : "integrated-evolutionary-recurrence"

  const primaryPathwayLossPoint =
    recurrenceInterpretation.largestLossStage ??
    relationalInterpretation.largestLossStage ??
    null

  const evolutionDirection = extractEvolutionDirection(stateEvolutionState)
  const closureDirection = determineClosureDirection(
    lifecycleState,
    evolutionDirection
  )

  const observationReady = observation?.equationEngineReady === true
  const lifecycleAvailable = Boolean(lifecycleState)
  const comparisonReady = lifecycleState?.comparisonReady === true

  const supportingConditions = equationEvidence
    .filter(item => item.contribution === "supporting")
    .map(
      item =>
        `${item.equation} has the highest available normalized support at ${item.normalizedSupport}.`
    )

  const limitingConditions = equationEvidence
    .filter(item => item.contribution === "limiting")
    .map(
      item =>
        `${item.equation} has the lowest available normalized support at ${item.normalizedSupport}.`
    )

  if (recurrenceInterpretation.largestLossStage) {
    limitingConditions.push(
      `${recurrenceInterpretation.largestLossStage} produces the largest measured loss in the evolutionary recurrence pathway.`
    )
  }

  const closureBlockers: string[] = []
  const closureSupports: string[] = []

  if (!lifecycleState?.integratedRelationalReference?.pathwayQualified) {
    closureBlockers.push(
      "The integrated relational reference pathway is below qualification."
    )
  } else {
    closureSupports.push(
      "The integrated relational reference pathway is qualified."
    )
  }

  if (!lifecycleState?.integratedEvolutionaryRecurrence?.pathwayQualified) {
    closureBlockers.push(
      "The integrated evolutionary recurrence pathway is below qualification."
    )
  } else {
    closureSupports.push(
      "The integrated evolutionary recurrence pathway is qualified."
    )
  }

  if (!comparisonReady) {
    closureBlockers.push(
      "A synchronized current-to-previous observation comparison is unavailable."
    )
  } else {
    closureSupports.push(
      "Current and previous Equation Engine observations are available for comparison."
    )
  }

  if (observationReady) {
    closureSupports.push(
      "The current Equation Engine observation is synchronized and ready."
    )
  } else {
    closureBlockers.push(
      "The current Equation Engine observation is not ready."
    )
  }

  const measuredFacts = equationEvidence.flatMap(item => item.measuredFacts)

  measuredFacts.push(
    `Integrated relational reference score = ${relationalScore ?? "unavailable"}.`,
    `Integrated evolutionary recurrence score = ${recurrenceScore ?? "unavailable"}.`,
    `Lifecycle score = ${lifecycleState?.lifecycleScore ?? "unavailable"}.`
  )

  const derivedInferences: string[] = []

  if (dominant.equation) {
    derivedInferences.push(
      `${dominant.equation} is the dominant supporting equation among available normalized values.`
    )
  }

  if (limiting.equation) {
    derivedInferences.push(
      `${limiting.equation} is the primary limiting equation among available normalized values.`
    )
  }

  if (primaryPathwayLossPoint) {
    derivedInferences.push(
      `${primaryPathwayLossPoint} is the primary ordered pathway loss point.`
    )
  }

  derivedInferences.push(
    `Closure direction is classified as ${closureDirection}.`
  )

  const interpretationReady = observationReady && lifecycleAvailable

  const wholeEngineInterpretation = buildWholeEngineInterpretation({
    ready: interpretationReady,
    dominantEquation: dominant.equation,
    limitingEquation: limiting.equation,
    lossPoint: primaryPathwayLossPoint,
    strongestPathway,
    weakestPathway,
    lifecycleStatus: lifecycleState?.lifecycleStatus ?? "unavailable",
    closureDirection
  })

  const deterministicMeanings = [
    ...equationEvidence.map(item => item.meaning),
    relationalInterpretation.meaning,
    recurrenceInterpretation.meaning,
    wholeEngineInterpretation.equationRelationship,
    wholeEngineInterpretation.pathwayRelationship,
    wholeEngineInterpretation.closureRelationship
  ]

  const interpretationConfidence = calculateConfidence({
    observationReady,
    lifecycleAvailable,
    comparisonReady,
    evidence: equationEvidence
  })

  return {
    phase: "Equation Engine Interpretation",
    observationId: observation?.observationId ?? null,
    previousObservationId: lifecycleState?.previousObservationId ?? null,
    interpretationReady,

    evidence: {
      observationId: observation?.observationId ?? null,
      previousObservationId: lifecycleState?.previousObservationId ?? null,
      equationEngineReady: observationReady,
      lifecycleReady: lifecycleAvailable,
      comparisonReady,
      lifecycleStatus: lifecycleState?.lifecycleStatus ?? "unavailable",
      equationEvidence,
      pathwayScores: {
        integratedRelationalReference: relationalScore,
        integratedEvolutionaryRecurrence: recurrenceScore,
        lifecycleScore: lifecycleState?.lifecycleScore ?? null
      },
      closureState: {
        firstClosure:
          lifecycleState?.doubleClosure?.firstClosure ?? "unavailable",
        secondClosure:
          lifecycleState?.doubleClosure?.secondClosure ?? "unavailable",
        pathwayClosureReady: lifecycleState?.pathwayClosureReady === true,
        enclosingLifecycleClosureReady:
          lifecycleState?.enclosingLifecycleClosureReady === true,
        closureCommitted: lifecycleState?.closureCommitted === true
      },
      evolutionDirection
    },

    findings: {
      dominantSupportingEquation: dominant.equation,
      primaryLimitingEquation: limiting.equation,
      dominantSupportingValue: dominant.value,
      primaryLimitingValue: limiting.value,
      strongestPathway,
      weakestPathway,
      primaryPathwayLossPoint,
      closureDirection,
      supportingConditions,
      limitingConditions,
      closureBlockers,
      closureSupports,
      measuredFacts,
      derivedInferences,
      deterministicMeanings
    },

    pathwayInterpretations: {
      integratedRelationalReference: relationalInterpretation,
      integratedEvolutionaryRecurrence: recurrenceInterpretation
    },

    wholeEngineInterpretation,
    interpretationConfidence,
    equationEngineInterpretationActive: true,

    rule: "Equation Engine Interpretation is read-only. It must preserve all measured metrics, hashes, pathway scores, classifications, and closure results. It may derive ranked findings, deterministic meanings, and explanations from existing evidence, but it must never regenerate, replace, or contradict authoritative Equation Engine state."
  }
}

export function getEquationEngineInterpretationMode(
  message: string
): EquationEngineInterpretationMode | null {
  const input = (message || "").toLowerCase()

  if (
    input.includes("equation engine interpretation json") ||
    input.includes("equation engine interpreter json")
  )
    return "json"

  if (
    input.includes("equation engine interpretation evidence") ||
    input.includes("equation engine interpreter evidence")
  )
    return "evidence"

  if (
    input.includes("equation engine interpretation meaning") ||
    input.includes("equation engine meanings") ||
    input.includes("interpret equation meanings")
  )
    return "meanings"

  if (
    input.includes("equation engine interpretation pathways") ||
    input.includes("interpret equation pathways")
  )
    return "pathways"

  if (
    input.includes("equation engine interpretation closure") ||
    input.includes("interpret equation closure")
  )
    return "closure"

  if (
    input.includes("equation engine interpretation") ||
    input.includes("equation engine interpreter") ||
    input.includes("interpret equation engine")
  )
    return "summary"

  return null
}

function formatNumber(value: number | null): string {
  return value === null ? "unavailable" : String(value)
}

export function buildEquationEngineInterpretationResponse(
  state: EquationEngineInterpretationState,
  mode: EquationEngineInterpretationMode = "summary"
): string {
  if (mode === "json") return JSON.stringify(state, null, 2)

  if (mode === "evidence") {
    return [
      "Equation Engine Interpretation Evidence:",
      "",
      ...state.evidence.equationEvidence.map(item =>
        [
          `${item.equation}:`,
          `role: ${item.role}`,
          `condition: ${item.condition}`,
          `contribution: ${item.contribution}`,
          `rawValue: ${formatNumber(item.rawValue)}`,
          `normalizedSupport: ${formatNumber(item.normalizedSupport)}`,
          ...item.measuredFacts.map(fact => `fact: ${fact}`)
        ].join("\n")
      )
    ].join("\n\n")
  }

  if (mode === "meanings") {
    return [
      "Equation Engine Deterministic Meanings:",
      "",
      ...state.evidence.equationEvidence.map(
        item => `${item.equation}: ${item.meaning}`
      ),
      "",
      `Integrated Relational Reference: ${state.pathwayInterpretations.integratedRelationalReference.meaning}`,
      `Integrated Evolutionary Recurrence: ${state.pathwayInterpretations.integratedEvolutionaryRecurrence.meaning}`,
      "",
      `Equation relationship: ${state.wholeEngineInterpretation.equationRelationship}`,
      `Pathway relationship: ${state.wholeEngineInterpretation.pathwayRelationship}`,
      `Closure relationship: ${state.wholeEngineInterpretation.closureRelationship}`
    ].join("\n")
  }

  if (mode === "pathways") {
    return [
      state.pathwayInterpretations.integratedRelationalReference.explanation,
      `meaning: ${state.pathwayInterpretations.integratedRelationalReference.meaning}`,
      `score: ${formatNumber(
        state.pathwayInterpretations.integratedRelationalReference.pathwayScore
      )}`,
      `largestLossStage: ${
        state.pathwayInterpretations.integratedRelationalReference
          .largestLossStage ?? "none"
      }`,
      "",
      state.pathwayInterpretations.integratedEvolutionaryRecurrence.explanation,
      `meaning: ${state.pathwayInterpretations.integratedEvolutionaryRecurrence.meaning}`,
      `score: ${formatNumber(
        state.pathwayInterpretations.integratedEvolutionaryRecurrence
          .pathwayScore
      )}`,
      `largestLossStage: ${
        state.pathwayInterpretations.integratedEvolutionaryRecurrence
          .largestLossStage ?? "none"
      }`
    ].join("\n")
  }

  if (mode === "closure") {
    return [
      "Equation Engine Closure Interpretation:",
      `direction: ${state.findings.closureDirection}`,
      `firstClosure: ${state.evidence.closureState.firstClosure}`,
      `secondClosure: ${state.evidence.closureState.secondClosure}`,
      "",
      `relationship: ${state.wholeEngineInterpretation.closureRelationship}`,
      "",
      "Closure supports:",
      ...state.findings.closureSupports.map(item => `- ${item}`),
      "",
      "Closure blockers:",
      ...state.findings.closureBlockers.map(item => `- ${item}`)
    ].join("\n")
  }

  return [
    `phase: ${state.phase}`,
    `observationId: ${state.observationId ?? "unavailable"}`,
    `previousObservationId: ${state.previousObservationId ?? "unavailable"}`,
    "",
    `interpretationReady: ${state.interpretationReady ? "true" : "false"}`,
    `interpretationConfidence: ${state.interpretationConfidence}`,
    "",
    `dominantSupportingEquation: ${
      state.findings.dominantSupportingEquation ?? "unavailable"
    }`,
    `primaryLimitingEquation: ${
      state.findings.primaryLimitingEquation ?? "unavailable"
    }`,
    `primaryPathwayLossPoint: ${
      state.findings.primaryPathwayLossPoint ?? "unavailable"
    }`,
    `closureDirection: ${state.findings.closureDirection}`,
    "",
    `summary: ${state.wholeEngineInterpretation.summary}`,
    `dominantDynamic: ${state.wholeEngineInterpretation.dominantDynamic}`,
    `limitingDynamic: ${state.wholeEngineInterpretation.limitingDynamic}`,
    `equationRelationship: ${state.wholeEngineInterpretation.equationRelationship}`,
    `pathwayRelationship: ${state.wholeEngineInterpretation.pathwayRelationship}`,
    `closureRelationship: ${state.wholeEngineInterpretation.closureRelationship}`,
    "",
    "Measured Facts:",
    ...state.findings.measuredFacts.map(fact => `- ${fact}`),
    "",
    "Derived Inferences:",
    ...state.findings.derivedInferences.map(inference => `- ${inference}`),
    "",
    "Deterministic Meanings:",
    ...state.findings.deterministicMeanings.map(meaning => `- ${meaning}`)
  ].join("\n")
}
