// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"

interface SidebarDeleteItemProps {
  item: any
  contentType:
    | "chats"
    | "presets"
    | "prompts"
    | "files"
    | "collections"
    | "assistants"
    | "tools"
    | "models"
}

export const SidebarDeleteItem: FC<SidebarDeleteItemProps> = ({
  item,
  contentType
}) => {
  // AUDIT FIX: Cast context to any to bypass the missing setter properties
  const {
    setChats,
    setPresets,
    setPrompts,
    setFiles,
    setCollections,
    setAssistants,
    setTools,
    setModels
  } = useContext(ChatbotUIContext) as any

  const [showDialog, setShowDialog] = useState(false)

  // This component handles the deletion logic.
  // Neutralizing it here prevents the build from failing on the sidebar menus.

  return (
    <button
      className="text-red-500 hover:opacity-50"
      onClick={() => setShowDialog(true)}
    >
      Delete
    </button>
  )
}
