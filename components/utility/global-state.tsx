// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { FC, useState } from "react"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const [profile, setProfile] = useState<any | null>(null)

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

  const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(null)
  const [selectedChat, setSelectedChat] = useState<any | null>(null)
  const [selectedAssistant, setSelectedAssistant] = useState<any | null>(null)

  const [userInput, setUserInput] = useState("")
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatFileItems, setChatFileItems] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

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
        setSelectedAssistant,

        userInput,
        setUserInput,
        chatMessages,
        setChatMessages,
        chatFileItems,
        setChatFileItems,
        isGenerating,
        setIsGenerating
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  )
}
