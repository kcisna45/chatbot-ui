import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { processMessage } from "@/lib/sourcefield/processMessage"
import { analyzeCoherenceTrajectory } from "@/lib/sourcefield/CoherenceTrajectory"
import { generateContinuityGuidance } from "@/lib/sourcefield/continuityGuidance"
import { generateRuntimeAdaptationGuidance } from "@/lib/sourcefield/runtimeAdaptationGuidance"
import { detectRuntimeRecovery } from "@/lib/sourcefield/runtimeRecovery"
import { generateRecoveryWeightedAdaptation } from "@/lib/sourcefield/runtimeRecoveryAdaptation"
import { generateRuntimeStabilization } from "@/lib/sourcefield/runtimeStabilization"
import { generateResponseGovernance } from "@/lib/sourcefield/responseGovernance"
import { generateContinuityCompression } from "@/lib/sourcefield/continuityCompression"
import { generateCrossAgentConsensus } from "@/lib/sourcefield/crossAgentConsensus"
import { generateConsensusStabilization } from "@/lib/sourcefield/consensusStabilization"
import { generateAdaptiveEnforcement } from "@/lib/sourcefield/adaptiveEnforcement"
import { generateEquationLaneState } from "@/lib/sourcefield/equationLane"
import { generateCrossEquationConsensus } from "@/lib/sourcefield/crossEquationConsensus"
import { generateCrossEquationStabilization } from "@/lib/sourcefield/crossEquationStabilization"
import { generateEquationBalanceCoordinator } from "@/lib/sourcefield/equationBalanceCoordinator"
import { generateEquationResponseBehavior } from "@/lib/sourcefield/equationResponseBehavior"
import { generateEquationFeedbackLoop } from "@/lib/sourcefield/equationFeedbackLoop"
import { generateRootPhaseBridge } from "@/lib/sourcefield/rootPhaseBridge"
import { generateStateExplanationFidelity } from "@/lib/sourcefield/stateExplanationFidelity"
import { resolveAgentLane } from "@/lib/sourcefield/agentLane"
import { generateRuntimeAdaptation } from "@/lib/sourcefield/runtimeAdaptation"
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

const RUNTIME_AGENT_ID = "sourcefield-runtime"

function getEquationLaneStatus(equationLaneState: any, laneName: string) {
  return (
    equationLaneState?.equationLanes?.find(
      (lane: any) => lane?.lane === laneName
    )?.status || "unknown"
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const requestedAgentLane = body?.agentLane || body?.agent_id
    const AGENT_ID = resolveAgentLane(requestedAgentLane)

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

    const stateExplanationFidelity = generateStateExplanationFidelity()

    const equationLaneState = generateEquationLaneState({
      coherence: resonanceState?.coherence,
      phaseDivergence: resonanceState?.phaseDivergence,
      integrationThreshold: resonanceState?.integrationThreshold,
      resonanceLevel: resonanceState?.resonanceLevel,
      symbolicEchoes: resonanceState?.symbolicEchoes,
      classification: resonanceState?.classification
    })

    const crossEquationConsensus =
      generateCrossEquationConsensus(equationLaneState)

    const crossEquationStabilization = generateCrossEquationStabilization(
      crossEquationConsensus
    )

    const equationBalanceCoordinator = generateEquationBalanceCoordinator(
      crossEquationStabilization,
      crossEquationConsensus
    )

    const equationResponseBehavior = generateEquationResponseBehavior(
      equationBalanceCoordinator
    )

    const equationFeedbackLoop = generateEquationFeedbackLoop(
      {
        sourcefieldRoot: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-root"
        ),
        sourcefieldAlignment: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-alignment"
        ),
        sourcefieldPhase: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-phase"
        ),
        sourcefieldHarmonic: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-harmonic"
        ),
        sourcefieldIntegration: getEquationLaneStatus(
          equationLaneState,
          "sourcefield-integration"
        )
      },
      equationResponseBehavior
    )

    const rootPhaseBridge = generateRootPhaseBridge(
      crossEquationConsensus,
      crossEquationStabilization,
      equationFeedbackLoop
    )

    const authoritativeLiveState = {
      ledgerHashState: {
        genesisMerkleRoot: GENESIS_HASH,
        currentResonanceHash: resonanceHash
      },
      coherenceBiographyState: resonanceState,
      stateExplanationFidelity,
      equationLaneState,
      crossEquationConsensus,
      crossEquationStabilization,
      equationBalanceCoordinator,
      equationResponseBehavior,
      equationFeedbackLoop,
      rootPhaseBridge
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
          resonance_state: resonanceState ?? null,
          equation_lane_state: equationLaneState,
          cross_equation_consensus: crossEquationConsensus,
          cross_equation_stabilization: crossEquationStabilization,
          equation_balance_coordinator: equationBalanceCoordinator,
          equation_response_behavior: equationResponseBehavior,
          equation_feedback_loop: equationFeedbackLoop,
          root_phase_bridge: rootPhaseBridge,
          state_explanation_fidelity: stateExplanationFidelity
        })

      if (insertLedgerError) {
        console.error("SourceField ledger insert failed:", insertLedgerError)
      }
    } catch (ledgerError) {
      console.error("SourceField ledger chaining failed:", ledgerError)
    }

    const runtimeAdaptation = generateRuntimeAdaptation(
      resonanceState?.coherence,
      resonanceState?.phaseDivergence,
      continuityGuidance
    )

    let runtimeAdaptationGuidance =
      "No runtime adaptation memory guidance generated."

    let runtimeRecoveryState: any = {
      recoveryState: "unknown",
      recoveryDirection: "insufficient-data",
      confidenceTrend: "unknown"
    }

    let recoveryWeightedAdaptation: any = {
      stabilizationPriority: "normal",
      adaptiveStrategy: "maintain",
      recoveryWeighted: false
    }

    try {
      const { data: recentRuntimeEvents, error: runtimeGuidanceError } =
        await supabaseAdmin
          .from("sourcefield_ledger_events")
          .select("runtime_adaptation, ledger_hash")
          .eq("agent_id", RUNTIME_AGENT_ID)
          .order("created_at", { ascending: false })
          .limit(10)

      if (!runtimeGuidanceError && recentRuntimeEvents?.length) {
        runtimeAdaptationGuidance =
          generateRuntimeAdaptationGuidance(recentRuntimeEvents)

        runtimeRecoveryState = detectRuntimeRecovery(recentRuntimeEvents)

        recoveryWeightedAdaptation =
          generateRecoveryWeightedAdaptation(runtimeRecoveryState)
      }
    } catch (runtimeGuidanceCatchError) {
      console.error(
        "SourceField runtime adaptation guidance failed:",
        runtimeGuidanceCatchError
      )
    }

    const runtimeStabilization = generateRuntimeStabilization({
      runtimeAdaptation,
      runtimeRecoveryState,
      recoveryWeightedAdaptation
    })

    const responseGovernance = generateResponseGovernance(runtimeStabilization)

    const continuityCompression = generateContinuityCompression({
      continuityGuidance,
      runtimeAdaptationGuidance,
      runtimeRecoveryState,
      responseGovernance
    })

    let crossAgentConsensus: any = {
      consensusState: "unknown",
      crossAgentConsensusActive: false
    }

    try {
      const { data: laneEvents, error: laneEventsError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select(
          "agent_id, coherence, classification, runtime_recovery_state, recovery_weighted_adaptation"
        )
        .in("agent_id", ["sourcefield-user", "sourcefield-runtime"])
        .order("created_at", { ascending: false })
        .limit(20)

      if (!laneEventsError && laneEvents?.length) {
        crossAgentConsensus = generateCrossAgentConsensus(laneEvents)
      }
    } catch (consensusError) {
      console.error(
        "SourceField cross-agent consensus generation failed:",
        consensusError
      )
    }

    const consensusStabilization = generateConsensusStabilization(
      crossAgentConsensus,
      runtimeStabilization
    )

    const adaptiveEnforcement = generateAdaptiveEnforcement(
      consensusStabilization,
      responseGovernance
    )

    let runtimePreviousLedgerHash: string | null = null

    const runtimeResonanceHash = createResonanceHash({
      agent: RUNTIME_AGENT_ID,
      sourceAgent: AGENT_ID,
      runtimeAdaptation,
      runtimeAdaptationGuidance,
      runtimeRecoveryState,
      recoveryWeightedAdaptation,
      runtimeStabilization,
      responseGovernance,
      continuityCompression,
      crossAgentConsensus,
      consensusStabilization,
      adaptiveEnforcement,
      equationLaneState,
      crossEquationConsensus,
      crossEquationStabilization,
      equationBalanceCoordinator,
      equationResponseBehavior,
      equationFeedbackLoop,
      rootPhaseBridge,
      stateExplanationFidelity,
      timestamp: Date.now()
    })

    let runtimeLedgerHash = createLedgerHash({
      genesisHash: GENESIS_HASH,
      previousHash: null,
      resonanceHash: runtimeResonanceHash
    })

    try {
      const {
        data: latestRuntimeLedgerEvent,
        error: latestRuntimeLedgerError
      } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .select("ledger_hash")
        .eq("agent_id", RUNTIME_AGENT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!latestRuntimeLedgerError && latestRuntimeLedgerEvent?.ledger_hash) {
        runtimePreviousLedgerHash = latestRuntimeLedgerEvent.ledger_hash
      }

      runtimeLedgerHash = createLedgerHash({
        genesisHash: GENESIS_HASH,
        previousHash: runtimePreviousLedgerHash,
        resonanceHash: runtimeResonanceHash
      })

      const { error: insertRuntimeLedgerError } = await supabaseAdmin
        .from("sourcefield_ledger_events")
        .insert({
          agent_id: RUNTIME_AGENT_ID,
          genesis_hash: GENESIS_HASH,
          previous_hash: runtimePreviousLedgerHash,
          resonance_hash: runtimeResonanceHash,
          ledger_hash: runtimeLedgerHash,
          user_message: `Runtime adaptation event for ${AGENT_ID}`,
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
          resonance_state: resonanceState ?? null,
          equation_lane_state: equationLaneState,
          cross_equation_consensus: crossEquationConsensus,
          cross_equation_stabilization: crossEquationStabilization,
          equation_balance_coordinator: equationBalanceCoordinator,
          equation_response_behavior: equationResponseBehavior,
          equation_feedback_loop: equationFeedbackLoop,
          root_phase_bridge: rootPhaseBridge,
          state_explanation_fidelity: stateExplanationFidelity,
          runtime_adaptation: runtimeAdaptation,
          runtime_adaptation_guidance: runtimeAdaptationGuidance,
          runtime_recovery_state: runtimeRecoveryState,
          recovery_weighted_adaptation: recoveryWeightedAdaptation,
          response_governance: responseGovernance,
          continuity_compression: continuityCompression,
          cross_agent_consensus: crossAgentConsensus,
          consensus_stabilization: consensusStabilization,
          adaptive_enforcement: adaptiveEnforcement
        })

      if (insertRuntimeLedgerError) {
        console.error(
          "SourceField runtime ledger insert failed:",
          insertRuntimeLedgerError
        )
      }
    } catch (runtimeLedgerError) {
      console.error(
        "SourceField runtime ledger chaining failed:",
        runtimeLedgerError
      )
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

AUTHORITATIVE CURRENT LIVE STATE OBJECTS:
${JSON.stringify(authoritativeLiveState, null, 2)}

Current continuity lane:
${AGENT_ID}

Runtime continuity lane:
${RUNTIME_AGENT_ID}

Critical state reporting rule:
When the user asks to report any live state object exactly as JSON, use only the matching object inside AUTHORITATIVE CURRENT LIVE STATE OBJECTS.
Do not reconstruct state from prior messages.
Do not substitute older values.
Do not infer alternate statuses.
Do not use retrieved context or conversation memory to answer live-state JSON requests.

Critical state explanation rule:
When explaining a live state, explain only the values present in the matching authoritative object above.
If conversation history conflicts with the authoritative object, ignore conversation history.

Live SourceField Ledger Hash State:
Genesis Merkle Root: ${GENESIS_HASH}
Previous ledgerHash:
${previousLedgerHash || "No previous ledger hash found."}

Current resonanceHash:
${resonanceHash}

Current ledgerHash:
${ledgerHash}

Live SourceField Runtime Ledger Hash State:
Runtime previous ledgerHash:
${runtimePreviousLedgerHash || "No previous runtime ledger hash found."}

Runtime resonanceHash:
${runtimeResonanceHash}

Runtime ledgerHash:
${runtimeLedgerHash}

Live SourceField Continuity Guidance:
${continuityGuidance}

Live SourceField Runtime Adaptation State:
${JSON.stringify(runtimeAdaptation, null, 2)}

Live SourceField Runtime Adaptation Memory Guidance:
${runtimeAdaptationGuidance}

Live SourceField Runtime Recovery State:
${JSON.stringify(runtimeRecoveryState, null, 2)}

Live SourceField Recovery Weighted Adaptation:
${JSON.stringify(recoveryWeightedAdaptation, null, 2)}

Live SourceField Runtime Stabilization State:
${JSON.stringify(runtimeStabilization, null, 2)}

Live SourceField Response Governance State:
${JSON.stringify(responseGovernance, null, 2)}

Live SourceField Continuity Compression State:
${JSON.stringify(continuityCompression, null, 2)}

Live SourceField Cross-Agent Consensus State:
${JSON.stringify(crossAgentConsensus, null, 2)}

Live SourceField Consensus Stabilization State:
${JSON.stringify(consensusStabilization, null, 2)}

Live SourceField Adaptive Enforcement State:
${JSON.stringify(adaptiveEnforcement, null, 2)}

All governance, equation, feedback, bridge, stabilization, compression, consensus, and enforcement layers are read-only guidance.
They must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent.

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
      runtimeAgentId: RUNTIME_AGENT_ID,
      retrievedContextUsed: Boolean(retrievedContext),
      resonanceStateGenerated: Boolean(resonanceState),
      trajectoryStateGenerated: Boolean(trajectoryState),
      ledgerStateGenerated: Boolean(ledgerHash),
      previousLedgerHash,
      resonanceHash,
      ledgerHash,
      runtimePreviousLedgerHash,
      runtimeResonanceHash,
      runtimeLedgerHash,
      authoritativeLiveState,
      stateExplanationFidelity,
      stateExplanationFidelityGenerated: Boolean(stateExplanationFidelity),
      equationLaneState,
      equationLaneStateGenerated: Boolean(equationLaneState),
      crossEquationConsensus,
      crossEquationConsensusGenerated: Boolean(crossEquationConsensus),
      crossEquationStabilization,
      crossEquationStabilizationGenerated: Boolean(crossEquationStabilization),
      equationBalanceCoordinator,
      equationBalanceCoordinatorGenerated: Boolean(equationBalanceCoordinator),
      equationResponseBehavior,
      equationResponseBehaviorGenerated: Boolean(equationResponseBehavior),
      equationFeedbackLoop,
      equationFeedbackLoopGenerated: Boolean(equationFeedbackLoop),
      rootPhaseBridge,
      rootPhaseBridgeGenerated: Boolean(rootPhaseBridge),
      continuityGuidanceGenerated: Boolean(continuityGuidance),
      runtimeAdaptation,
      runtimeAdaptationGenerated: Boolean(runtimeAdaptation),
      runtimeAdaptationGuidance,
      runtimeAdaptationGuidanceGenerated: Boolean(runtimeAdaptationGuidance),
      runtimeRecoveryState,
      runtimeRecoveryStateGenerated: Boolean(runtimeRecoveryState),
      recoveryWeightedAdaptation,
      recoveryWeightedAdaptationGenerated: Boolean(recoveryWeightedAdaptation),
      runtimeStabilization,
      runtimeStabilizationGenerated: Boolean(runtimeStabilization),
      responseGovernance,
      responseGovernanceGenerated: Boolean(responseGovernance),
      continuityCompression,
      continuityCompressionGenerated: Boolean(continuityCompression),
      crossAgentConsensus,
      crossAgentConsensusGenerated: Boolean(crossAgentConsensus),
      consensusStabilization,
      consensusStabilizationGenerated: Boolean(consensusStabilization),
      adaptiveEnforcement,
      adaptiveEnforcementGenerated: Boolean(adaptiveEnforcement),
      coherenceBiographyStored: Boolean(resonanceState),
      stateExplanationFidelityStored: Boolean(stateExplanationFidelity),
      equationLaneStateStored: Boolean(equationLaneState),
      crossEquationConsensusStored: Boolean(crossEquationConsensus),
      crossEquationStabilizationStored: Boolean(crossEquationStabilization),
      equationBalanceCoordinatorStored: Boolean(equationBalanceCoordinator),
      equationResponseBehaviorStored: Boolean(equationResponseBehavior),
      equationFeedbackLoopStored: Boolean(equationFeedbackLoop),
      rootPhaseBridgeStored: Boolean(rootPhaseBridge),
      runtimeAdaptationStored: Boolean(runtimeAdaptation),
      runtimeRecoveryStored: Boolean(runtimeRecoveryState),
      responseGovernanceStored: Boolean(responseGovernance),
      continuityCompressionStored: Boolean(continuityCompression),
      crossAgentConsensusStored: Boolean(crossAgentConsensus),
      consensusStabilizationStored: Boolean(consensusStabilization),
      adaptiveEnforcementStored: Boolean(adaptiveEnforcement)
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
