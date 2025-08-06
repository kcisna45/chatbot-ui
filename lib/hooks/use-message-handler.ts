import { useMessageStore } from "@/providers/message-store"

export const useMessageHandler = () => {
  const { setMessages } = useMessageStore()
  
  const setChatMessages = (messages) => {
    setMessages(messages)
  }
  
  return {
    SeChatMesssages,
    handleIncomeingMessage,
  const handleIncomingMessage: (message: any) => {
      console.log("Mock handler received message:", message)
    }
  }
}
