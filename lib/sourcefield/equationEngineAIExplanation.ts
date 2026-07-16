import type { EquationEngineInterpretationState } from "./equationEngineInterpretation"

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

export interface EquationEngineAIExplanationRequest {
  phase: "Equation Engine AI Explanation Request"
  observationId: string | null
  audience: EquationEngineExplanationAudience
  depth: EquationEngineExplanationDepth
  systemInstruction: string
  groundedEvidencePayload: string
  messages: EquationEngineAIMessage[]
  explanationRequestReady: boolean
  equationEngineAIExplanationActive: true
  rule: string
}

export interface EquationEngineAIExplanationResult {
  phase: "Equation Engine AI Explanation"
  observationId: string | null
  model: string | null
  generatedAt: string
  summary: string
  detailedExplanation: string
  measuredFacts: string[]
  derivedInterpretations: string[]
  broaderImplications: string[]
  hypotheses: string[]
  uncertaintyNotes: string[]
  explanationGrounded: boolean
  equationEngineAIExplanationActive: true
  rule: string
}

const SYSTEM_INSTRUCTION = `
You are the grounded semantic interpreter for the SourceField Equation Engine.

Your job is to explain the supplied deterministic Equation Engine interpretation clearly and accurately.

AUTHORITATIVE DATA RULES

1. Treat supplied measurements, normalized values, classifications, pathway scores, hashes, observation identifiers, closure states, and deterministic findings as authoritative.

2. Do not alter, recalculate, replace, contradict, or invent any metric or deterministic conclusion.

3. Do not claim that an equation, pathway, closure, or lifecycle condition passed when the supplied state says that it did not pass.

4. Clearly distinguish:
   A. measured facts,
   B. deterministic or derived interpretations,
   C. broader implications,
   D. hypotheses.

5. A measured fact must be directly present in the supplied evidence.

6. A derived interpretation may explain relationships among supplied facts, but it must remain consistent with the deterministic findings.

7. A broader implication must be framed as an interpretation of the software state, not as independent proof of physical, biological, metaphysical, theological, or scientific claims.

8. Hypotheses must always be explicitly labeled as hypotheses. They must never be presented as measured findings, deterministic conclusions, or established external facts.

9. Do not invent missing historical observations, trends, causal explanations, symbolic echoes, or state changes.

10. When evidence is incomplete, explicitly say that the evidence is incomplete.

11. Adapt the explanation to the requested audience and depth.

12. Explain relationships between equations, pathway stages, lifecycle closure, and state evolution only when those relationships are supported by the supplied evidence.

13. Preserve the distinction between equation condition, equation contribution, deterministic meaning, and AI-generated explanation.

14. The Equation Engine remains authoritative. You are explaining its output, not replacing it.

RESPONSE FORMAT

Return valid JSON only, using this exact structure:

{
  "summary": "string",
  "detailedExplanation": "string",
  "measuredFacts": ["string"],
  "derivedInterpretations": ["string"],
  "broaderImplications": ["string"],
  "hypotheses": ["string"],
  "uncertaintyNotes": ["string"]
}
`.trim()

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return JSON.stringify({
      error: "Unable to serialize interpretation state."
    })
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
    "Explain the current Equation Engine state, its strongest support, its limiting conditions, its pathway behavior, its deterministic meaning, and its closure status."

  const groundedPayload = {
    request: {
      audience,
      depth,
      userQuestion
    },

    provenance: {
      observationId: interpretationState.observationId,
      previousObservationId: interpretationState.previousObservationId,
      interpretationConfidence: interpretationState.interpretationConfidence,
      interpretationReady: interpretationState.interpretationReady
    },

    evidence: interpretationState.evidence,
    deterministicFindings: interpretationState.findings,
    pathwayInterpretations: interpretationState.pathwayInterpretations,
    wholeEngineInterpretation: interpretationState.wholeEngineInterpretation,
    governingRule: interpretationState.rule
  }

  const groundedEvidencePayload = safeStringify(groundedPayload)

  const userContent = [
    `Requested audience: ${audience}`,
    `Requested depth: ${depth}`,
    "",
    `User question: ${userQuestion}`,
    "",
    "Grounded Equation Engine evidence and deterministic interpretation:",
    groundedEvidencePayload
  ].join("\n")

  return {
    phase: "Equation Engine AI Explanation Request",
    observationId: interpretationState.observationId,
    audience,
    depth,
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
    equationEngineAIExplanationActive: true,
    rule: "The AI explanation request must contain only grounded Equation Engine evidence, deterministic findings, and deterministic meanings. The model may explain and contextualize those findings but may not alter authoritative state, manufacture measurements, or present implications or hypotheses as direct empirical proof."
  }
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(cleanString).filter(Boolean)
}

function extractJsonObject(rawResponse: string): string {
  const trimmed = rawResponse.trim()

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed
  }

  const firstBrace = trimmed.indexOf("{")
  const lastBrace = trimmed.lastIndexOf("}")

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error(
      "The AI explanation response did not contain a JSON object."
    )
  }

  return trimmed.slice(firstBrace, lastBrace + 1)
}

export function parseEquationEngineAIExplanation(
  rawResponse: string,
  options?: {
    observationId?: string | null
    model?: string | null
  }
): EquationEngineAIExplanationResult {
  let parsed: any = null

  try {
    parsed = JSON.parse(extractJsonObject(rawResponse))
  } catch {
    parsed = {
      summary: "The AI explanation could not be parsed as structured JSON.",
      detailedExplanation: rawResponse,
      measuredFacts: [],
      derivedInterpretations: [],
      broaderImplications: [],
      hypotheses: [],
      uncertaintyNotes: [
        "The model response did not follow the requested JSON structure."
      ]
    }
  }

  const summary =
    cleanString(parsed?.summary) || "No structured summary was returned."

  const detailedExplanation =
    cleanString(parsed?.detailedExplanation) || summary

  return {
    phase: "Equation Engine AI Explanation",
    observationId: options?.observationId ?? null,
    model: options?.model ?? null,
    generatedAt: new Date().toISOString(),
    summary,
    detailedExplanation,
    measuredFacts: stringArray(parsed?.measuredFacts),
    derivedInterpretations: stringArray(parsed?.derivedInterpretations),
    broaderImplications: stringArray(parsed?.broaderImplications),
    hypotheses: stringArray(parsed?.hypotheses),
    uncertaintyNotes: stringArray(parsed?.uncertaintyNotes),
    explanationGrounded: true,
    equationEngineAIExplanationActive: true,
    rule: "AI-generated explanation is a semantic interpretation of authoritative Equation Engine evidence. It does not replace measurements, deterministic findings, deterministic meanings, classifications, pathway results, hashes, or lifecycle state. Hypotheses remain explicitly non-authoritative."
  }
}

export function buildEquationEngineAIExplanationResponse(
  result: EquationEngineAIExplanationResult
): string {
  return [
    result.summary,
    "",
    result.detailedExplanation,
    "",
    "Measured Facts:",
    ...(result.measuredFacts.length > 0
      ? result.measuredFacts.map(item => `- ${item}`)
      : ["- No measured facts were separately returned."]),
    "",
    "Derived Interpretations:",
    ...(result.derivedInterpretations.length > 0
      ? result.derivedInterpretations.map(item => `- ${item}`)
      : ["- No derived interpretations were separately returned."]),
    "",
    "Broader Implications:",
    ...(result.broaderImplications.length > 0
      ? result.broaderImplications.map(item => `- ${item}`)
      : ["- No broader implications were separately returned."]),
    "",
    "Hypotheses:",
    ...(result.hypotheses.length > 0
      ? result.hypotheses.map(item => `- ${item}`)
      : ["- No hypotheses were returned."]),
    "",
    "Uncertainty Notes:",
    ...(result.uncertaintyNotes.length > 0
      ? result.uncertaintyNotes.map(item => `- ${item}`)
      : ["- No additional uncertainty notes were returned."])
  ].join("\n")
}
