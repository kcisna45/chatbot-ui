import { useEffect, useState } from "react"
import { Message } from "@/types/message"

export const useMessages = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message])
  }

  const updateMessage = (id: string, updatedFields: Partial<Message>) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, ...updatedFields } : message
      )
    )
  }

  const deleteMessage = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.filter(message => message.id !== id)
    )
  }

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage
  }
}
