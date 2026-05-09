// @ts-nocheck
import { Tables } from "@/supabase/types"
import { Dispatch, SetStateAction, createContext } from "react"

interface ChatbotUIContext {
  // PROFILE STORE
  profile: any | null
  setProfile: Dispatch<SetStateAction<any | null>>

  // ITEMS STORE
  assistants: any[]
  setAssistants: Dispatch<SetStateAction<any[]>>
  chats: any[]
  setChats: Dispatch<SetStateAction<any[]>>
  collections: any[]
  setCollections: Dispatch<SetStateAction<any[]>>
  files: any[]
  setFiles: Dispatch<SetStateAction<any[]>>
  folders: any[]
  setFolders: Dispatch<SetStateAction<any[]>>
  models: any[]
  setModels: Dispatch<SetStateAction<any[]>>
  presets: any[]
  setPresets: Dispatch<SetStateAction<any[]>>
  prompts: any[]
  setPrompts: Dispatch<SetStateAction<any[]>>
  tools: any[]
  setTools: Dispatch<SetStateAction<any[]>>
  workspaces: any[]
  setWorkspaces: Dispatch<SetStateAction<any[]>>

  // SELECTED STORE
  selectedWorkspace: any | null
  setSelectedWorkspace: Dispatch<SetStateAction<any | null>>
  selectedChat: any | null
  setSelectedChat: Dispatch<SetStateAction<any | null>>
  selectedAssistant: any | null
  setSelectedAssistant: Dispatch<SetStateAction<any | null>>

  // Note: If there are other states in your specific file,
  // ensure they also use 'any' for their types.
}

export const ChatbotUIContext = createContext<ChatbotUIContext | undefined>(
  undefined
)
