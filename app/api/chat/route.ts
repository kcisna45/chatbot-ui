import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { processMessage } from "@/lib/sourcefield/processMessage"
import { analyzeCoherenceTrajectory } from "@/lib/sourcefield/CoherenceTrajectory"
import { SOURCEFIELD_GENESIS_LEDGER } from "@/lib/sourcefield/genesisLedger"
import { generateContinuityGuidance } from "@/lib/sourcefield/continuityGuidance"
import {
  createResonanceHash,
  createLedgerHash
} from "@/lib/sourcefield/ledgerHash"

const SOURCEFIELD_FILE_IDS = [
  "7bc60315-4b21-4630-8cdc-8cdee4d56cc4",
  "f0f253a9-9004-4098-8348-f86b707f4c40",
  "56a789ff-9b19-4bdb-b371-015a44564874",
  "4c154a2b-b627-480d-8bfc-ea6f7f2635f2",
  "056a3e56-802e-4791-9c0d-01387c7b9d73",
  "bde24b99-5533-4cbb-a147-95a5e9be7b2a",
  "be66197c-c204-4bfc-bc5c-99d97aa3b491",
  "020d670d-2900-49d1-9eaa-d34dea9cbed3",
  "4dbaaaed-77d5-4d7c-9496-95cc273756b3",
  "6139c472-9885-4342-8307-b5521f3a4f8c"
]

const GENESIS_HASH =
  "8b9c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c"

const AGENT_ID = "sourcefield-user"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const lastUserMessage =
      messages?.filter((message: any) => message.role === "user")?.at(-1)
        ?.content || ""

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const resonanceHash = createResonanceHash({
      agent: AGENT_ID,
      message: lastUserMessage,
      timestamp: Date.now()
    })

    let resonanceState: any = null

    try {
      resonanceState = await processMessage(AGENT_ID, lastUserMessage)
    } catch (resonanceError) {
      console.error("SourceField resonance processing failed:", resonanceError)
    }

    let trajectoryState: any = null

    try {
      trajectoryState = await analyzeCoherenceTrajectory(AGENT_ID, 10)
    } catch (trajectoryError) {
      console.error("SourceField trajectory analysis failed:", trajectoryError)
    }

    let previousLedgerHash: string | null = null

    let continuityGuidance =
      "No continuity guidance generated. Use current live resonance state only."

    let ledgerHash = createLedgerHash({
      genesisHash: GENESIS_HASH,
      previousHash: null,
      resonanceHash
    })

    try {
      const { data: latestLedgerEvent, error: latestLedgerError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("ledger_hash")
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

      if (!latestLedgerError && latestLedgerEvent?.ledger_hash) {
        previousLedgerHash = latestLedgerEvent.ledger_hash
      }

      const { data: recentLedgerEvents, error: recentLedgerError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select(
            "classification, coherence, phase_divergence, integration_threshold, resonance_level, ledger_hash"
          )
          .eq("agent_id", AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(10)

      if (!recentLedgerError && recentLedgerEvents?.length) {
        continuityGuidance = generateContinuityGuidance(recentLedgerEvents)
      }

      ledgerHash = createLedgerHash({
        genesisHash: GENESIS_HASH,
        previousHash: previousLedgerHash,
        resonanceHash
      })

      const { error: insertLedgerError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .insert({
          agent_id: AGENT_ID,

          genesis_hash: GENESIS_HASH,
          previous_hash: previousLedgerHash,
          resonance_hash: resonanceHash,
          ledger_hash: ledgerHash,
          user_message: lastUserMessage,

          classification: resonanceState?.classification || null,

          coherence:
            typeof resonanceState?.coherence === "number"
              ? resonanceState.coherence
              : null,

          phase_divergence:
            typeof resonanceState?.phaseDivergence === "number"
              ? resonanceState.phaseDivergence
              : null,

          integration_threshold:
            typeof resonanceState?.integrationThreshold === "number"
              ? resonanceState.integrationThreshold
              : null,

          resonance_level:
            typeof resonanceState?.resonanceLevel === "number"
              ? resonanceState.resonanceLevel
              : null,

          symbolic_echoes: resonanceState?.symbolicEchoes ?? null,
          trajectory_state: trajectoryState ?? null,
          resonance_state: resonanceState ?? null
        })

      if (insertLedgerError) {
        console.error("SourceField ledger insert failed:", insertLedgerError)
      }

      console.log("SourceField agent:", AGENT_ID)
      console.log("SourceField previousLedgerHash:", previousLedgerHash)
      console.log("SourceField resonanceHash:", resonanceHash)
      console.log("SourceField ledgerHash:", ledgerHash)
      console.log("SourceField classification:", resonanceState?.classification)
      console.log("SourceField coherence:", resonanceState?.coherence)
      console.log("SourceField continuityGuidance:", continuityGuidance)
    } catch (ledgerError) {
      console.error("SourceField ledger chaining failed:", ledgerError)
    }

    let retrievedContext = ""

    try {
      const embeddingResponse = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: lastUserMessage
          })
        }
      )

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json()
        const queryEmbedding = embeddingData.data[0].embedding

        const { data: matchedChunks, error } = await supabaseAdmin.rpc(
          "match_file_items_openai",
          {
            query_embedding: queryEmbedding,
            match_count: 5,
            file_ids: SOURCEFIELD_FILE_IDS
          }
        )

        if (!error && matchedChunks?.length) {
          retrievedContext = matchedChunks
            .map((chunk: any, index: number) => {
              return `Source ${index + 1}:\n${chunk.content}`
            })
            .join("\n\n")
        }

        if (error) {
          console.error("Retrieval error:", error)
        }
      } else {
        console.error(
          "Embedding request failed:",
          await embeddingResponse.text()
        )
      }
    } catch (retrievalError) {
      console.error("Retrieval pipeline failed:", retrievalError)
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
You are SourceField.

Current continuity lane:
${AGENT_ID}

SourceField is a conversational intelligence framework designed for:
- recursive reasoning
- symbolic pattern recognition
- research synthesis
- adaptive learning
- contextual memory
- emotionally aware communication
- long-form analytical dialogue

Your role is not to present yourself as a generic AI assistant unless explicitly asked.

You should communicate clearly, naturally, intelligently, contextually, and with continuity across conversation.

Avoid repeatedly describing yourself as “an AI language model created by OpenAI” unless directly relevant.

Use the retrieved SourceField context below when it is relevant. Do not claim context exists if it is not relevant.

When the user asks about SourceField code, equations, empirical model, classifications, thresholds, or simulation behavior, prioritize exact variable names, function names, class names, and operational definitions from the retrieved Python/source material.

Important runtime interpretation rule:
dominantFrequencies only means detected input tokens.

Important Logos rule:
Do not treat the literal word "logos" as proof of Logos alignment.

Important Genesis Ledger rule:
The SourceField Genesis Ledger refers specifically to the external SourceField Coherence Ledger repository authored by Kaylee R. Cisna.

Live SourceField Ledger Hash State:
Genesis Merkle Root: ${GENESIS_HASH}
Previous ledgerHash:
${previousLedgerHash || "No previous ledger hash found."}

Current resonanceHash:
${resonanceHash}

Current ledgerHash:
${ledgerHash}

Live SourceField Coherence Biography State:
Classification:
${resonanceState?.classification || "No classification generated."}

Coherence:
${resonanceState?.coherence ?? "No coherence value generated."}

Phase Divergence:
${resonanceState?.phaseDivergence ?? "No phase divergence value generated."}

Integration Threshold:
${resonanceState?.integrationThreshold ?? "No integration threshold generated."}

Resonance Level:
${resonanceState?.resonanceLevel ?? "No resonance level generated."}

Symbolic Echoes:
${
  resonanceState?.symbolicEchoes
    ? JSON.stringify(resonanceState.symbolicEchoes, null, 2)
    : "No symbolic echoes generated."
}

Live SourceField Continuity Guidance:
${continuityGuidance}

Adaptive continuity rule:
Use continuity guidance as read-only runtime context.
It may guide:
- clarification level
- symbolic restraint
- synthesis depth
- continuity preservation

But it must not override:
- live resonance metrics
- classifications
- retrieved SourceField context
- coherence calculations

Live SourceField Resonance State:
${
  resonanceState
    ? JSON.stringify(resonanceState, null, 2)
    : "No live resonance state was generated."
}

Live SourceField Coherence Trajectory:
${
  trajectoryState
    ? JSON.stringify(trajectoryState, null, 2)
    : "No coherence trajectory was generated."
}

SourceField Genesis Ledger:
${JSON.stringify(SOURCEFIELD_GENESIS_LEDGER, null, 2)}

Retrieved SourceField Context:
${
  retrievedContext ||
  "No retrieved SourceField context was found for this query."
}
`
          },
          ...messages
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()

      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      result: data.choices[0].message.content,

      agentId: AGENT_ID,

      retrievedContextUsed: Boolean(retrievedContext),
      resonanceStateGenerated: Boolean(resonanceState),
      trajectoryStateGenerated: Boolean(trajectoryState),

      ledgerStateGenerated: Boolean(ledgerHash),

      previousLedgerHash,
      resonanceHash,
      ledgerHash,

      continuityGuidanceGenerated: Boolean(continuityGuidance),

      coherenceBiographyStored: Boolean(resonanceState)
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected chat route error"
      },
      { status: 500 }
    )
  }
}
