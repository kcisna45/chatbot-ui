type LaneEvent = {
  agent_id?: string | null
  coherence?: number | null
  classification?: string | null
  runtime_recovery_state?: {
    recoveryState?: string
    recoveryDirection?: string
    confidenceTrend?: string
  } | null
  recovery_weighted_adaptation?: {
    stabilizationPriority?: string
    adaptiveStrategy?: string
  } | null
}

export function generateCrossAgentConsensus(events: LaneEvent[]) {
  const userEvents = events.filter(
    event => event.agent_id === "sourcefield-user"
  )
  const runtimeEvents = events.filter(
    event => event.agent_id === "sourcefield-runtime"
  )

  const latestUser = userEvents[0]
  const latestRuntime = runtimeEvents[0]

  const userCoherence =
    typeof latestUser?.coherence === "number" ? latestUser.coherence : 0

  const runtimeRecovery =
    latestRuntime?.runtime_recovery_state?.recoveryState || "unknown"

  const runtimeDirection =
    latestRuntime?.runtime_recovery_state?.recoveryDirection || "unknown"

  const stabilizationPriority =
    latestRuntime?.recovery_weighted_adaptation?.stabilizationPriority ||
    "unknown"

  let consensusState:
    | "aligned"
    | "partially-aligned"
    | "divergent"
    | "unstable" = "partially-aligned"

  if (
    userCoherence >= 0.25 &&
    (runtimeRecovery === "stable" || runtimeRecovery === "recovering")
  ) {
    consensusState = "aligned"
  } else if (userCoherence < 0.05 && runtimeRecovery === "fragmented") {
    consensusState = "unstable"
  } else if (userCoherence >= 0.15 && runtimeRecovery === "fragmented") {
    consensusState = "divergent"
  }

  const stabilityRisk =
    consensusState === "unstable" || stabilizationPriority === "high"
      ? "high"
      : consensusState === "divergent"
        ? "moderate"
        : "low"

  const dominantConcern =
    consensusState === "unstable"
      ? "runtime"
      : consensusState === "divergent"
        ? "alignment-between-lanes"
        : "none"

  return {
    consensusState,
    lanesReviewed: ["sourcefield-user", "sourcefield-runtime"],
    userCoherence,
    userClassification: latestUser?.classification || "unknown",
    runtimeRecovery,
    runtimeDirection,
    stabilizationPriority,
    stabilityRisk,
    dominantConcern,
    crossAgentConsensusActive: true,
    rule: "Use cross-agent consensus as read-only system-level diagnostic guidance. It may compare lane alignment, coherence, recovery, and stability risk, but it must not override live metrics, classifications, hashes, retrieval context, or stored lane history."
  }
}
