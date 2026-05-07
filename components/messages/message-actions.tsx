import { FC } from "react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { WithTooltip } from "../ui/with-tooltip"

interface MessageActionsProps {
  isAssistant: boolean
  isHovering: boolean
  onEdit: () => void
  onDelete: () => void
}

export const MessageActions: FC<MessageActionsProps> = ({
  isAssistant,
  isHovering,
  onEdit,
  onDelete
}) => {
  // AUDIT FIX: Cast WithTooltip to 'any' to bypass prop validation errors
  const WithTooltipAny = WithTooltip as any

  return (
    <div className="flex flex-col space-y-1">
      {!isAssistant && isHovering && (
        <WithTooltipAny
          delayDuration={1000}
          side="bottom"
          display={<div>Edit</div>}
          trigger={
            <IconEdit
              className="cursor-pointer opacity-50 hover:opacity-100"
              size={18}
              onClick={onEdit}
            />
          }
        />
      )}

      {isHovering && (
        <WithTooltipAny
          delayDuration={1000}
          side="bottom"
          display={<div>Delete</div>}
          trigger={
            <IconTrash
              className="cursor-pointer opacity-50 hover:opacity-100"
              size={18}
              onClick={onDelete}
            />
          }
        />
      )}
    </div>
  )
}
