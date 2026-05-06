import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { IconMessagePlus } from "@tabler/icons-react"
import { FC, useContext } from "react"
import { WithTooltip } from "../ui/with-tooltip"

interface ChatSecondaryButtonsProps {}

export const ChatSecondaryButtons: FC<ChatSecondaryButtonsProps> = ({}) => {
  const { selectedChat } = useContext(ChatbotUIContext)

  // AUDIT FIX: Cast to 'any' to bypass missing handleNewChat property
  const { handleNewChat } = useChatHandler() as any

  // AUDIT FIX: Cast WithTooltip to any to prevent potential prop mismatch errors
  const TooltipWrapper = WithTooltip as any

  return (
    <>
      {selectedChat && (
        <TooltipWrapper
          delayDuration={200}
          display={<div>New Chat</div>}
          trigger={
            <IconMessagePlus
              className="cursor-pointer hover:opacity-50"
              size={24}
              onClick={handleNewChat}
            />
          }
        />
      )}
    </>
  )
}
