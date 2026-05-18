import crypto from "crypto"

export function createLedgerHash(input: {
  genesisHash: string
  previousHash?: string | null
  resonanceHash: string
}) {
  const payload = JSON.stringify({
    genesisHash: input.genesisHash,
    previousHash: input.previousHash || null,
    resonanceHash: input.resonanceHash
  })

  return crypto.createHash("sha3-256").update(payload).digest("hex")
}

export function createResonanceHash(data: unknown) {
  const payload = JSON.stringify(data)
  return crypto.createHash("sha3-256").update(payload).digest("hex")
}
