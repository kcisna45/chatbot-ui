export type EquationEngineEvidenceOutcome =
  | "supports"
  | "contradicts"
  | "unavailable"

export type EquationEngineRecurrenceClassification =
  | "unanimous"
  | "strong-majority"
  | "majority"
  | "mixed"
  | "weak"
  | "unsupported"
  | "insufficient-evidence"

export type EquationEngineEvidenceStrength =
  | "very-low"
  | "low"
  | "moderate"
  | "high"
  | "very-high"

export interface EquationEngineEvidenceRecord {
  observationId: string

  outcome: EquationEngineEvidenceOutcome

  reason: string

  value?: unknown
}

export interface EquationEngineEvidenceThresholds {
  minimumEvaluatedObservations: number

  strongMajorityRatio: number

  majorityRatio: number

  mixedRatio: number
}

export interface EquationEngineEvidenceAssessment {
  claimId: string

  claim: string

  totalObservations: number

  evaluatedObservations: number

  supportingObservations: number

  contradictingObservations: number

  unavailableObservations: number

  supportRatio: number | null

  contradictionRatio: number | null

  evidenceCoverage: number

  recurrenceClassification: EquationEngineRecurrenceClassification

  thresholdSatisfied: boolean

  confidence: number

  confidenceLabel: EquationEngineEvidenceStrength

  supportingObservationIds: string[]

  contradictingObservationIds: string[]

  unavailableObservationIds: string[]

  evidenceRecords: EquationEngineEvidenceRecord[]

  permittedLanguage: string[]

  prohibitedLanguage: string[]

  authoritativeObservationId: string | null
}

export interface AssessEquationEngineEvidenceInput {
  claimId: string

  claim: string

  records: EquationEngineEvidenceRecord[]

  authoritativeObservationId?: string | null

  thresholds?: Partial<EquationEngineEvidenceThresholds>
}

const DEFAULT_THRESHOLDS: EquationEngineEvidenceThresholds = {
  minimumEvaluatedObservations: 2,
  strongMajorityRatio: 0.8,
  majorityRatio: 0.6,
  mixedRatio: 0.4
}

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function roundRatio(value: number): number {
  return Math.round(value * 10000) / 10000
}

function classifyRecurrence(
  evaluatedObservations: number,
  supportingObservations: number,
  contradictingObservations: number,
  supportRatio: number | null,
  thresholds: EquationEngineEvidenceThresholds
): EquationEngineRecurrenceClassification {
  if (
    evaluatedObservations < thresholds.minimumEvaluatedObservations ||
    supportRatio === null
  ) {
    return "insufficient-evidence"
  }

  if (
    supportingObservations === evaluatedObservations &&
    contradictingObservations === 0
  ) {
    return "unanimous"
  }

  if (supportRatio >= thresholds.strongMajorityRatio) {
    return "strong-majority"
  }

  if (supportRatio >= thresholds.majorityRatio) {
    return "majority"
  }

  if (supportRatio >= thresholds.mixedRatio) {
    return "mixed"
  }

  if (supportingObservations > 0) {
    return "weak"
  }

  return "unsupported"
}

function derivePermittedLanguage(
  classification: EquationEngineRecurrenceClassification
): string[] {
  switch (classification) {
    case "unanimous":
      return [
        "consistent across all evaluated observations",
        "unanimous pattern",
        "observed in every evaluated observation",
        "no contradictory observations were found"
      ]

    case "strong-majority":
      return [
        "strong recurring pattern",
        "supported by a strong majority",
        "observed in most evaluated observations",
        "one or more contradictory observations were found"
      ]

    case "majority":
      return [
        "majority pattern",
        "more observations support than contradict the claim",
        "recurring tendency",
        "not universal across the available history"
      ]

    case "mixed":
      return [
        "mixed pattern",
        "the available observations are divided",
        "no stable recurrence has been established",
        "both supporting and contradictory evidence are present"
      ]

    case "weak":
      return [
        "weak recurrence",
        "limited supporting evidence",
        "the pattern appears in a minority of observations",
        "the evidence does not establish a stable pattern"
      ]

    case "unsupported":
      return [
        "unsupported by the evaluated observations",
        "no supporting observations were found",
        "the available evidence contradicts or fails to support the claim"
      ]

    case "insufficient-evidence":
      return [
        "insufficient evidence",
        "too few observations were evaluable",
        "no recurrence conclusion should be drawn"
      ]
  }
}

function deriveProhibitedLanguage(
  classification: EquationEngineRecurrenceClassification
): string[] {
  if (classification === "unanimous") {
    return []
  }

  const universalLanguage = [
    "consistent across all observations",
    "always",
    "unanimous",
    "without exception",
    "in every observation",
    "never varies"
  ]

  if (classification === "insufficient-evidence") {
    return [
      ...universalLanguage,
      "recurring pattern",
      "established pattern",
      "confirmed tendency",
      "reliable trend"
    ]
  }

  if (
    classification === "mixed" ||
    classification === "weak" ||
    classification === "unsupported"
  ) {
    return [
      ...universalLanguage,
      "strong recurring pattern",
      "stable recurrence",
      "confirmed pattern"
    ]
  }

  return universalLanguage
}

function deriveConfidenceLabel(
  confidence: number
): EquationEngineEvidenceStrength {
  if (confidence >= 0.9) {
    return "very-high"
  }

  if (confidence >= 0.75) {
    return "high"
  }

  if (confidence >= 0.5) {
    return "moderate"
  }

  if (confidence >= 0.25) {
    return "low"
  }

  return "very-low"
}

function deriveConfidence(input: {
  totalObservations: number
  evaluatedObservations: number
  supportRatio: number | null
  contradictionRatio: number | null
  recurrenceClassification: EquationEngineRecurrenceClassification
}): number {
  const {
    totalObservations,
    evaluatedObservations,
    supportRatio,
    contradictionRatio,
    recurrenceClassification
  } = input

  if (
    totalObservations === 0 ||
    evaluatedObservations === 0 ||
    supportRatio === null ||
    contradictionRatio === null
  ) {
    return 0
  }

  const coverage = evaluatedObservations / totalObservations

  /*
   * Agreement measures how strongly the evaluated evidence points
   * in one direction. A 50/50 split produces low agreement, while
   * either unanimous support or unanimous contradiction produces
   * high agreement.
   */
  const agreement = Math.abs(supportRatio - contradictionRatio)

  /*
   * The sample factor prevents one or two observations from receiving
   * the same confidence as a larger history with identical ratios.
   */
  const sampleFactor = Math.min(1, evaluatedObservations / 5)

  let confidence =
    coverage * 0.35 +
    agreement * 0.4 +
    sampleFactor * 0.25

  if (recurrenceClassification === "insufficient-evidence") {
    confidence = Math.min(confidence, 0.49)
  }

  return roundRatio(clamp(confidence))
}

export function assessEquationEngineEvidence(
  input: AssessEquationEngineEvidenceInput
): EquationEngineEvidenceAssessment {
  const thresholds: EquationEngineEvidenceThresholds = {
    ...DEFAULT_THRESHOLDS,
    ...input.thresholds
  }

  const totalObservations = input.records.length

  const supportingRecords = input.records.filter(
    record => record.outcome === "supports"
  )

  const contradictingRecords = input.records.filter(
    record => record.outcome === "contradicts"
  )

  const unavailableRecords = input.records.filter(
    record => record.outcome === "unavailable"
  )

  const evaluatedObservations =
    supportingRecords.length + contradictingRecords.length

  const supportRatio =
    evaluatedObservations > 0
      ? roundRatio(supportingRecords.length / evaluatedObservations)
      : null

  const contradictionRatio =
    evaluatedObservations > 0
      ? roundRatio(contradictingRecords.length / evaluatedObservations)
      : null

  const evidenceCoverage =
    totalObservations > 0
      ? roundRatio(evaluatedObservations / totalObservations)
      : 0

  const recurrenceClassification = classifyRecurrence(
    evaluatedObservations,
    supportingRecords.length,
    contradictingRecords.length,
    supportRatio,
    thresholds
  )

  const thresholdSatisfied =
    recurrenceClassification === "unanimous" ||
    recurrenceClassification === "strong-majority" ||
    recurrenceClassification === "majority"

  const confidence = deriveConfidence({
    totalObservations,
    evaluatedObservations,
    supportRatio,
    contradictionRatio,
    recurrenceClassification
  })

  return {
    claimId: input.claimId,
    claim: input.claim,

    totalObservations,
    evaluatedObservations,

    supportingObservations: supportingRecords.length,
    contradictingObservations: contradictingRecords.length,
    unavailableObservations: unavailableRecords.length,

    supportRatio,
    contradictionRatio,
    evidenceCoverage,

    recurrenceClassification,
    thresholdSatisfied,

    confidence,
    confidenceLabel: deriveConfidenceLabel(confidence),

    supportingObservationIds: supportingRecords.map(
      record => record.observationId
    ),

    contradictingObservationIds: contradictingRecords.map(
      record => record.observationId
    ),

    unavailableObservationIds: unavailableRecords.map(
      record => record.observationId
    ),

    evidenceRecords: input.records,

    permittedLanguage: derivePermittedLanguage(
      recurrenceClassification
    ),

    prohibitedLanguage: deriveProhibitedLanguage(
      recurrenceClassification
    ),

    authoritativeObservationId:
      input.authoritativeObservationId ?? null
  }
}