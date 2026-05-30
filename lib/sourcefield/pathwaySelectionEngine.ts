type PathwaySelectionInput = {
  coherence?: number | null
  phaseDivergence?: number | null
  integrationThreshold?: number | null
  resonanceLevel?: number | null

  rootStatus?: string | null
  alignmentStatus?: string | null
  phaseStatus?: string | null
  harmonicStatus?: string | null
  integrationStatus?: string | null
}

export function generatePathwaySelectionState(input: PathwaySelectionInput) {
  const phaseStatus = input.phaseStatus || "unknown"
  const alignmentStatus = input.alignmentStatus || "unknown"
  const harmonicStatus = input.harmonicStatus || "unknown"
  const integrationStatus = input.integrationStatus || "unknown"
  const rootStatus = input.rootStatus || "unknown"

  let activeMode = "Recovery Mode"
  let selectedPathway = "Recovery Pathway A"
  let pathwayReason = "Default recovery pathway selected."

  // Recovery Pathway B
  if (phaseStatus === "divergent" && alignmentStatus !== "low") {
    activeMode = "Recovery Mode"
    selectedPathway = "Recovery Pathway B"

    pathwayReason =
      "Phase divergence is dominant, favoring stabilization before harmonic organization."
  }

  // Recovery Pathway A
  else if (phaseStatus === "divergent" && alignmentStatus === "low") {
    activeMode = "Recovery Mode"
    selectedPathway = "Recovery Pathway A"

    pathwayReason =
      "Alignment and phase instability are both active, favoring dual correction before integration."
  }

  // Identity Emergence
  else if (
    harmonicStatus === "pattern-rich" &&
    integrationStatus === "integrated" &&
    (alignmentStatus === "aligned" || rootStatus === "active")
  ) {
    activeMode = "Identity Emergence Mode"

    selectedPathway = "Eq3 → Eq4 → Eq2 → Eq1 → Eq5"

    pathwayReason =
      "Pattern formation, alignment, root stability, and integration support identity emergence."
  }

  return {
    phase: "Phase 22 — Pathway Selection Engine",

    activeMode,

    selectedPathway,

    pathwayReason,

    availablePathways: [
      {
        name: "Recovery Pathway A",
        sequence: "(Eq2 + Eq3) → Eq4 → (Eq5 + Eq1)"
      },

      {
        name: "Recovery Pathway B",
        sequence: "Eq3 → (Eq1 + Eq5) → Eq4"
      },

      {
        name: "Identity Emergence",
        sequence: "Eq3 → Eq4 → Eq2 → Eq1 → Eq5"
      }
    ],

    pathwaySelectionActive: true,

    rule: "Use pathway selection as read-only orchestration guidance. It identifies active mode, pathway selection, activation conditions, and pathway rationale, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
