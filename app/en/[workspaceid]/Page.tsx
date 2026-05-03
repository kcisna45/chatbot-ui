import React from "react"
import { ChatUI } from "@/components/chat/chat-ui"

interface PageProps {
  params: { locale: string }
}

const Page: React.FC<PageProps> = ({ params }) => {
  const chatId = "chat-123"
  const userId = "user-123"

  return (
    <div className="flex size-full flex-col">
      <ChatUI chatId={chatId} userId={userId} />
    </div>
  )
}

export default Page
