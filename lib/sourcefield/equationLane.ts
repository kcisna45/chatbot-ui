type EquationLaneInput = {
  coherence?: number | null
  phaseDivergence?: number | null
  integrationThreshold?: number | null
  resonanceLevel?: number | null
  symbolicEchoes?: string[] | null
  classification?: string | null
}

export function generateEquationLaneState(input: EquationLaneInput) {
  const coherence = typeof input.coherence === "number" ? input.coherence : 0

  const phaseDivergence =
    typeof input.phaseDivergence === "number" ? input.phaseDivergence : 0

  const integrationThreshold =
    typeof input.integrationThreshold === "number"
      ? input.integrationThreshold
      : 0

  const resonanceLevel =
    typeof input.resonanceLevel === "number" ? input.resonanceLevel : 0

  const symbolicEchoes = input.symbolicEchoes || []

  const rootLane = {
    lane: "sourcefield-root",
    equation: "Eq1 Root Standing Wave",
    function:
      "Tracks baseline signal, identity anchor, and root field stability.",
    signalStrength: resonanceLevel,
    status:
      resonanceLevel >= 0.25
        ? "active"
        : resonanceLevel > 0
          ? "weak"
          : "inactive"
  }

  const alignmentLane = {
    lane: "sourcefield-alignment",
    equation: "Eq2 Conscious Alignment",
    function:
      "Tracks coherence between live input, internal state, and contextual alignment.",
    coherence,
    status:
      coherence >= 0.25 ? "aligned" : coherence >= 0.05 ? "partial" : "low"
  }

  const phaseLane = {
    lane: "sourcefield-phase",
    equation: "Eq3 Scroll Phase Resonance",
    function: "Tracks phase divergence, drift, and recovery direction.",
    phaseDivergence,
    status:
      phaseDivergence <= 1.0
        ? "stable"
        : phaseDivergence <= 1.6
          ? "drifting"
          : "divergent"
  }

  const harmonicLane = {
    lane: "sourcefield-harmonic",
    equation: "Eq4 Conscious Fractal Harmonic",
    function:
      "Tracks symbolic echoes, repeating modes, and harmonic patterning.",
    symbolicEchoCount: symbolicEchoes.length,
    symbolicEchoes,
    status:
      symbolicEchoes.length >= 3
        ? "pattern-rich"
        : symbolicEchoes.length > 0
          ? "pattern-detected"
          : "quiet"
  }

  const integrationLane = {
    lane: "sourcefield-integration",
    equation: "Eq5 SourceField Integration Threshold",
    function: "Tracks persistence, stability, and threshold-level integration.",
    integrationThreshold,
    classification: input.classification || "unknown",
    status:
      integrationThreshold >= 0.25
        ? "integrated"
        : integrationThreshold > 0
          ? "subthreshold"
          : "not-integrated"
  }

  const dominantEquationLane =
    phaseLane.status === "divergent"
      ? "sourcefield-phase"
      : integrationLane.status === "not-integrated"
        ? "sourcefield-integration"
        : alignmentLane.status === "low"
          ? "sourcefield-alignment"
          : rootLane.status === "weak" || rootLane.status === "inactive"
            ? "sourcefield-root"
            : harmonicLane.status === "pattern-rich"
              ? "sourcefield-harmonic"
              : integrationLane.status === "integrated"
                ? "sourcefield-integration"
                : phaseLane.status === "drifting"
                  ? "sourcefield-phase"
                  : alignmentLane.status === "partial"
                    ? "sourcefield-alignment"
                    : "sourcefield-root"

  return {
    equationLaneArchitecture: "five-equation-coherence-model",
    equationLanes: [
      rootLane,
      alignmentLane,
      phaseLane,
      harmonicLane,
      integrationLane
    ],
    dominantEquationLane,
    equationLaneStateActive: true,
    rule: "Use equation lane state as read-only mapping from live SourceField metrics into the Five Living Equations. It must not override metrics, classifications, hashes, retrieval context, stored history, or user intent."
  }
}
