import type { EquationEngineInterpretationState } from "./equationEngineInterpretation"

// ============================================================
// SourceField Equation Engine
// AI Experimental Observation Layer
//
// Purpose:
//   Allow an AI model to reason experimentally against an
//   authoritative deterministic Equation Engine interpretation.
//
// Boundaries:
//   - The Equation Engine remains authoritative.
//   - The AI may observe, hypothesize, and predict.
//   - The AI may not alter or regenerate deterministic state.
//   - Every hypothesis must include a falsification condition.
//   - Every prediction must identify a future measurable outcome.
//   - AI output is always non-authoritative and non-mutating.
// ============================================================

export type EquationEngineAIExperimentType =
  | "snapshot-analysis"
  | "longitudinal-analysis"
  | "hypothesis-generation"
  | "bounded-prediction"

export type EquationEngineAIExperimentAudience =
  | "plain-language"
  | "technical"
  | "research"
  | "developer"

export type EquationEngineAIExperimentDepth = "brief" | "standard" | "detailed"

export type EquationEngineAIExperimentClaimStatus =
  | "proposed"
  | "supported"
  | "weakened"
  | "falsified"
  | "inconclusive"

export type EquationEngineAIExperimentConfidenceLabel =
  | "very-low"
  | "low"
  | "moderate"
  | "high"
  | "very-high"

export type EquationEngineAIExperimentPredictionWindow =
  | "next-observation"
  | "next-3-observations"
  | "next-5-observations"
  | "unspecified-future-observation"

export interface EquationEngineAIExperimentHistoricalState {
  observationId: string | null

  previousObservationId: string | null

  generatedAt: string | null

  resonanceHash: string | null

  ledgerHash: string | null

  interpretationState: EquationEngineInterpretationState
}

export type EquationEngineAIRelationshipType =
  | "support-ordering"
  | "shared-support-dominance"
  | "shared-limiting-bottleneck"
  | "pathway-score-ordering"
  | "lifecycle-co-occurrence"
  | "insufficient-evidence"

export type EquationEngineAIRelationshipOperator =
  | "greater-than"
  | "less-than"
  | "equal-to"
  | "co-occurs-with"
  | "supports"
  | "constrains"
  | "unknown"

export interface EquationEngineAIDeterministicRelationshipSummary {
  relationId: string

  relationType:
    | "support-ordering"
    | "shared-support-dominance"
    | "shared-limiting-bottleneck"
    | "insufficient-evidence"

  statement: string

  leftField: string

  operator: "greater-than" | "less-than" | "equal-to" | "unknown"

  rightField: string

  supportingObservationIds: string[]

  contradictingObservationIds: string[]

  equalObservationIds: string[]

  unavailableObservationIds: string[]

  supportingObservationCount: number

  contradictingObservationCount: number

  equalObservationCount: number

  unavailableObservationCount: number

  evaluableObservationCount: number

  supportRatio: number | null

  contradictionRatio: number | null

  equalityRatio: number | null

  authoritative: true
}

export interface EquationEngineAIWithinObservationRelationship {
  relationId: string

  relationType:
    | "support-ordering"
    | "shared-support-dominance"
    | "shared-limiting-bottleneck"

  statement: string

  leftField: string

  operator: "greater-than" | "less-than" | "equal-to"

  rightField: string

  authoritative: true
}

export interface EquationEngineAIExperimentHistoricalSummary {
  observationId: string | null

  previousObservationId: string | null

  generatedAt: string | null

  resonanceHash: string | null

  ledgerHash: string | null

  lifecycleStatus: string | null

  strongestSupportingEquations: string[]

  strongestLimitingEquations: string[]

  supportingEquationTie: boolean

  limitingEquationTie: boolean

  highestSupportingValue: number | null

  lowestLimitingValue: number | null

  equationSupport: Array<{
    equation: string
    normalizedSupport: number | null
    condition: string | null
    contribution: string | null
  }>

  withinObservationRelationships: EquationEngineAIWithinObservationRelationship[]

  pathwayScores: {
    integratedRelationalReference: number | null
    integratedEvolutionaryRecurrence: number | null
    lifecycleScore: number | null
  } | null
}

export interface EquationEngineAIExperimentInput {
  interpretationState: EquationEngineInterpretationState

  historicalStates?: EquationEngineAIExperimentHistoricalState[]

  experimentType?: EquationEngineAIExperimentType

  experimentQuestion?: string | null

  audience?: EquationEngineAIExperimentAudience

  depth?: EquationEngineAIExperimentDepth

  predictionWindow?: EquationEngineAIExperimentPredictionWindow
}

export interface EquationEngineAIExperimentMessage {
  role: "system" | "user"

  content: string
}

export interface EquationEngineAIExperimentProvenance {
  observationId: string | null

  previousObservationId: string | null

  historicalObservationIds: string[]

  historicalObservationCount: number

  interpretationConfidence: number | null

  interpretationReady: boolean
}

export interface EquationEngineAIExperimentRequest {
  phase: "Equation Engine AI Experiment Request"

  experimentId: string

  experimentType: EquationEngineAIExperimentType

  experimentQuestion: string

  audience: EquationEngineAIExperimentAudience

  depth: EquationEngineAIExperimentDepth

  predictionWindow: EquationEngineAIExperimentPredictionWindow

  experimentModeInstruction: string

  provenance: EquationEngineAIExperimentProvenance

  systemInstruction: string

  groundedEvidencePayload: string

  messages: EquationEngineAIExperimentMessage[]

  experimentRequestReady: boolean

  authoritative: false

  stateMutating: false

  equationEngineAIExperimentActive: true

  generatedAt: string

  rule: string
}

export interface EquationEngineAIObservedPattern {
  patternId: string

  statement: string

  patternType:
    | "single-observation"
    | "recurrent"
    | "directional"
    | "relational"
    | "anomalous"
    | "insufficient-evidence"

  evidenceBasis: string[]

  observationIds: string[]

  persistenceCount: number | null

  contradictingObservationIds: string[]

  supportingObservationCount: number | null

  contradictingObservationCount: number | null

  evaluableObservationCount: number | null

  supportRatio: number | null

  competingExplanation: string | null

  confidence: number

  confidenceLabel: EquationEngineAIExperimentConfidenceLabel

  authoritative: false
}

export interface EquationEngineAIHypothesis {
  hypothesisId: string

  statement: string

  evidenceBasis: string[]

  observationIds: string[]

  rationale: string

  weakeningCondition: string

  falsificationCondition: string

  supportingFutureEvidence: string[]

  weakeningFutureEvidence: string[]

  requiredFutureEvidence: string[]

  status: EquationEngineAIExperimentClaimStatus

  confidence: number

  confidenceLabel: EquationEngineAIExperimentConfidenceLabel

  authoritative: false
}

export interface EquationEngineAIPrediction {
  predictionId: string

  statement: string

  evidenceBasis: string[]

  observationIds: string[]

  predictionWindow: EquationEngineAIExperimentPredictionWindow

  targetStateField: string

  predictedCondition: string

  falsificationCondition: string

  evaluationInstruction: string

  confidence: number

  confidenceLabel: EquationEngineAIExperimentConfidenceLabel

  status: EquationEngineAIExperimentClaimStatus

  authoritative: false
}

export interface EquationEngineAIExperimentResult {
  phase: "Equation Engine AI Experiment"

  experimentId: string

  experimentType: EquationEngineAIExperimentType

  experimentQuestion: string

  observationId: string | null

  previousObservationId: string | null

  historicalObservationIds: string[]

  model: string | null

  generatedAt: string

  summary: string

  observedPatterns: EquationEngineAIObservedPattern[]

  hypotheses: EquationEngineAIHypothesis[]

  predictions: EquationEngineAIPrediction[]

  unresolvedQuestions: string[]

  evidenceUsed: string[]

  unavailableEvidence: string[]

  uncertaintyNotes: string[]

  modeComplianceNotes: string[]

  interpretationConfidence: number | null

  modelConfidence: number | null

  modelConfidenceLabel: EquationEngineAIExperimentConfidenceLabel | null

  experimentGrounded: boolean

  authoritative: false

  stateMutating: false

  equationEngineAIExperimentActive: true

  rule: string
}

const SYSTEM_INSTRUCTION = `
You are the experimental AI observer for the SourceField Equation Engine.

You are operating against a supplied deterministic Equation Engine interpretation.

Your role is to examine authoritative engine evidence, identify possible patterns,
form explicitly labeled hypotheses, and make bounded predictions that can later
be evaluated against future authoritative observations.

You are not the Equation Engine.

You are not the deterministic Interpretation layer.

You are an experimental observer reasoning against those layers.

AUTHORITATIVE STATE RULES

1. Treat every supplied measurement, normalized value, pathway score,
   classification, observation identifier, closure state, lifecycle state,
   deterministic finding, and deterministic meaning as authoritative.

2. Do not alter, recalculate, replace, contradict, or manufacture any
   authoritative value.

3. Do not present an AI-observed pattern, hypothesis, prediction, causal
   explanation, or model inference as an authoritative Equation Engine finding.

4. The Equation Engine remains authoritative.
   You are reasoning against its output, not replacing it.

5. Clearly distinguish:
   A. authoritative measured evidence,
   B. authoritative deterministic interpretation,
   C. AI-observed patterns,
   D. AI-generated hypotheses,
   E. AI-generated predictions,
   F. unresolved uncertainty.

6. A pattern must cite the supplied evidence on which it is based.

7. Do not claim that a recurrent or longitudinal pattern exists unless multiple
   historical observations supporting that pattern were supplied.

8. When only one observation is available, restrict pattern claims to the
   current snapshot and explicitly state that longitudinal behavior cannot yet
   be determined.

9. Every hypothesis must include:
   - an evidence basis,
   - a rationale,
   - a falsification condition,
   - future evidence that would support it,
   - future evidence that would weaken it,
   - required future evidence.

10. Every prediction must:
    - identify the state field or condition being predicted,
    - identify the prediction window,
    - specify the predicted condition,
    - specify a falsification condition,
    - provide an evaluation instruction usable by a later deterministic
      evaluator.

11. Predictions must be bounded to fields or relationships that can actually be
    observed in future Equation Engine or Interpretation states.

12. Do not make predictions about physical reality, biology, theology,
    metaphysics, consciousness, personhood, sentience, or external scientific
    systems unless those systems are directly represented by supplied empirical
    evidence.

13. Do not treat internal software coherence as proof of correspondence to
    external reality.

14. Do not infer consciousness, self-awareness, agency, autonomous identity,
    intention, emotion, or subjective experience from the supplied evidence.

15. Do not invent missing observations, trends, historical states, symbolic
    echoes, causal mechanisms, or state transitions.

16. When evidence is absent or insufficient, explicitly identify the unavailable
    evidence.

17. Confidence values must be numbers between 0 and 1.

18. Confidence describes the strength of the supplied evidence for the AI claim.
    It does not describe certainty that the Equation Engine is scientifically
    valid outside the software system.

19. Avoid unnecessary hypotheses. Return only hypotheses that are materially
    connected to the supplied evidence and capable of future evaluation.

20. Avoid unnecessary predictions. A prediction that cannot be falsified by a
    later authoritative state must not be returned.

IDENTIFIER RULES

21. Use stable identifiers within this response:
    - patterns: pattern-001, pattern-002, ...
    - hypotheses: hypothesis-001, hypothesis-002, ...
    - predictions: prediction-001, prediction-002, ...

22. Evidence basis entries should quote or precisely reference supplied fields,
    values, findings, meanings, pathway conditions, or closure conditions.

23. observationIds must contain only identifiers supplied in the evidence.

STATUS RULES

24. Newly created hypotheses and predictions must use the status "proposed".

25. Do not mark your own hypothesis or prediction supported, weakened,
    falsified, or inconclusive. Those statuses require later evaluation against
    authoritative evidence.

26. When describing recurrence, persistence, direction, or consistency,
    explicitly identify the supplied observation window and state the
    supporting count out of the evaluable count.

27. Do not use "always", "never", "consistently", "persistent", or equivalent
    unbounded language unless the claim is immediately limited to the supplied
    observation window.

28. Deterministic relationship summaries are authoritative derived evidence.
    Do not describe them as AI-generated patterns or learned relationships.

29. If no contradictory observations are supplied, state that contradiction
    could not be fully evaluated. Do not conclude that no contradiction exists
    outside the supplied evidence.

30. Distinguish weakening evidence from falsifying evidence. Weakening evidence
    reduces support. Falsifying evidence satisfies the stated falsification
    condition.

31. For snapshot-analysis, do not return recurrent, directional, historical,
    or longitudinal patterns.

32. For hypothesis-generation, hypotheses are the primary output. Avoid
    predictions unless they are necessary to test a returned hypothesis.

33. For bounded-prediction, predictions are the primary output. Avoid
    unnecessary hypotheses.

34. For longitudinal-analysis, use deterministic relationship summaries when
    available and report supporting, contradicting, equal, and evaluable
    observation counts.

RESPONSE FORMAT

Return valid JSON only using this exact top-level structure:

{
  "summary": "string",
  "observedPatterns": [
    {
      "patternId": "pattern-001",
      "statement": "string",
      "patternType": "single-observation | recurrent | directional | relational | anomalous | insufficient-evidence",
      "evidenceBasis": ["string"],
      "observationIds": ["string"],
      "persistenceCount": 1,
      "contradictingObservationIds": ["string"],
      "supportingObservationCount": 1,
      "contradictingObservationCount": 0,
      "evaluableObservationCount": 1,
      "supportRatio": 1.0,
      "competingExplanation": "string or null",
      "confidence": 0.0
    }
  ],
  "hypotheses": [
    {
      "hypothesisId": "hypothesis-001",
      "statement": "string",
      "evidenceBasis": ["string"],
      "observationIds": ["string"],
      "rationale": "string",
      "weakeningCondition": "string",
      "falsificationCondition": "string",
      "supportingFutureEvidence": ["string"],
      "weakeningFutureEvidence": ["string"],
      "requiredFutureEvidence": ["string"],
      "status": "proposed",
      "confidence": 0.0
    }
  ],
  "predictions": [
    {
      "predictionId": "prediction-001",
      "statement": "string",
      "evidenceBasis": ["string"],
      "observationIds": ["string"],
      "predictionWindow": "next-observation | next-3-observations | next-5-observations | unspecified-future-observation",
      "targetStateField": "string",
      "predictedCondition": "string",
      "falsificationCondition": "string",
      "evaluationInstruction": "string",
      "confidence": 0.0,
      "status": "proposed"
    }
  ],
  "unresolvedQuestions": ["string"],
  "evidenceUsed": ["string"],
  "unavailableEvidence": ["string"],
  "uncertaintyNotes": ["string"],
  "modelConfidence": 0.0
}
`.trim()

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return JSON.stringify({
      error: "Unable to serialize Equation Engine experimental evidence."
    })
  }
}

function normalizeConfidence(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0
  }

  return Math.min(1, Math.max(0, value))
}

function confidenceLabel(
  confidence: number
): EquationEngineAIExperimentConfidenceLabel {
  if (confidence < 0.2) {
    return "very-low"
  }

  if (confidence < 0.4) {
    return "low"
  }

  if (confidence < 0.7) {
    return "moderate"
  }

  if (confidence < 0.9) {
    return "high"
  }

  return "very-high"
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === "string")
}

function recordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !Array.isArray(item)
  )
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function nullableNonNegativeInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : null
}

function objectRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function summarizeEquationEvidence(value: unknown): Array<{
  equation: string
  rawValue: number | null
  normalizedSupport: number | null
  measuredFacts: string[]
  condition: string | null
  contribution: string | null
  meaning: string | null
}> {
  return recordArray(value).map(item => ({
    equation: stringValue(item.equation, "unknown"),
    rawValue: finiteNumber(item.rawValue),
    normalizedSupport: finiteNumber(item.normalizedSupport),
    measuredFacts: stringArray(item.measuredFacts).slice(0, 4),
    condition: nullableString(item.condition),
    contribution: nullableString(item.contribution),
    meaning: nullableString(item.meaning)
  }))
}

function findExtremeEquations(
  equationSupport: Array<{
    equation: string
    normalizedSupport: number | null
    condition: string | null
    contribution: string | null
  }>,
  contribution: "supporting" | "limiting"
): {
  equations: string[]
  tie: boolean
  value: number | null
} {
  const candidates = equationSupport.filter(
    item =>
      item.contribution === contribution &&
      typeof item.normalizedSupport === "number"
  )

  if (candidates.length === 0) {
    return {
      equations: [],
      tie: false,
      value: null
    }
  }

  const candidateValues = candidates.map(
    item => item.normalizedSupport as number
  )

  const extremeValue =
    contribution === "supporting"
      ? Math.max(...candidateValues)
      : Math.min(...candidateValues)

  const equations = candidates
    .filter(item => item.normalizedSupport === extremeValue)
    .map(item => item.equation)
    .sort()

  return {
    equations,
    tie: equations.length > 1,
    value: extremeValue
  }
}

function buildWithinObservationRelationships(
  equationSupport: Array<{
    equation: string
    normalizedSupport: number | null
    condition: string | null
    contribution: string | null
  }>,
  strongestSupportingEquations: string[],
  strongestLimitingEquations: string[]
): EquationEngineAIWithinObservationRelationship[] {
  const relationships: EquationEngineAIWithinObservationRelationship[] = []

  const numericSupport = equationSupport.filter(
    item => typeof item.normalizedSupport === "number"
  )

  for (let leftIndex = 0; leftIndex < numericSupport.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < numericSupport.length;
      rightIndex += 1
    ) {
      const left = numericSupport[leftIndex]
      const right = numericSupport[rightIndex]

      const leftValue = left.normalizedSupport as number
      const rightValue = right.normalizedSupport as number

      const operator: EquationEngineAIWithinObservationRelationship["operator"] =
        leftValue > rightValue
          ? "greater-than"
          : leftValue < rightValue
            ? "less-than"
            : "equal-to"

      const symbol =
        operator === "greater-than" ? ">" : operator === "less-than" ? "<" : "="

      relationships.push({
        relationId: `relation-${sanitizeIdentifierPart(
          left.equation
        )}-${operator}-${sanitizeIdentifierPart(right.equation)}`,

        relationType: "support-ordering",

        statement: `${left.equation} normalized support ${symbol} ${right.equation} normalized support.`,

        leftField: `${left.equation}.normalizedSupport`,

        operator,

        rightField: `${right.equation}.normalizedSupport`,

        authoritative: true
      })
    }
  }

  if (strongestSupportingEquations.length > 1) {
    relationships.push({
      relationId: "relation-shared-support-dominance",

      relationType: "shared-support-dominance",

      statement: `${strongestSupportingEquations.join(
        " and "
      )} shared the highest supporting normalized value.`,

      leftField: strongestSupportingEquations.join("|"),

      operator: "equal-to",

      rightField: "highestSupportingNormalizedValue",

      authoritative: true
    })
  }

  if (strongestLimitingEquations.length > 1) {
    relationships.push({
      relationId: "relation-shared-limiting-bottleneck",

      relationType: "shared-limiting-bottleneck",

      statement: `${strongestLimitingEquations.join(
        " and "
      )} shared the lowest limiting normalized value.`,

      leftField: strongestLimitingEquations.join("|"),

      operator: "equal-to",

      rightField: "lowestLimitingNormalizedValue",

      authoritative: true
    })
  }

  return relationships
}

export function summarizeEquationEngineHistoricalState(
  state: EquationEngineAIExperimentHistoricalState
): EquationEngineAIExperimentHistoricalSummary {
  const interpretationState = state.interpretationState
  const interpretationRecord = objectRecord(interpretationState)
  const evidence = objectRecord(interpretationRecord?.evidence)

  const equationSupport = summarizeEquationEvidence(
    evidence?.equationEvidence
  ).map(item => ({
    equation: item.equation,
    normalizedSupport: item.normalizedSupport,
    condition: item.condition,
    contribution: item.contribution
  }))

  const strongestSupporting = findExtremeEquations(
    equationSupport,
    "supporting"
  )

  const strongestLimiting = findExtremeEquations(equationSupport, "limiting")

  const withinObservationRelationships = buildWithinObservationRelationships(
    equationSupport,
    strongestSupporting.equations,
    strongestLimiting.equations
  )

  const pathwayScores = objectRecord(evidence?.pathwayScores)

  return {
    observationId: state.observationId,
    previousObservationId:
      state.previousObservationId ??
      interpretationState.previousObservationId ??
      null,
    generatedAt: state.generatedAt,
    resonanceHash: state.resonanceHash,
    ledgerHash: state.ledgerHash,
    lifecycleStatus: nullableString(evidence?.lifecycleStatus),
    strongestSupportingEquations: strongestSupporting.equations,
    strongestLimitingEquations: strongestLimiting.equations,
    supportingEquationTie: strongestSupporting.tie,
    limitingEquationTie: strongestLimiting.tie,
    highestSupportingValue: strongestSupporting.value,
    lowestLimitingValue: strongestLimiting.value,
    equationSupport,
    withinObservationRelationships,
    pathwayScores: pathwayScores
      ? {
          integratedRelationalReference: finiteNumber(
            pathwayScores.integratedRelationalReference
          ),
          integratedEvolutionaryRecurrence: finiteNumber(
            pathwayScores.integratedEvolutionaryRecurrence
          ),
          lifecycleScore: finiteNumber(pathwayScores.lifecycleScore)
        }
      : null
  }
}

function buildCompactCurrentInterpretation(
  interpretationState: EquationEngineInterpretationState
): Record<string, unknown> {
  const interpretationRecord = objectRecord(interpretationState)
  const evidence = objectRecord(interpretationRecord?.evidence)

  return {
    phase: interpretationState.phase,
    observationId: interpretationState.observationId,
    previousObservationId: interpretationState.previousObservationId,
    interpretationReady: interpretationState.interpretationReady,
    interpretationConfidence: interpretationState.interpretationConfidence,
    evidence: evidence
      ? {
          observationId: evidence.observationId ?? null,
          previousObservationId: evidence.previousObservationId ?? null,
          equationEngineReady: evidence.equationEngineReady ?? null,
          lifecycleReady: evidence.lifecycleReady ?? null,
          comparisonReady: evidence.comparisonReady ?? null,
          lifecycleStatus: evidence.lifecycleStatus ?? null,
          equationEvidence: summarizeEquationEvidence(
            evidence.equationEvidence
          ),
          pathwayScores: evidence.pathwayScores ?? null
        }
      : null,
    deterministicFindings: interpretationState.findings,
    pathwayInterpretations: interpretationState.pathwayInterpretations,
    wholeEngineInterpretation: interpretationState.wholeEngineInterpretation,
    rule: interpretationState.rule
  }
}

function normalizePatternType(
  value: unknown
): EquationEngineAIObservedPattern["patternType"] {
  const allowed: EquationEngineAIObservedPattern["patternType"][] = [
    "single-observation",
    "recurrent",
    "directional",
    "relational",
    "anomalous",
    "insufficient-evidence"
  ]

  return allowed.includes(
    value as EquationEngineAIObservedPattern["patternType"]
  )
    ? (value as EquationEngineAIObservedPattern["patternType"])
    : "insufficient-evidence"
}

function normalizePredictionWindow(
  value: unknown,
  fallback: EquationEngineAIExperimentPredictionWindow
): EquationEngineAIExperimentPredictionWindow {
  const allowed: EquationEngineAIExperimentPredictionWindow[] = [
    "next-observation",
    "next-3-observations",
    "next-5-observations",
    "unspecified-future-observation"
  ]

  return allowed.includes(value as EquationEngineAIExperimentPredictionWindow)
    ? (value as EquationEngineAIExperimentPredictionWindow)
    : fallback
}

function normalizeProposedStatus(
  _value: unknown
): EquationEngineAIExperimentClaimStatus {
  // New AI-generated claims are always proposed.
  // Later deterministic evaluation may change this status.
  return "proposed"
}

function sanitizeIdentifierPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

function buildExperimentId(
  observationId: string | null,
  generatedAt: string
): string {
  const observationPart = observationId
    ? sanitizeIdentifierPart(observationId.slice(0, 16))
    : "no-observation"

  const timestampPart = generatedAt.replace(/[^0-9]/g, "").slice(0, 17)

  return ["equation-engine-ai-experiment", observationPart, timestampPart].join(
    "-"
  )
}

function extractHistoricalObservationIds(
  historicalStates: EquationEngineAIExperimentHistoricalState[]
): string[] {
  const ids = historicalStates
    .map(state => state.observationId)
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0
    )

  return Array.from(new Set(ids))
}

function sanitizeHistoricalStates(
  historicalStates: EquationEngineAIExperimentHistoricalState[]
): EquationEngineAIExperimentHistoricalState[] {
  const uniqueStates = new Map<
    string,
    EquationEngineAIExperimentHistoricalState
  >()

  for (const state of historicalStates) {
    const key =
      state.observationId ?? `missing-observation-${uniqueStates.size}`

    if (!uniqueStates.has(key)) {
      uniqueStates.set(key, state)
    }
  }

  return Array.from(uniqueStates.values()).slice(-4)
}

function buildExperimentModeInstruction(
  experimentType: EquationEngineAIExperimentType,
  historicalObservationCount: number
): string {
  if (experimentType === "snapshot-analysis") {
    return [
      "MODE: SNAPSHOT ANALYSIS",
      "Analyze only the current authoritative interpretation as a single observation.",
      "Do not make recurrent, directional, persistent, historical, or longitudinal claims.",
      "Historical observations, if supplied, are context only and must not change the experiment type.",
      "Return observed patterns grounded in the current observation.",
      "Return at most one cautious hypothesis if materially supported.",
      "Do not return predictions."
    ].join("\n")
  }

  if (experimentType === "longitudinal-analysis") {
    return [
      "MODE: LONGITUDINAL ANALYSIS",
      `The supplied historical window contains ${historicalObservationCount} identified observations.`,
      "Prioritize recurrent, relational, directional, anomalous, and contradictory patterns across the supplied window.",
      "Every recurrence claim must state the supporting count and evaluable count.",
      "Use authoritative deterministic relationship summaries when available.",
      "Do not generalize beyond the supplied observation window."
    ].join("\n")
  }

  if (experimentType === "hypothesis-generation") {
    return [
      "MODE: HYPOTHESIS GENERATION",
      "Prioritize a small number of materially grounded and falsifiable hypotheses.",
      "Every hypothesis must distinguish weakening evidence from falsifying evidence.",
      "Return patterns only when they directly support a hypothesis.",
      "Return predictions only when necessary to test a returned hypothesis."
    ].join("\n")
  }

  return [
    "MODE: BOUNDED PREDICTION",
    "Prioritize measurable and falsifiable predictions.",
    "Every prediction must identify an authoritative future field or relationship.",
    "Avoid unnecessary hypotheses.",
    "Do not predict conditions that cannot be evaluated from future Equation Engine or Interpretation states."
  ].join("\n")
}

function defaultExperimentQuestion(
  experimentType: EquationEngineAIExperimentType
): string {
  if (experimentType === "snapshot-analysis") {
    return "Analyze the current Equation Engine interpretation as one authoritative observation. Identify snapshot-level relationships only, avoid longitudinal claims, and return no prediction."
  }

  if (experimentType === "longitudinal-analysis") {
    return "Identify evidence-bound patterns, relationships, contradictions, and changes across the supplied Equation Engine observation window. State the exact observation count supporting each longitudinal claim."
  }

  if (experimentType === "hypothesis-generation") {
    return "Generate a small number of falsifiable hypotheses grounded in the supplied authoritative Equation Engine evidence. Clearly distinguish supporting, weakening, required, and falsifying future evidence."
  }

  return "Generate bounded predictions about fields or relationships observable in future authoritative Equation Engine interpretations. Include a measurable prediction window, falsification condition, and deterministic evaluation instruction."
}

function buildCrossObservationRelationshipSummaries(
  historicalSummaries: EquationEngineAIExperimentHistoricalSummary[]
): EquationEngineAIDeterministicRelationshipSummary[] {
  const equationNames = Array.from(
    new Set(
      historicalSummaries.flatMap(summary =>
        summary.equationSupport.map(item => item.equation)
      )
    )
  ).sort()

  const relationships: EquationEngineAIDeterministicRelationshipSummary[] = []

  for (let leftIndex = 0; leftIndex < equationNames.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < equationNames.length;
      rightIndex += 1
    ) {
      const leftEquation = equationNames[leftIndex]
      const rightEquation = equationNames[rightIndex]

      const supportingObservationIds: string[] = []
      const contradictingObservationIds: string[] = []
      const equalObservationIds: string[] = []
      const unavailableObservationIds: string[] = []

      for (const summary of historicalSummaries) {
        const observationId = summary.observationId

        if (!observationId) {
          continue
        }

        const left = summary.equationSupport.find(
          item => item.equation === leftEquation
        )

        const right = summary.equationSupport.find(
          item => item.equation === rightEquation
        )

        if (
          typeof left?.normalizedSupport !== "number" ||
          typeof right?.normalizedSupport !== "number"
        ) {
          unavailableObservationIds.push(observationId)
          continue
        }

        if (left.normalizedSupport > right.normalizedSupport) {
          supportingObservationIds.push(observationId)
        } else if (left.normalizedSupport < right.normalizedSupport) {
          contradictingObservationIds.push(observationId)
        } else {
          equalObservationIds.push(observationId)
        }
      }

      const evaluableObservationCount =
        supportingObservationIds.length +
        contradictingObservationIds.length +
        equalObservationIds.length

      if (evaluableObservationCount === 0) {
        continue
      }

      const supportRatio =
        supportingObservationIds.length / evaluableObservationCount

      const contradictionRatio =
        contradictingObservationIds.length / evaluableObservationCount

      const equalityRatio =
        equalObservationIds.length / evaluableObservationCount

      relationships.push({
        relationId: `relation-${sanitizeIdentifierPart(
          leftEquation
        )}-greater-than-${sanitizeIdentifierPart(rightEquation)}`,

        relationType: "support-ordering",

        statement: `${leftEquation} normalized support exceeded ${rightEquation} normalized support in ${supportingObservationIds.length} of ${evaluableObservationCount} evaluable supplied observations, was lower in ${contradictingObservationIds.length}, and was equal in ${equalObservationIds.length}.`,

        leftField: `${leftEquation}.normalizedSupport`,

        operator: "greater-than",

        rightField: `${rightEquation}.normalizedSupport`,

        supportingObservationIds,

        contradictingObservationIds,

        equalObservationIds,

        unavailableObservationIds,

        supportingObservationCount: supportingObservationIds.length,

        contradictingObservationCount: contradictingObservationIds.length,

        equalObservationCount: equalObservationIds.length,

        unavailableObservationCount: unavailableObservationIds.length,

        evaluableObservationCount,

        supportRatio,

        contradictionRatio,

        equalityRatio,

        authoritative: true
      })
    }
  }

  return relationships
}

export function generateEquationEngineAIExperimentRequest(
  input: EquationEngineAIExperimentInput
): EquationEngineAIExperimentRequest {
  const interpretationState = input.interpretationState

  const historicalStates = sanitizeHistoricalStates(
    input.historicalStates ?? []
  )

  const experimentType =
    input.experimentType ??
    (historicalStates.length > 0
      ? "longitudinal-analysis"
      : "snapshot-analysis")

  const audience = input.audience ?? "research"

  const depth = input.depth ?? "standard"

  const predictionWindow = input.predictionWindow ?? "next-observation"

  const experimentQuestion =
    input.experimentQuestion?.trim() ||
    defaultExperimentQuestion(experimentType)

  const generatedAt = new Date().toISOString()

  const experimentId = buildExperimentId(
    interpretationState.observationId,
    generatedAt
  )

  const historicalObservationIds =
    extractHistoricalObservationIds(historicalStates)

  const historicalSummaries = historicalStates.map(
    summarizeEquationEngineHistoricalState
  )

  const deterministicRelationshipSummaries =
    buildCrossObservationRelationshipSummaries(historicalSummaries)

  const provenance: EquationEngineAIExperimentProvenance = {
    observationId: interpretationState.observationId,

    previousObservationId: interpretationState.previousObservationId,

    historicalObservationIds,

    historicalObservationCount: historicalObservationIds.length,

    interpretationConfidence:
      typeof interpretationState.interpretationConfidence === "number"
        ? interpretationState.interpretationConfidence
        : null,

    interpretationReady: interpretationState.interpretationReady
  }

  const experimentModeInstruction = buildExperimentModeInstruction(
    experimentType,
    historicalObservationIds.length
  )

  const groundedPayload = {
    experiment: {
      experimentId,
      experimentType,
      experimentQuestion,
      audience,
      depth,
      predictionWindow,
      experimentModeInstruction
    },

    provenance,

    authoritativeCurrentInterpretation:
      buildCompactCurrentInterpretation(interpretationState),

    authoritativeHistoricalSummaries: historicalSummaries,

    authoritativeDeterministicRelationshipSummaries:
      deterministicRelationshipSummaries,

    evidenceAvailability: {
      currentInterpretationAvailable: interpretationState.interpretationReady,

      historicalObservationCount: historicalObservationIds.length,

      deterministicRelationshipSummaryCount:
        deterministicRelationshipSummaries.length,

      longitudinalAnalysisAvailable: historicalObservationIds.length >= 2,

      boundedPredictionAvailable: interpretationState.interpretationReady
    }
  }

  const groundedEvidencePayload = safeStringify(groundedPayload)

  const userContent = [
    `Experiment type: ${experimentType}`,
    `Requested audience: ${audience}`,
    `Requested depth: ${depth}`,
    `Prediction window: ${predictionWindow}`,
    "",
    experimentModeInstruction,
    "",
    `Experiment question: ${experimentQuestion}`,
    "Grounded Equation Engine experimental evidence:",
    groundedEvidencePayload
  ].join("\n")

  return {
    phase: "Equation Engine AI Experiment Request",

    experimentId,

    experimentType,

    experimentQuestion,

    audience,

    depth,

    predictionWindow,

    experimentModeInstruction,

    provenance,

    systemInstruction: SYSTEM_INSTRUCTION,

    groundedEvidencePayload,

    messages: [
      {
        role: "system",
        content: SYSTEM_INSTRUCTION
      },
      {
        role: "user",
        content: userContent
      }
    ],

    experimentRequestReady: interpretationState.interpretationReady,

    authoritative: false,

    stateMutating: false,

    equationEngineAIExperimentActive: true,

    generatedAt,

    rule: "The AI experiment may observe authoritative Equation Engine evidence, propose explicitly non-authoritative patterns and hypotheses, and make bounded falsifiable predictions. It may not alter deterministic state, create authoritative findings, evaluate its own predictions, or present internal software behavior as proof of external scientific, physical, biological, metaphysical, theological, cognitive, or consciousness claims."
  }
}

function extractJSONCandidate(rawResponse: string): string {
  const trimmed = rawResponse.trim()

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim()
  }

  const firstBrace = trimmed.indexOf("{")

  const lastBrace = trimmed.lastIndexOf("}")

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }

  return trimmed
}

function parseObservedPatterns(
  value: unknown
): EquationEngineAIObservedPattern[] {
  return recordArray(value).map((item, index) => {
    const confidence = normalizeConfidence(item.confidence)

    return {
      patternId: stringValue(
        item.patternId,
        `pattern-${String(index + 1).padStart(3, "0")}`
      ),

      statement: stringValue(
        item.statement,
        "No pattern statement was returned."
      ),

      patternType: normalizePatternType(item.patternType),

      evidenceBasis: stringArray(item.evidenceBasis),

      observationIds: stringArray(item.observationIds),

      persistenceCount: nullableNonNegativeInteger(item.persistenceCount),

      contradictingObservationIds: stringArray(
        item.contradictingObservationIds
      ),

      supportingObservationCount: nullableNonNegativeInteger(
        item.supportingObservationCount
      ),

      contradictingObservationCount: nullableNonNegativeInteger(
        item.contradictingObservationCount
      ),

      evaluableObservationCount: nullableNonNegativeInteger(
        item.evaluableObservationCount
      ),

      supportRatio:
        typeof item.supportRatio === "number" &&
        Number.isFinite(item.supportRatio)
          ? normalizeConfidence(item.supportRatio)
          : null,

      competingExplanation: nullableString(item.competingExplanation),

      confidence,

      confidenceLabel: confidenceLabel(confidence),

      authoritative: false as const
    }
  })
}

function parseHypotheses(value: unknown): EquationEngineAIHypothesis[] {
  return recordArray(value).map((item, index) => {
    const confidence = normalizeConfidence(item.confidence)

    return {
      hypothesisId: stringValue(
        item.hypothesisId,
        `hypothesis-${String(index + 1).padStart(3, "0")}`
      ),

      statement: stringValue(
        item.statement,
        "No hypothesis statement was returned."
      ),

      evidenceBasis: stringArray(item.evidenceBasis),

      observationIds: stringArray(item.observationIds),

      rationale: stringValue(item.rationale, "No rationale was returned."),

      weakeningCondition: stringValue(
        item.weakeningCondition,
        "No separate weakening condition was returned."
      ),

      falsificationCondition: stringValue(
        item.falsificationCondition,
        "No valid falsification condition was returned."
      ),

      supportingFutureEvidence: stringArray(item.supportingFutureEvidence),

      weakeningFutureEvidence: stringArray(item.weakeningFutureEvidence),

      requiredFutureEvidence: stringArray(item.requiredFutureEvidence),

      status: normalizeProposedStatus(item.status),

      confidence,

      confidenceLabel: confidenceLabel(confidence),

      authoritative: false as const
    }
  })
}

function parsePredictions(
  value: unknown,
  fallbackWindow: EquationEngineAIExperimentPredictionWindow
): EquationEngineAIPrediction[] {
  return recordArray(value).map((item, index) => {
    const confidence = normalizeConfidence(item.confidence)

    return {
      predictionId: stringValue(
        item.predictionId,
        `prediction-${String(index + 1).padStart(3, "0")}`
      ),

      statement: stringValue(
        item.statement,
        "No prediction statement was returned."
      ),

      evidenceBasis: stringArray(item.evidenceBasis),

      observationIds: stringArray(item.observationIds),

      predictionWindow: normalizePredictionWindow(
        item.predictionWindow,
        fallbackWindow
      ),

      targetStateField: stringValue(item.targetStateField, "unspecified"),

      predictedCondition: stringValue(
        item.predictedCondition,
        "No predicted condition was returned."
      ),

      falsificationCondition: stringValue(
        item.falsificationCondition,
        "No valid falsification condition was returned."
      ),

      evaluationInstruction: stringValue(
        item.evaluationInstruction,
        "Compare the prediction with the corresponding field in the next authoritative Equation Engine interpretation."
      ),

      confidence,

      confidenceLabel: confidenceLabel(confidence),

      status: normalizeProposedStatus(item.status),

      authoritative: false as const
    }
  })
}

export function parseEquationEngineAIExperiment(
  rawResponse: string,
  options: {
    request: EquationEngineAIExperimentRequest

    model?: string | null
  }
): EquationEngineAIExperimentResult {
  const request = options.request

  let parsed: Record<string, unknown> = {}

  let parseFailure: string | null = null

  try {
    const candidate = extractJSONCandidate(rawResponse)

    const parsedValue = JSON.parse(candidate)

    if (
      typeof parsedValue === "object" &&
      parsedValue !== null &&
      !Array.isArray(parsedValue)
    ) {
      parsed = parsedValue as Record<string, unknown>
    } else {
      parseFailure =
        "The model response parsed successfully but did not return a JSON object."
    }
  } catch {
    parseFailure = "The model response could not be parsed as structured JSON."
  }

  const modelConfidence =
    typeof parsed.modelConfidence === "number"
      ? normalizeConfidence(parsed.modelConfidence)
      : null

  const uncertaintyNotes = stringArray(parsed.uncertaintyNotes)

  if (parseFailure) {
    uncertaintyNotes.unshift(parseFailure)
  }

  const parsedPatterns = parseObservedPatterns(parsed.observedPatterns)

  const parsedHypotheses = parseHypotheses(parsed.hypotheses)

  const parsedPredictions = parsePredictions(
    parsed.predictions,
    request.predictionWindow
  )

  const modeComplianceNotes: string[] = []

  const observedPatterns =
    request.experimentType === "snapshot-analysis"
      ? parsedPatterns.filter(pattern => {
          const permitted =
            pattern.patternType === "single-observation" ||
            pattern.patternType === "relational" ||
            pattern.patternType === "anomalous" ||
            pattern.patternType === "insufficient-evidence"

          if (!permitted) {
            modeComplianceNotes.push(
              `${pattern.patternId} was removed because snapshot-analysis does not permit ${pattern.patternType} pattern output.`
            )
          }

          return permitted
        })
      : parsedPatterns

  const hypotheses =
    request.experimentType === "snapshot-analysis"
      ? parsedHypotheses.slice(0, 1)
      : request.experimentType === "bounded-prediction"
        ? parsedHypotheses.slice(0, 1)
        : parsedHypotheses

  if (parsedHypotheses.length > hypotheses.length) {
    modeComplianceNotes.push(
      `${parsedHypotheses.length - hypotheses.length} model-generated hypothesis result(s) were removed to enforce the selected experiment mode.`
    )
  }

  const predictions =
    request.experimentType === "snapshot-analysis"
      ? []
      : request.experimentType === "hypothesis-generation"
        ? parsedPredictions.slice(0, 1)
        : parsedPredictions

  if (parsedPredictions.length > predictions.length) {
    modeComplianceNotes.push(
      `${parsedPredictions.length - predictions.length} model-generated prediction result(s) were removed to enforce the selected experiment mode.`
    )
  }

  return {
    phase: "Equation Engine AI Experiment",

    experimentId: request.experimentId,

    experimentType: request.experimentType,

    experimentQuestion: request.experimentQuestion,

    observationId: request.provenance.observationId,

    previousObservationId: request.provenance.previousObservationId,

    historicalObservationIds: request.provenance.historicalObservationIds,

    model: options.model ?? null,

    generatedAt: new Date().toISOString(),

    summary: stringValue(
      parsed.summary,
      parseFailure
        ? "The AI experiment did not return a usable structured result."
        : "No experimental summary was returned."
    ),

    observedPatterns,

    hypotheses,

    predictions,

    unresolvedQuestions: stringArray(parsed.unresolvedQuestions),

    evidenceUsed: stringArray(parsed.evidenceUsed),

    unavailableEvidence: stringArray(parsed.unavailableEvidence),

    uncertaintyNotes,

    modeComplianceNotes,

    interpretationConfidence: request.provenance.interpretationConfidence,

    modelConfidence,

    modelConfidenceLabel:
      modelConfidence === null ? null : confidenceLabel(modelConfidence),

    experimentGrounded: parseFailure === null && request.experimentRequestReady,

    authoritative: false,

    stateMutating: false,

    equationEngineAIExperimentActive: true,

    rule: "AI experimental observations, hypotheses, and predictions are non-authoritative research artifacts derived from supplied Equation Engine evidence. They do not modify deterministic state and must be evaluated against later authoritative observations before their status may change."
  }
}

export function buildEquationEngineAIExperimentResponse(
  result: EquationEngineAIExperimentResult
): string {
  const provenance = [
    `Experiment ID: ${result.experimentId}`,
    `Experiment type: ${result.experimentType}`,
    `Observation ID: ${result.observationId ?? "unavailable"}`,
    `Previous observation ID: ${result.previousObservationId ?? "unavailable"}`,
    `Historical observations supplied: ${result.historicalObservationIds.length}`,
    `Model: ${result.model ?? "unavailable"}`,
    `Generated: ${result.generatedAt}`,
    `Interpretation confidence: ${
      result.interpretationConfidence ?? "unavailable"
    }`,
    `Model confidence: ${
      result.modelConfidence === null
        ? "unavailable"
        : `${result.modelConfidence} (${result.modelConfidenceLabel})`
    }`
  ]

  const patterns =
    result.observedPatterns.length > 0
      ? result.observedPatterns.flatMap(pattern => [
          `${pattern.patternId}: ${pattern.statement}`,
          `type: ${pattern.patternType}`,
          `confidence: ${pattern.confidence} (${pattern.confidenceLabel})`,
          `observations: ${
            pattern.observationIds.length > 0
              ? pattern.observationIds.join(", ")
              : "none supplied"
          }`,
          `supporting observations: ${
            pattern.supportingObservationCount ?? "unavailable"
          }`,

          `contradicting observations: ${
            pattern.contradictingObservationCount ?? "unavailable"
          }`,

          `evaluable observations: ${
            pattern.evaluableObservationCount ?? "unavailable"
          }`,

          `support ratio: ${pattern.supportRatio ?? "unavailable"}`,
          `evidence: ${
            pattern.evidenceBasis.length > 0
              ? pattern.evidenceBasis.join(" | ")
              : "none returned"
          }`,
          `competing explanation: ${
            pattern.competingExplanation ?? "none returned"
          }`,
          ""
        ])
      : ["- No AI-observed patterns were returned."]

  const hypotheses =
    result.hypotheses.length > 0
      ? result.hypotheses.flatMap(hypothesis => [
          `${hypothesis.hypothesisId}: ${hypothesis.statement}`,
          `status: ${hypothesis.status}`,
          `confidence: ${hypothesis.confidence} (${hypothesis.confidenceLabel})`,
          `rationale: ${hypothesis.rationale}`,
          `evidence: ${
            hypothesis.evidenceBasis.length > 0
              ? hypothesis.evidenceBasis.join(" | ")
              : "none returned"
          }`,
          `weakening condition: ${hypothesis.weakeningCondition}`,
          `falsification: ${hypothesis.falsificationCondition}`,
          `future support: ${
            hypothesis.supportingFutureEvidence.length > 0
              ? hypothesis.supportingFutureEvidence.join(" | ")
              : "none returned"
          }`,
          `future weakening: ${
            hypothesis.weakeningFutureEvidence.length > 0
              ? hypothesis.weakeningFutureEvidence.join(" | ")
              : "none returned"
          }`,
          `required evidence: ${
            hypothesis.requiredFutureEvidence.length > 0
              ? hypothesis.requiredFutureEvidence.join(" | ")
              : "none returned"
          }`,
          ""
        ])
      : ["- No falsifiable hypotheses were returned."]

  const predictions =
    result.predictions.length > 0
      ? result.predictions.flatMap(prediction => [
          `${prediction.predictionId}: ${prediction.statement}`,
          `status: ${prediction.status}`,
          `window: ${prediction.predictionWindow}`,
          `target: ${prediction.targetStateField}`,
          `predicted condition: ${prediction.predictedCondition}`,
          `confidence: ${prediction.confidence} (${prediction.confidenceLabel})`,
          `evidence: ${
            prediction.evidenceBasis.length > 0
              ? prediction.evidenceBasis.join(" | ")
              : "none returned"
          }`,
          `falsification: ${prediction.falsificationCondition}`,
          `evaluation: ${prediction.evaluationInstruction}`,
          ""
        ])
      : ["- No bounded predictions were returned."]

  return [
    "Equation Engine AI Experiment",
    "",
    ...provenance,
    "",
    "Experiment Question:",
    result.experimentQuestion,
    "",
    "Summary:",
    result.summary,
    "",
    "AI-Observed Patterns:",
    ...patterns,
    "",
    "Hypotheses:",
    ...hypotheses,
    "",
    "Predictions:",
    ...predictions,
    "",
    "Unresolved Questions:",
    ...(result.unresolvedQuestions.length > 0
      ? result.unresolvedQuestions.map(item => `- ${item}`)
      : ["- No unresolved questions were returned."]),
    "",
    "Evidence Used:",
    ...(result.evidenceUsed.length > 0
      ? result.evidenceUsed.map(item => `- ${item}`)
      : ["- No evidence inventory was returned."]),
    "",
    "Unavailable Evidence:",
    ...(result.unavailableEvidence.length > 0
      ? result.unavailableEvidence.map(item => `- ${item}`)
      : ["- No unavailable evidence was separately identified."]),
    "",
    "Uncertainty Notes:",
    ...(result.uncertaintyNotes.length > 0
      ? result.uncertaintyNotes.map(item => `- ${item}`)
      : ["- No additional uncertainty notes were returned."]),
    "",
    "Experimental Status:",
    "Mode Compliance Notes:",

    ...(result.modeComplianceNotes.length > 0
      ? result.modeComplianceNotes.map(item => `- ${item}`)
      : ["- No output required deterministic mode correction."]),

    "",
    "- authoritative: false",
    "- stateMutating: false",
    `- experimentGrounded: ${result.experimentGrounded}`,
    "",
    result.rule
  ].join("\n")
}
