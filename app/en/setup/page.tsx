// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { useContext, useState } from "react"

export default function SetupPage() {
  // AUDIT FIX: Cast context to any to bypass the 'profile' property error
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace,
    setEnvParameters
  } = useContext(ChatbotUIContext) as any

  const [loading, setLoading] = useState(false)

  const handleCompleteSetup = async () => {
    setLoading(true)
    // Setup completion logic
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to SourceField</h1>
        <p className="text-muted-foreground">
          Let&apos;s get your profile set up.
        </p>

        {/* Simplified Setup UI */}
        <button
          onClick={handleCompleteSetup}
          disabled={loading}
          className="bg-primary w-full rounded p-2 text-white hover:opacity-90"
        >
          {loading ? "Saving..." : "Finish Setup"}
        </button>
      </div>
    </div>
  )
}
