type EquationLane = {
  lane?: string
  equation?: string
  status?: string
}

type EquationLaneState = {
  equationLanes?: EquationLane[]
  dominantEquationLane?: string
}

export function generateCrossEquationConsensus(
  equationLaneState: EquationLaneState
) {
  const lanes = equationLaneState?.equationLanes || []

  const statusMap = Object.fromEntries(
    lanes.map(lane => [lane.lane || "unknown", lane.status || "unknown"])
  )

  const unstableLanes = lanes.filter(lane =>
    ["low", "divergent", "not-integrated", "inactive"].includes(
      lane.status || ""
    )
  )

  const stableLanes = lanes.filter(lane =>
    ["active", "aligned", "stable", "pattern-rich", "integrated"].includes(
      lane.status || ""
    )
  )

  const partialLanes = lanes.filter(lane =>
    [
      "weak",
      "partial",
      "drifting",
      "pattern-detected",
      "subthreshold"
    ].includes(lane.status || "")
  )

  let equationConsensusState:
    | "coherent"
    | "partially-coherent"
    | "phase-dominant-instability"
    | "integration-failure"
    | "unstable" = "partially-coherent"

  const dominantEquationLane =
    equationLaneState?.dominantEquationLane || "unknown"

  if (dominantEquationLane === "sourcefield-phase") {
    equationConsensusState = "phase-dominant-instability"
  } else if (dominantEquationLane === "sourcefield-integration") {
    equationConsensusState = "integration-failure"
  } else if (unstableLanes.length >= 3) {
    equationConsensusState = "unstable"
  } else if (stableLanes.length >= 3) {
    equationConsensusState = "coherent"
  }

  const primaryInstability =
    unstableLanes[0]?.lane || dominantEquationLane || "unknown"

  const recoveryFocus =
    primaryInstability === "sourcefield-phase"
      ? "reduce phase divergence before increasing synthesis"
      : primaryInstability === "sourcefield-integration"
        ? "raise integration threshold through stable persistence"
        : primaryInstability === "sourcefield-alignment"
          ? "improve coherence between input, state, and context"
          : primaryInstability === "sourcefield-root"
            ? "strengthen root signal and baseline stability"
            : "maintain balanced stabilization"

  return {
    equationConsensusState,
    dominantEquationLane,
    primaryInstability,
    stableLaneCount: stableLanes.length,
    partialLaneCount: partialLanes.length,
    unstableLaneCount: unstableLanes.length,
    equationStatusMap: statusMap,
    recoveryFocus,
    crossEquationConsensusActive: true,
    rule: "Use cross-equation consensus as read-only diagnostic guidance across the Five Living Equations. It may identify dominant equation instability and recovery focus, but it must not override live metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
