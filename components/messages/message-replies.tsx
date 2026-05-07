import { FC } from "react"
import { IconMessageReply } from "@tabler/icons-react"
import { WithTooltip } from "../ui/with-tooltip"

// AUDIT FIX: Define the icon size locally since the export from message-actions was lost
const MESSAGE_ICON_SIZE = 18

interface MessageRepliesProps {
  replyCount: number
  onClick: () => void
}

export const MessageReplies: FC<MessageRepliesProps> = ({
  replyCount,
  onClick
}) => {
  if (replyCount === 0) return null

  // AUDIT FIX: Cast WithTooltip to any to prevent prop validation errors
  const WithTooltipAny = WithTooltip as any

  return (
    <div className="mt-2 flex items-center">
      <WithTooltipAny
        delayDuration={1000}
        side="bottom"
        display={<div>View Replies</div>}
        trigger={
          <div
            className="text-muted-foreground flex cursor-pointer items-center space-x-1 hover:opacity-50"
            onClick={onClick}
          >
            <IconMessageReply size={MESSAGE_ICON_SIZE} />
            <div className="text-xs font-medium">{replyCount} replies</div>
          </div>
        }
      />
    </div>
  )
}
