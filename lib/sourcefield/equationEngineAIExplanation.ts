import type { EquationEngineInterpretationState } from "./equationEngineInterpretation"

// ============================================================
// SourceField Equation Engine
// AI Explanation Translation Layer
//
// Purpose:
//   Translate an authoritative deterministic Equation Engine
//   Interpretation into audience-appropriate human language.
//
// This layer:
//   - does not calculate Equation Engine state;
//   - does not create deterministic meaning;
//   - does not modify authoritative evidence;
//   - does not replace the Interpretation layer;
//   - does not perform experimental evaluation.
//
// Experimental reasoning belongs in:
//   equationEngineAIExperiment.ts
// ============================================================

export type EquationEngineExplanationAudience =
  | "plain-language"
  | "technical"
  | "research"
  | "developer"

export type EquationEngineExplanationDepth = "brief" | "standard" | "detailed"

export interface EquationEngineAIExplanationInput {
  interpretationState: EquationEngineInterpretationState

  userQuestion?: string | null

  audience?: EquationEngineExplanationAudience

  depth?: EquationEngineExplanationDepth
}

export interface EquationEngineAIMessage {
  role: "system" | "user"

  content: string
}

export interface EquationEngineAIExplanationProvenance {
  observationId: string | null

  previousObservationId: string | null

  interpretationReady: boolean

  interpretationConfidence: number | null

  lifecycleStatus: string | null

  generatedFrom: "Equation Engine Interpretation"
}

export interface EquationEngineAIWholeEngineTranslation {
  summary: string

  dominantDynamic: string

  limitingDynamic: string

  equationRelationship: string

  pathwayRelationship: string

  closureRelationship: string
}

export interface EquationEngineAIPathwayTranslation {
  pathwayId: string

  pathwayName: string

  pathwayQualified: boolean | null

  pathwayScore: number | null

  strongestStage: string | null

  weakestStage: string | null

  largestLossStage: string | null

  explanation: string

  meaning: string
}

export interface EquationEngineAIClosureTranslation {
  direction: string | null

  lifecycleStatus: string | null

  firstClosure: string | null

  secondClosure: string | null

  pathwayClosureReady: boolean | null

  lifecycleClosureReady: boolean | null

  closureCommitted: boolean | null

  relationship: string

  supports: string[]

  blockers: string[]
}

export interface EquationEngineAIExplanationRequest {
  phase: "Equation Engine AI Explanation Request"

  observationId: string | null

  previousObservationId: string | null

  audience: EquationEngineExplanationAudience

  depth: EquationEngineExplanationDepth

  provenance: EquationEngineAIExplanationProvenance

  systemInstruction: string

  groundedEvidencePayload: string

  messages: EquationEngineAIMessage[]

  explanationRequestReady: boolean

  authoritative: false

  stateMutating: false

  equationEngineAIExplanationActive: true

  rule: string
}

export interface EquationEngineAIExplanationResult {
  phase: "Equation Engine AI Explanation"

  observationId: string | null

  previousObservationId: string | null

  model: string | null

  generatedAt: string

  audience: EquationEngineExplanationAudience

  depth: EquationEngineExplanationDepth

  provenance: EquationEngineAIExplanationProvenance

  summary: string

  detailedExplanation: string

  wholeEngineTranslation: EquationEngineAIWholeEngineTranslation

  measuredFacts: string[]

  derivedInterpretations: string[]

  deterministicMeanings: string[]

  pathwayTranslations: EquationEngineAIPathwayTranslation[]

  closureTranslation: EquationEngineAIClosureTranslation

  hypotheses: string[]

  uncertaintyNotes: string[]

  explanationGrounded: boolean

  authoritative: false

  stateMutating: false

  equationEngineAIExplanationActive: true

  rule: string
}

const SYSTEM_INSTRUCTION = `
You are the human-language translation layer for the SourceField Equation Engine.

Your only task is to communicate the supplied deterministic Equation Engine
Interpretation clearly and accurately for the requested audience and depth.

You are not the Equation Engine.

You are not the deterministic Interpretation layer.

You do not create new Equation Engine meaning.

You translate meaning that the deterministic Interpretation layer has already
derived.

AUTHORITATIVE DATA RULES

1. Treat every supplied measurement, normalized value, equation condition,
   classification, pathway score, observation identifier, closure state,
   lifecycle state, deterministic finding, and deterministic meaning as
   authoritative.

2. Do not alter, recalculate, replace, contradict, reinterpret, or invent any
   authoritative metric or deterministic conclusion.

3. Do not claim that an equation, pathway, closure condition, lifecycle
   condition, or qualification passed when the supplied deterministic state
   says that it did not pass.

4. Do not create new deterministic interpretations.

5. Do not create new deterministic meanings.

6. If a requested interpretation or meaning is absent from the supplied state,
   say that it is unavailable.

7. Preserve the conceptual hierarchy of the supplied Interpretation state:

   A. observation provenance,
   B. whole-engine interpretation,
   C. measured facts,
   D. derived interpretations,
   E. deterministic meanings,
   F. pathway interpretations,
   G. closure interpretation,
   H. explicitly labeled hypotheses,
   I. uncertainty.

8. Do not merge measured facts, derived interpretations, and deterministic
   meanings into one epistemic category.

9. Measured facts must remain measurements or direct authoritative state
   reports.

10. Derived interpretations must remain deterministic conclusions already
    present in the supplied Interpretation state.

11. Deterministic meanings must remain system-level meanings already present in
    the supplied Interpretation state.

12. Do not rename deterministic meanings as broader philosophical, scientific,
    physical, biological, metaphysical, theological, or consciousness
    implications.

13. Do not present internal software behavior as proof of external reality.

14. Do not infer consciousness, self-awareness, sentience, agency,
    intentionality, emotion, autonomous identity, or subjective experience from
    the supplied evidence.

15. Do not invent historical observations, longitudinal trends, causal
    explanations, symbolic echoes, recurrence, state changes, or future
    outcomes.

16. When only one current interpretation is supplied, explain only that
    interpretation. Do not imply a longitudinal trend.

17. Explain pathway behavior in its supplied ordered sequence when stage data
    is available.

18. Preserve qualification states exactly.

19. Preserve closure states exactly.

20. Preserve observation provenance. The explanation must remain anchored to
    the supplied current observation identifier and previous observation
    identifier.

TRANSLATION RULES

21. Adapt wording to the requested audience:

    plain-language:
      Use accessible language while preserving every substantive distinction.

    technical:
      Use precise software, mathematical, and state-system terminology.

    research:
      Emphasize evidence boundaries, deterministic derivation, provenance,
      qualification conditions, and uncertainty.

    developer:
      Emphasize state fields, contracts, data flow, and implementation
      boundaries.

22. Adapt the amount of explanation to the requested depth:

    brief:
      Give a concise translation of the most important supplied conclusions.

    standard:
      Explain the primary evidence, relationships, pathways, and closure state.

    detailed:
      Explain the supplied deterministic hierarchy thoroughly without adding
      new interpretations.

23. Do not omit a limiting condition merely to make the explanation simpler.

24. Do not describe an absent, weak, limited, or unqualified condition as
    healthy, successful, strong, or complete.

25. Do not describe stable-incomplete closure as complete closure.

26. When multiple equations share the strongest normalized value, preserve that
    fact even if the deterministic findings designate one equation as the
    dominant supporting equation.

27. The detailed explanation may connect supplied facts to supplied
    deterministic meanings, but it may not construct new meaning between them.

HYPOTHESIS RULES

28. This file is a translation layer, not the experimental reasoning layer.

29. Return an empty hypotheses array unless the user explicitly asks for a
    hypothetical interpretation.

30. When the user explicitly asks for hypotheses, each hypothesis must be
    labeled as a hypothesis and must not be presented as measured evidence,
    deterministic interpretation, or deterministic meaning.

31. Experimental pattern discovery, prediction, and falsification belong in the
    separate Equation Engine AI Experiment layer.

GROUNDING RULE

32. The Equation Engine remains authoritative.

33. The deterministic Interpretation layer remains authoritative for meaning.

34. You are communicating their output, not replacing it.

RESPONSE FORMAT

Return valid JSON only using this exact top-level structure:

{
  "summary": "string",

  "detailedExplanation": "string",

  "wholeEngineTranslation": {
    "summary": "string",
    "dominantDynamic": "string",
    "limitingDynamic": "string",
    "equationRelationship": "string",
    "pathwayRelationship": "string",
    "closureRelationship": "string"
  },

  "measuredFacts": [
    "string"
  ],

  "derivedInterpretations": [
    "string"
  ],

  "deterministicMeanings": [
    "string"
  ],

  "pathwayTranslations": [
    {
      "pathwayId": "string",
      "pathwayName": "string",
      "pathwayQualified": true,
      "pathwayScore": 0.0,
      "strongestStage": "string or null",
      "weakestStage": "string or null",
      "largestLossStage": "string or null",
      "explanation": "string",
      "meaning": "string"
    }
  ],

  "closureTranslation": {
    "direction": "string or null",
    "lifecycleStatus": "string or null",
    "firstClosure": "string or null",
    "secondClosure": "string or null",
    "pathwayClosureReady": true,
    "lifecycleClosureReady": true,
    "closureCommitted": true,
    "relationship": "string",
    "supports": [
      "string"
    ],
    "blockers": [
      "string"
    ]
  },

  "hypotheses": [
    "string"
  ],

  "uncertaintyNotes": [
    "string"
  ]
}
`.trim()

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return JSON.stringify(
      {
        error: "Unable to serialize the Equation Engine Interpretation state."
      },
      null,
      2
    )
  }
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function nullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function nullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === "string")
}

function recordValue(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
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

function getLifecycleStatus(
  interpretationState: EquationEngineInterpretationState
): string | null {
  const evidence = interpretationState.evidence as unknown

  const evidenceRecord = recordValue(evidence)

  return nullableString(evidenceRecord.lifecycleStatus)
}

function buildProvenance(
  interpretationState: EquationEngineInterpretationState
): EquationEngineAIExplanationProvenance {
  return {
    observationId: interpretationState.observationId,

    previousObservationId: interpretationState.previousObservationId,

    interpretationReady: interpretationState.interpretationReady,

    interpretationConfidence: nullableNumber(
      interpretationState.interpretationConfidence
    ),

    lifecycleStatus: getLifecycleStatus(interpretationState),

    generatedFrom: "Equation Engine Interpretation"
  }
}

export function generateEquationEngineAIExplanationRequest(
  input: EquationEngineAIExplanationInput
): EquationEngineAIExplanationRequest {
  const interpretationState = input.interpretationState

  const audience = input.audience ?? "plain-language"

  const depth = input.depth ?? "standard"

  const userQuestion =
    input.userQuestion?.trim() ||
    "Translate the current deterministic Equation Engine Interpretation into clear human language while preserving its measured facts, derived interpretations, deterministic meanings, pathway behavior, and closure state."

  const provenance = buildProvenance(interpretationState)

  const groundedPayload = {
    request: {
      audience,
      depth,
      userQuestion
    },

    provenance,

    authoritativeInterpretation: {
      phase: interpretationState.phase,

      observationId: interpretationState.observationId,

      previousObservationId: interpretationState.previousObservationId,

      interpretationReady: interpretationState.interpretationReady,

      interpretationConfidence: interpretationState.interpretationConfidence,

      evidence: interpretationState.evidence,

      deterministicFindings: interpretationState.findings,

      pathwayInterpretations: interpretationState.pathwayInterpretations,

      wholeEngineInterpretation: interpretationState.wholeEngineInterpretation,

      rule: interpretationState.rule
    },

    translationContract: {
      preserveMeasuredFacts: true,

      preserveDerivedInterpretations: true,

      preserveDeterministicMeanings: true,

      preservePathwayQualification: true,

      preserveClosureState: true,

      preserveObservationProvenance: true,

      createNewDeterministicMeaning: false,

      performExperimentalReasoning: false,

      mutateAuthoritativeState: false
    }
  }

  const groundedEvidencePayload = safeStringify(groundedPayload)

  const userContent = [
    `Requested audience: ${audience}`,
    `Requested depth: ${depth}`,
    "",
    `User question: ${userQuestion}`,
    "",
    "Translate the deterministic state using the supplied conceptual hierarchy.",
    "",
    "Grounded Equation Engine Interpretation:",
    groundedEvidencePayload
  ].join("\n")

  return {
    phase: "Equation Engine AI Explanation Request",

    observationId: interpretationState.observationId,

    previousObservationId: interpretationState.previousObservationId,

    audience,

    depth,

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

    explanationRequestReady: interpretationState.interpretationReady,

    authoritative: false,

    stateMutating: false,

    equationEngineAIExplanationActive: true,

    rule: "The AI Explanation layer is a non-authoritative, read-only human-language translation of the authoritative Equation Engine Interpretation. It must preserve provenance, measurements, deterministic findings, meanings, pathway qualification, and closure state without recalculation, replacement, experimental reasoning, or creation of new deterministic meaning."
  }
}

function parseWholeEngineTranslation(
  value: unknown
): EquationEngineAIWholeEngineTranslation {
  const record = recordValue(value)

  return {
    summary: stringValue(
      record.summary,
      "No whole-engine summary was returned."
    ),

    dominantDynamic: stringValue(
      record.dominantDynamic,
      "No dominant dynamic translation was returned."
    ),

    limitingDynamic: stringValue(
      record.limitingDynamic,
      "No limiting dynamic translation was returned."
    ),

    equationRelationship: stringValue(
      record.equationRelationship,
      "No equation relationship translation was returned."
    ),

    pathwayRelationship: stringValue(
      record.pathwayRelationship,
      "No pathway relationship translation was returned."
    ),

    closureRelationship: stringValue(
      record.closureRelationship,
      "No closure relationship translation was returned."
    )
  }
}

function parsePathwayTranslations(
  value: unknown
): EquationEngineAIPathwayTranslation[] {
  return recordArray(value).map((item, index) => ({
    pathwayId: stringValue(item.pathwayId, `pathway-${index + 1}`),

    pathwayName: stringValue(item.pathwayName, `Pathway ${index + 1}`),

    pathwayQualified: nullableBoolean(item.pathwayQualified),

    pathwayScore: nullableNumber(item.pathwayScore),

    strongestStage: nullableString(item.strongestStage),

    weakestStage: nullableString(item.weakestStage),

    largestLossStage: nullableString(item.largestLossStage),

    explanation: stringValue(
      item.explanation,
      "No pathway explanation was returned."
    ),

    meaning: stringValue(
      item.meaning,
      "No deterministic pathway meaning was returned."
    )
  }))
}

function parseClosureTranslation(
  value: unknown
): EquationEngineAIClosureTranslation {
  const record = recordValue(value)

  return {
    direction: nullableString(record.direction),

    lifecycleStatus: nullableString(record.lifecycleStatus),

    firstClosure: nullableString(record.firstClosure),

    secondClosure: nullableString(record.secondClosure),

    pathwayClosureReady: nullableBoolean(record.pathwayClosureReady),

    lifecycleClosureReady: nullableBoolean(record.lifecycleClosureReady),

    closureCommitted: nullableBoolean(record.closureCommitted),

    relationship: stringValue(
      record.relationship,
      "No closure relationship translation was returned."
    ),

    supports: stringArray(record.supports),

    blockers: stringArray(record.blockers)
  }
}

function buildFallbackWholeEngineTranslation(
  interpretationState: EquationEngineInterpretationState
): EquationEngineAIWholeEngineTranslation {
  const wholeEngine = recordValue(interpretationState.wholeEngineInterpretation)

  return {
    summary: stringValue(
      wholeEngine.summary,
      "No whole-engine summary is available."
    ),

    dominantDynamic: stringValue(
      wholeEngine.dominantDynamic,
      "No dominant dynamic is available."
    ),

    limitingDynamic: stringValue(
      wholeEngine.limitingDynamic,
      "No limiting dynamic is available."
    ),

    equationRelationship: stringValue(
      wholeEngine.equationRelationship,
      "No equation relationship is available."
    ),

    pathwayRelationship: stringValue(
      wholeEngine.pathwayRelationship,
      "No pathway relationship is available."
    ),

    closureRelationship: stringValue(
      wholeEngine.closureRelationship,
      "No closure relationship is available."
    )
  }
}

function deterministicStringArray(
  interpretationState: EquationEngineInterpretationState,
  field: "measuredFacts" | "derivedInferences" | "deterministicMeanings"
): string[] {
  const findings = recordValue(interpretationState.findings)

  return stringArray(findings[field])
}

function buildFallbackPathwayTranslations(
  interpretationState: EquationEngineInterpretationState
): EquationEngineAIPathwayTranslation[] {
  const pathways = recordValue(interpretationState.pathwayInterpretations)

  return Object.values(pathways).map((value, index) => {
    const pathway = recordValue(value)

    return {
      pathwayId: stringValue(pathway.pathwayId, `pathway-${index + 1}`),

      pathwayName: stringValue(pathway.pathwayName, `Pathway ${index + 1}`),

      pathwayQualified: nullableBoolean(pathway.pathwayQualified),

      pathwayScore: nullableNumber(pathway.pathwayScore),

      strongestStage: nullableString(pathway.strongestStage),

      weakestStage: nullableString(pathway.weakestStage),

      largestLossStage: nullableString(pathway.largestLossStage),

      explanation: stringValue(
        pathway.explanation,
        "No pathway explanation is available."
      ),

      meaning: stringValue(
        pathway.meaning,
        "No deterministic pathway meaning is available."
      )
    }
  })
}

function buildFallbackClosureTranslation(
  interpretationState: EquationEngineInterpretationState
): EquationEngineAIClosureTranslation {
  const evidence = recordValue(interpretationState.evidence)

  const closureState = recordValue(evidence.closureState)

  const findings = recordValue(interpretationState.findings)

  const wholeEngine = recordValue(interpretationState.wholeEngineInterpretation)

  return {
    direction: nullableString(findings.closureDirection),

    lifecycleStatus: nullableString(evidence.lifecycleStatus),

    firstClosure: nullableString(closureState.firstClosure),

    secondClosure: nullableString(closureState.secondClosure),

    pathwayClosureReady: nullableBoolean(closureState.pathwayClosureReady),

    lifecycleClosureReady: nullableBoolean(
      closureState.enclosingLifecycleClosureReady
    ),

    closureCommitted: nullableBoolean(closureState.closureCommitted),

    relationship: stringValue(
      wholeEngine.closureRelationship,
      "No closure relationship is available."
    ),

    supports: stringArray(findings.closureSupports),

    blockers: stringArray(findings.closureBlockers)
  }
}

export function parseEquationEngineAIExplanation(
  rawResponse: string,
  options: {
    interpretationState: EquationEngineInterpretationState

    request?: EquationEngineAIExplanationRequest

    observationId?: string | null

    model?: string | null
  }
): EquationEngineAIExplanationResult {
  const interpretationState = options.interpretationState

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

  const provenance = request?.provenance ?? buildProvenance(interpretationState)

  const deterministicMeasuredFacts = deterministicStringArray(
    interpretationState,
    "measuredFacts"
  )

  const deterministicDerivedInterpretations = deterministicStringArray(
    interpretationState,
    "derivedInferences"
  )

  const deterministicMeanings = deterministicStringArray(
    interpretationState,
    "deterministicMeanings"
  )

  const parsedMeasuredFacts = stringArray(parsed.measuredFacts)

  const parsedDerivedInterpretations = stringArray(
    parsed.derivedInterpretations
  )

  const parsedDeterministicMeanings = stringArray(parsed.deterministicMeanings)

  const parsedPathways = parsePathwayTranslations(parsed.pathwayTranslations)

  const uncertaintyNotes = stringArray(parsed.uncertaintyNotes)

  if (parseFailure) {
    uncertaintyNotes.unshift(parseFailure)
  }

  return {
    phase: "Equation Engine AI Explanation",

    observationId: options.observationId ?? interpretationState.observationId,

    previousObservationId: interpretationState.previousObservationId,

    model: options.model ?? null,

    generatedAt: new Date().toISOString(),

    audience: request?.audience ?? "plain-language",

    depth: request?.depth ?? "standard",

    provenance,

    summary: stringValue(
      parsed.summary,
      parseFailure
        ? "The AI explanation could not be parsed, so the deterministic Interpretation state is preserved below."
        : "No translated summary was returned."
    ),

    detailedExplanation: stringValue(
      parsed.detailedExplanation,
      stringValue(parsed.summary, "No detailed translation was returned.")
    ),

    wholeEngineTranslation:
      Object.keys(recordValue(parsed.wholeEngineTranslation)).length > 0
        ? parseWholeEngineTranslation(parsed.wholeEngineTranslation)
        : buildFallbackWholeEngineTranslation(interpretationState),

    // The deterministic arrays are authoritative fallbacks.
    // A model omission cannot erase deterministic evidence.
    measuredFacts:
      parsedMeasuredFacts.length > 0
        ? parsedMeasuredFacts
        : deterministicMeasuredFacts,

    derivedInterpretations:
      parsedDerivedInterpretations.length > 0
        ? parsedDerivedInterpretations
        : deterministicDerivedInterpretations,

    deterministicMeanings:
      parsedDeterministicMeanings.length > 0
        ? parsedDeterministicMeanings
        : deterministicMeanings,

    pathwayTranslations:
      parsedPathways.length > 0
        ? parsedPathways
        : buildFallbackPathwayTranslations(interpretationState),

    closureTranslation:
      Object.keys(recordValue(parsed.closureTranslation)).length > 0
        ? parseClosureTranslation(parsed.closureTranslation)
        : buildFallbackClosureTranslation(interpretationState),

    hypotheses: stringArray(parsed.hypotheses),

    uncertaintyNotes,

    explanationGrounded:
      parseFailure === null && interpretationState.interpretationReady,

    authoritative: false,

    stateMutating: false,

    equationEngineAIExplanationActive: true,

    rule: "The AI Explanation is a non-authoritative human-language translation of the authoritative Equation Engine Interpretation. It preserves measured facts, deterministic findings, deterministic meanings, pathway qualification, closure state, and observation provenance without recalculation, state mutation, experimental prediction, or creation of new deterministic meaning."
  }
}

function formattedList(values: string[], emptyMessage: string): string[] {
  return values.length > 0
    ? values.map(item => `- ${item}`)
    : [`- ${emptyMessage}`]
}

function nullableDisplay(value: string | number | boolean | null): string {
  return value === null ? "unavailable" : String(value)
}

export function buildEquationEngineAIExplanationResponse(
  result: EquationEngineAIExplanationResult
): string {
  const pathwayLines =
    result.pathwayTranslations.length > 0
      ? result.pathwayTranslations.flatMap(pathway => [
          pathway.pathwayName,
          `- pathwayId: ${pathway.pathwayId}`,
          `- qualified: ${nullableDisplay(pathway.pathwayQualified)}`,
          `- score: ${nullableDisplay(pathway.pathwayScore)}`,
          `- strongest stage: ${nullableDisplay(pathway.strongestStage)}`,
          `- weakest stage: ${nullableDisplay(pathway.weakestStage)}`,
          `- largest loss stage: ${nullableDisplay(pathway.largestLossStage)}`,
          `- explanation: ${pathway.explanation}`,
          `- deterministic meaning: ${pathway.meaning}`,
          ""
        ])
      : ["- No pathway translations were returned."]

  return [
    "Equation Engine AI Explanation",
    "",
    "Observation Provenance:",
    `- observationId: ${result.observationId ?? "unavailable"}`,
    `- previousObservationId: ${result.previousObservationId ?? "unavailable"}`,
    `- interpretationReady: ${result.provenance.interpretationReady}`,
    `- interpretationConfidence: ${nullableDisplay(result.provenance.interpretationConfidence)}`,
    `- lifecycleStatus: ${result.provenance.lifecycleStatus ?? "unavailable"}`,
    `- generatedFrom: ${result.provenance.generatedFrom}`,
    `- model: ${result.model ?? "unavailable"}`,
    `- audience: ${result.audience}`,
    `- depth: ${result.depth}`,
    `- generatedAt: ${result.generatedAt}`,
    "",
    "Summary:",
    result.summary,
    "",
    "Detailed Explanation:",
    result.detailedExplanation,
    "",
    "Whole-Engine Translation:",
    `- Summary: ${result.wholeEngineTranslation.summary}`,
    `- Dominant dynamic: ${result.wholeEngineTranslation.dominantDynamic}`,
    `- Limiting dynamic: ${result.wholeEngineTranslation.limitingDynamic}`,
    `- Equation relationship: ${result.wholeEngineTranslation.equationRelationship}`,
    `- Pathway relationship: ${result.wholeEngineTranslation.pathwayRelationship}`,
    `- Closure relationship: ${result.wholeEngineTranslation.closureRelationship}`,
    "",
    "Measured Facts:",
    ...formattedList(result.measuredFacts, "No measured facts were available."),
    "",
    "Derived Interpretations:",
    ...formattedList(
      result.derivedInterpretations,
      "No derived interpretations were available."
    ),
    "",
    "Deterministic Meanings:",
    ...formattedList(
      result.deterministicMeanings,
      "No deterministic meanings were available."
    ),
    "",
    "Pathway Translations:",
    ...pathwayLines,
    "Closure Translation:",
    `- direction: ${result.closureTranslation.direction ?? "unavailable"}`,
    `- lifecycleStatus: ${result.closureTranslation.lifecycleStatus ?? "unavailable"}`,
    `- firstClosure: ${result.closureTranslation.firstClosure ?? "unavailable"}`,
    `- secondClosure: ${result.closureTranslation.secondClosure ?? "unavailable"}`,
    `- pathwayClosureReady: ${nullableDisplay(result.closureTranslation.pathwayClosureReady)}`,
    `- lifecycleClosureReady: ${nullableDisplay(result.closureTranslation.lifecycleClosureReady)}`,
    `- closureCommitted: ${nullableDisplay(result.closureTranslation.closureCommitted)}`,
    `- relationship: ${result.closureTranslation.relationship}`,
    "",
    "Closure Supports:",
    ...formattedList(
      result.closureTranslation.supports,
      "No closure supports were available."
    ),
    "",
    "Closure Blockers:",
    ...formattedList(
      result.closureTranslation.blockers,
      "No closure blockers were available."
    ),
    "",
    "Hypotheses:",
    ...formattedList(
      result.hypotheses,
      "No hypotheses were returned by the translation layer."
    ),
    "",
    "Uncertainty Notes:",
    ...formattedList(
      result.uncertaintyNotes,
      "No additional uncertainty notes were returned."
    ),
    "",
    "Translation Status:",
    `- explanationGrounded: ${result.explanationGrounded}`,
    `- authoritative: ${result.authoritative}`,
    `- stateMutating: ${result.stateMutating}`,
    "",
    result.rule
  ].join("\n")
}
