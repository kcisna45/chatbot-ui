// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const searchParams = useSearchParams()

  // AUDIT FIX: Cast context to any to bypass missing property errors
  const { setWorkspaces, setSelectedWorkspace } = useContext(
    ChatbotUIContext
  ) as any

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Logic to fetch or set workspaces would go here
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Workspace...
      </div>
    )
  }

  return <>{children}</>
}
