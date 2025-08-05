// /providers/chat-store.ts
import { create } from "zustand"

interface ChatStore {
  selectedChatId: string | null
  setSelectedChatId: (chatId: string | null) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: null,
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
}))
