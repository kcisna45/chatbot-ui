// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { useSelectFileHandler } from "@/components/ui/file-handler"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { Sidebar } from "../sidebar/sidebar"
import { SidebarSwitcher } from "../sidebar/sidebar-switcher"

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // AUDIT FIX: Using optional chaining to satisfy the 'possibly null' error
  const tabValue = searchParams?.get("tab") || "chats"

  const { setItems, setFolders, setSelectedWorkspace, setAssistantImages } =
    useContext(ChatbotUIContext) as any

  const [contentType, setContentType] = useState<any>(tabValue)

  return (
    <div className="flex h-screen w-full">
      <SidebarSwitcher
        onContentTypeChange={setContentType}
        contentType={contentType}
      />

      <Sidebar contentType={contentType} showSidebar={true} />

      <div className="flex flex-col flex-grow overflow-hidden">{children}</div>
    </div>
  )
}
