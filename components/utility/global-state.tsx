// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { FC, useState } from "react"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  // PROFILE STORE
  const [profile, setProfile] = useState<any | null>(null)

  // ITEMS STORE
  const [assistants, setAssistants] = useState<any[]>([])
  const [chats, setChats] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [presets, setPresets] = useState<any[]>([])
  const [prompts, setPrompts] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [workspaces, setWorkspaces] = useState<any[]>([])

  // SELECTED STORE
  const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(null)
  const [selectedChat, setSelectedChat] = useState<any | null>(null)
  const [selectedAssistant, setSelectedAssistant] = useState<any | null>(null)

  // PASS EVERYTHING INTO THE CONTEXT PROVIDER
  return (
    <ChatbotUIContext.Provider
      value={{
        profile,
        setProfile,
        assistants,
        setAssistants,
        chats,
        setChats,
        collections,
        setCollections,
        files,
        setFiles,
        folders,
        setFolders,
        models,
        setModels,
        presets,
        setPresets,
        prompts,
        setPrompts,
        tools,
        setTools,
        workspaces,
        setWorkspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        selectedChat,
        setSelectedChat,
        selectedAssistant,
        setSelectedAssistant
        // Add other state variables as they appear in your original file
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  )
}
