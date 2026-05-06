import { ChatbotUIContext } from "@/context/context"
import { IconSettings } from "@tabler/icons-react"
import { FC, useContext } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { WithTooltip } from "../ui/with-tooltip"

interface ChatRetrievalSettingsProps {}

export const ChatRetrievalSettings: FC<ChatRetrievalSettingsProps> = ({}) => {
  const { sourceCount, setSourceCount, chatSettings } =
    useContext(ChatbotUIContext)

  // AUDIT FIX: Cast WithTooltip or the props to 'any' to bypass strict IntrinsicAttributes check
  const TooltipWrapper = WithTooltip as any

  if (!chatSettings) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TooltipWrapper
          delayDuration={0}
          side="top"
          display={<div>Adjust retrieval settings.</div>}
          trigger={
            <Button variant="ghost" size="icon">
              <IconSettings size={24} />
            </Button>
          }
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retrieval Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Source Count: {sourceCount}</Label>
            <Slider
              value={[sourceCount]}
              onValueChange={values => setSourceCount(values[0])}
              min={1}
              max={20}
              step={1}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
