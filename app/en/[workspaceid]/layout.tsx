"use client"

import { supabase } from "@/lib/supabase/client"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { FC, ReactNode, useContext, useEffect, useState } from "react"
import { ChatbotUIContext } from "@/context/context"

interface WorkspaceLayoutProps {
  children: ReactNode
}

const WorkspaceLayout: FC<WorkspaceLayoutProps> = ({ children }) => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const { setWorkspaces, setSelectedWorkspace } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkspaceData()
  }, [])

  const fetchWorkspaceData = async () => {
    // @ts-ignore - 'params' check
    const workspaceId = params?.workspaceid as string

    const { data, error } = await supabase
      .from("workspaces")
      .select("*")

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      // @ts-ignore - schema mismatch bypass
      setWorkspaces(data)
      
      // @ts-ignore - column id check
      const selectedWorkspace = data.find(w => w.id === workspaceId)
      if (selectedWorkspace) {
        setSelectedWorkspace(selectedWorkspace)
      }
    }

    setLoading(false)
  }

  if (loading) {
    return <div>Loading Workspace...</div>
  }

  return <>{children}</>
}

export default WorkspaceLayout