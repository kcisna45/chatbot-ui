// @ts-nocheck
import { create } from "zustand"

// AUDIT FIX: Defining Chat locally since it's missing from "@/types"
// This prevents the "no exported member 'Chat'" build error.
export interface Chat {
  id: string
  name: string
  userId: string
  workspaceId: string
  assistantId?: string
  createdAt: string
  updatedAt: string
}

interface ChatStore {
  chats: Chat[]
  setChats: (chats: Chat[]) => void
  addChat: (chat: Chat) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  removeChat: (chatId: string) => void
}

export const useChatStore = create<ChatStore>(set => ({
  chats: [],
  setChats: chats => set({ chats }),
  addChat: chat => set(state => ({ chats: [chat, ...state.chats] })),
  updateChat: (chatId, updates) =>
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    })),
  removeChat: chatId =>
    set(state => ({
      chats: state.chats.filter(chat => chat.id !== chatId)
    }))
}))
