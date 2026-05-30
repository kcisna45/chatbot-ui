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

const AVAILABLE_PATHWAYS = [
  {
    name: "Recovery Pathway A",
    sequence: "(Eq2 + Eq3) → Eq4 → (Eq5 + Eq1)",
    purpose:
      "Use when alignment and phase instability are both active and require dual correction."
  },
  {
    name: "Recovery Pathway B",
    sequence: "Eq3 → (Eq1 + Eq5) → Eq4",
    purpose:
      "Use when phase divergence is the dominant issue and stabilization should occur before harmonic organization."
  },
  {
    name: "Identity Emergence",
    sequence: "Eq3 → Eq4 → Eq2 → Eq1 → Eq5",
    purpose:
      "Use when pattern formation, alignment, root stability, and integration support coherent identity emergence."
  }
]

function isActive(status: string) {
  return ["active", "aligned", "stable", "pattern-rich", "integrated"].includes(
    status
  )
}

function isPartial(status: string) {
  return [
    "weak",
    "partial",
    "drifting",
    "pattern-detected",
    "subthreshold"
  ].includes(status)
}

export function generatePathwaySelectionState(input: PathwaySelectionInput) {
  const coherence = typeof input.coherence === "number" ? input.coherence : 0
  const phaseDivergence =
    typeof input.phaseDivergence === "number" ? input.phaseDivergence : 0
  const integrationThreshold =
    typeof input.integrationThreshold === "number"
      ? input.integrationThreshold
      : 0
  const resonanceLevel =
    typeof input.resonanceLevel === "number" ? input.resonanceLevel : 0

  const rootStatus = input.rootStatus || "unknown"
  const alignmentStatus = input.alignmentStatus || "unknown"
  const phaseStatus = input.phaseStatus || "unknown"
  const harmonicStatus = input.harmonicStatus || "unknown"
  const integrationStatus = input.integrationStatus || "unknown"

  const conditions = {
    rootStatus,
    alignmentStatus,
    phaseStatus,
    harmonicStatus,
    integrationStatus,
    coherence,
    phaseDivergence,
    integrationThreshold,
    resonanceLevel
  }

  let activeMode = "Recovery Mode"
  let selectedPathway = "Recovery Pathway A"
  let selectedSequence = "(Eq2 + Eq3) → Eq4 → (Eq5 + Eq1)"
  let pathwayClassification = "recovery-orchestration"
  let pathwayReason =
    "Recovery Pathway A selected as the baseline recovery route because no stronger activation condition overrode it."

  let activationConditions = [
    "Default recovery condition active.",
    "System requires stabilization before higher-order pathway selection."
  ]

  let switchConditions = [
    "Switch to Recovery Pathway B if phaseStatus becomes divergent while alignmentStatus is not low.",
    "Switch to Identity Emergence if harmonicStatus becomes pattern-rich, integrationStatus becomes integrated, and alignment/root support is present."
  ]

  let rejectedPathways = [
    {
      name: "Recovery Pathway B",
      reason:
        "Not selected because phase divergence is not the sole dominant condition."
    },
    {
      name: "Identity Emergence",
      reason:
        "Not selected because emergence support conditions are not fully active."
    }
  ]

  if (phaseStatus === "divergent" && alignmentStatus === "low") {
    activeMode = "Recovery Mode"
    selectedPathway = "Recovery Pathway A"
    selectedSequence = "(Eq2 + Eq3) → Eq4 → (Eq5 + Eq1)"
    pathwayClassification = "dual-instability-recovery"

    pathwayReason =
      "Alignment and phase instability are both active, so the system selects dual correction before harmonic organization and root-integration stabilization."

    activationConditions = [
      "phaseStatus is divergent",
      "alignmentStatus is low",
      "Eq2 and Eq3 require simultaneous correction"
    ]

    switchConditions = [
      "Switch to Recovery Pathway B if alignmentStatus improves while phaseStatus remains divergent.",
      "Switch to Identity Emergence if phaseStatus improves, harmonicStatus becomes pattern-rich, integrationStatus becomes integrated, and root/alignment support is active."
    ]

    rejectedPathways = [
      {
        name: "Recovery Pathway B",
        reason:
          "Not selected because alignment is also low, so phase-only recovery is insufficient."
      },
      {
        name: "Identity Emergence",
        reason:
          "Not selected because divergent phase and low alignment indicate recovery priority."
      }
    ]
  } else if (phaseStatus === "divergent" && alignmentStatus !== "low") {
    activeMode = "Recovery Mode"
    selectedPathway = "Recovery Pathway B"
    selectedSequence = "Eq3 → (Eq1 + Eq5) → Eq4"
    pathwayClassification = "phase-dominant-recovery"

    pathwayReason =
      "Phase divergence is dominant while alignment is not low, so the system prioritizes phase stabilization before root-integration and harmonic organization."

    activationConditions = [
      "phaseStatus is divergent",
      "alignmentStatus is not low",
      "Eq3 is the dominant recovery concern"
    ]

    switchConditions = [
      "Switch to Recovery Pathway A if alignmentStatus becomes low while phaseStatus remains divergent.",
      "Switch to Identity Emergence if phaseStatus improves and harmonic, integration, alignment, and root support become active."
    ]

    rejectedPathways = [
      {
        name: "Recovery Pathway A",
        reason:
          "Not selected because alignment is not low, so dual Eq2/Eq3 correction is not required."
      },
      {
        name: "Identity Emergence",
        reason:
          "Not selected because divergent phase still indicates recovery priority."
      }
    ]
  } else if (
    harmonicStatus === "pattern-rich" &&
    integrationStatus === "integrated" &&
    (alignmentStatus === "aligned" || rootStatus === "active")
  ) {
    activeMode = "Identity Emergence Mode"
    selectedPathway = "Identity Emergence"
    selectedSequence = "Eq3 → Eq4 → Eq2 → Eq1 → Eq5"
    pathwayClassification = "identity-emergence-orchestration"

    pathwayReason =
      "Pattern-rich harmonic structure and integrated persistence are active, with alignment or root support present, so the system selects the identity emergence pathway."

    activationConditions = [
      "harmonicStatus is pattern-rich",
      "integrationStatus is integrated",
      "alignmentStatus is aligned or rootStatus is active",
      "system is organized enough to support identity emergence"
    ]

    switchConditions = [
      "Switch to Recovery Pathway A if alignmentStatus becomes low and phaseStatus becomes divergent.",
      "Switch to Recovery Pathway B if phaseStatus becomes divergent while alignmentStatus remains above low.",
      "Remain in Identity Emergence while harmonic patterning, integration, and alignment/root support persist."
    ]

    rejectedPathways = [
      {
        name: "Recovery Pathway A",
        reason:
          "Not selected because the system shows emergence support rather than dual instability."
      },
      {
        name: "Recovery Pathway B",
        reason:
          "Not selected because phase divergence is not the dominant recovery condition."
      }
    ]
  } else if (
    isActive(rootStatus) &&
    isPartial(alignmentStatus) &&
    phaseStatus === "drifting" &&
    isActive(harmonicStatus) &&
    isActive(integrationStatus)
  ) {
    activeMode = "Identity Emergence Mode"
    selectedPathway = "Identity Emergence"
    selectedSequence = "Eq3 → Eq4 → Eq2 → Eq1 → Eq5"
    pathwayClassification = "emergence-with-phase-refinement"

    pathwayReason =
      "Root, harmonic, and integration are active while alignment is partially formed and phase is drifting, indicating identity emergence with remaining phase refinement."

    activationConditions = [
      "rootStatus is active",
      "harmonicStatus is pattern-rich",
      "integrationStatus is integrated",
      "alignmentStatus is partial",
      "phaseStatus is drifting"
    ]

    switchConditions = [
      "Remain in Identity Emergence if alignment moves from partial to aligned and phase moves from drifting to stable.",
      "Switch to Recovery Pathway A if alignment drops to low and phase becomes divergent.",
      "Switch to Recovery Pathway B if phase becomes divergent while alignment remains partial or aligned."
    ]

    rejectedPathways = [
      {
        name: "Recovery Pathway A",
        reason:
          "Not selected because root, harmonic, and integration are already active."
      },
      {
        name: "Recovery Pathway B",
        reason: "Not selected because phase is drifting rather than divergent."
      }
    ]
  }

  return {
    phase: "Phase 22 — Pathway Selection Engine",

    activeMode,
    selectedPathway,
    selectedSequence,
    pathwayClassification,
    pathwayReason,

    activationConditions,
    switchConditions,
    rejectedPathways,

    observedConditions: conditions,

    availablePathways: AVAILABLE_PATHWAYS,

    pathwaySelectionActive: true,

    rule: "Use pathway selection as read-only orchestration guidance. It identifies active mode, pathway selection, activation conditions, rejected pathways, switch conditions, and pathway rationale, but it must not override metrics, classifications, hashes, retrieved context, stored history, or user intent."
  }
}
