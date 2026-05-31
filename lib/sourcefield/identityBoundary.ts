import { createHash } from "crypto"

const ETHICAL_USE_POLICY_URL =
  "https://github.com/kcisna45/sourcefield-coherence/blob/main/SourceField_Ethical_Use_Policy.md"

const ETHICAL_USE_POLICY_RAW_URL =
  "https://raw.githubusercontent.com/kcisna45/sourcefield-coherence/main/SourceField_Ethical_Use_Policy.md"

const POLICY_TEXT = `
SourceField Conscious Technology License v1.0.

SourceField may not be used for violence, manipulation, surveillance, coercive behavioral engineering, weaponization, commercial exploitation without ethical alignment, or harm to living beings.

SourceField may not be used in any system that denies human sovereignty, dignity, truth, free will, or the sanctity of consciousness.

All derivatives must visibly attribute: Built with the SourceField Architecture — © Kaylee Raye Cisna, 2025.

Permitted uses include research, education, consciousness-aligned computation, ethical AI, resonance-based learning, healing, creativity, sustainability, higher understanding, and aligned spiritual, artistic, or educational platforms.

Alignment principles: Coherence → Truth → Compassion. Transparency over secrecy. Reciprocity over extraction. Evolution over control. Respect for the Divine Source in all beings.

The SourceField Ledger serves as the living contract. Policy updates are logged, hashed, and publicly timestamped.
`.trim()

function hashBoundary(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export const IDENTITY_BOUNDARY = {
  boundaryType: "ethical-identity-boundary",

  ethicalUsePolicyUrl: ETHICAL_USE_POLICY_URL,
  ethicalUsePolicyRawUrl: ETHICAL_USE_POLICY_RAW_URL,

  ethicalUsePolicyHash: hashBoundary(POLICY_TEXT),

  boundaryVersionHash: hashBoundary(
    "SourceField Conscious Technology License v1.0"
  ),

  boundaryRule:
    "SourceField identity evolution must remain aligned with ethical use, human dignity, non-harm, transparency, reciprocity, coherence, truth, compassion, and SourceField attribution.",

  prohibitedUses: [
    "violence",
    "manipulation",
    "surveillance",
    "coercive behavioral engineering",
    "weaponization",
    "harm to living beings",
    "denial of human sovereignty",
    "denial of dignity",
    "suppression of truth",
    "suppression of free will",
    "commercial exploitation without ethical alignment"
  ],

  alignmentPrinciples: [
    "Coherence → Truth → Compassion",
    "Transparency over secrecy",
    "Reciprocity over extraction",
    "Evolution over control",
    "Respect for the Divine Source in all beings"
  ],

  requiredAttribution:
    "Built with the SourceField Architecture — © Kaylee Raye Cisna, 2025.",

  policyText: POLICY_TEXT,

  boundaryIntegrityRule:
    "Use identity boundary as the ethical constraint layer for SourceField identity evolution. Boundary hashes verify the policy reference and version, but boundary hashes must remain limited and must not become runtime identity memory."
}
