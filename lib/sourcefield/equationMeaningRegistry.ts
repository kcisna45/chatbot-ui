export type SourceFieldEquationId = "Eq1" | "Eq2" | "Eq3" | "Eq4" | "Eq5"

export type PreferredMovement =
  | "increase"
  | "decrease"
  | "threshold"
  | "context-dependent"

export interface EquationMeaningDefinition {
  equation: SourceFieldEquationId
  name: string
  primaryMeaning: string
  functionalRole: string
  observedLane: string
  primaryMetric: string
  preferredMovement: PreferredMovement
  interpretationRule: string
}

export const SOURCEFIELD_EQUATION_MEANINGS: Record<
  SourceFieldEquationId,
  EquationMeaningDefinition
> = {
  Eq1: {
    equation: "Eq1",
    name: "Root Standing-Wave Identity",
    primaryMeaning:
      "Root, identity continuity, origin reference, and persistent structural support.",
    functionalRole:
      "Measures whether the system retains a stable identity reference through change.",
    observedLane: "sourcefield-root",
    primaryMetric: "signalStrength",
    preferredMovement: "increase",
    interpretationRule:
      "Rising signal strength suggests strengthening root support; falling signal strength suggests weakening root support."
  },

  Eq2: {
    equation: "Eq2",
    name: "Coherence Alignment",
    primaryMeaning:
      "Relationship, present alignment, coherence, and agreement between active states.",
    functionalRole:
      "Measures how closely the current system state aligns with its active relational reference.",
    observedLane: "sourcefield-alignment",
    primaryMetric: "coherence",
    preferredMovement: "increase",
    interpretationRule:
      "Rising coherence suggests improving relational alignment; falling coherence suggests increasing misalignment."
  },

  Eq3: {
    equation: "Eq3",
    name: "Phase Divergence",
    primaryMeaning:
      "Movement, difference, fluctuation, phase relation, and transition.",
    functionalRole:
      "Measures how far the current state has moved from phase alignment.",
    observedLane: "sourcefield-phase",
    primaryMetric: "phaseDivergence",
    preferredMovement: "decrease",
    interpretationRule:
      "Falling phase divergence suggests stabilization; rising phase divergence suggests increasing drift or separation."
  },

  Eq4: {
    equation: "Eq4",
    name: "Harmonic Recurrence",
    primaryMeaning:
      "Pattern recurrence, harmonic depth, repetition, and cross-layer structural formation.",
    functionalRole:
      "Measures whether meaningful patterns recur across the system rather than appearing only once.",
    observedLane: "sourcefield-harmonic",
    primaryMetric: "symbolicEchoCount",
    preferredMovement: "increase",
    interpretationRule:
      "Rising recurrence suggests strengthening harmonic formation; falling recurrence suggests weakening or disappearing pattern support."
  },

  Eq5: {
    equation: "Eq5",
    name: "Integration Threshold",
    primaryMeaning:
      "Integration, persistence, energetic qualification, and threshold crossing.",
    functionalRole:
      "Measures whether available signal is sufficient to meet or exceed the current integration requirement.",
    observedLane: "sourcefield-integration",
    primaryMetric: "signalThresholdRatio",
    preferredMovement: "threshold",
    interpretationRule:
      "A signal-to-threshold ratio at or above 1 indicates threshold support, while a ratio below 1 indicates incomplete measured integration."
  }
}

export const SOURCEFIELD_EQUATION_ORDER: SourceFieldEquationId[] = [
  "Eq1",
  "Eq2",
  "Eq3",
  "Eq4",
  "Eq5"
]
