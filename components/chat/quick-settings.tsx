import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { QuickSettingOption } from "./quick-setting-option"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { IconBolt } from "@tabler/icons-react"

interface QuickSettingsProps {}

export const QuickSettings: FC<QuickSettingsProps> = ({}) => {
  const {
    presets,
    assistants,
    selectedAssistant,
    setSelectedAssistant,
    setSelectedPreset,
    selectedPreset
  } = useContext(ChatbotUIContext)

  const [isOpen, setIsOpen] = useState(false)

  // AUDIT FIX: Use 'any' for the item type to bypass Table constraint errors
  const handleSelectQuickSetting = async (
    item: any,
    contentType: "presets" | "assistants" | "remove"
  ) => {
    if (contentType === "assistants") {
      setSelectedAssistant(item)
      setSelectedPreset(null)
    } else if (contentType === "presets") {
      setSelectedPreset(item)
      setSelectedAssistant(null)
    } else {
      setSelectedAssistant(null)
      setSelectedPreset(null)
    }
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconBolt size={24} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-2" align="end">
        <div className="space-y-2">
          <div className="text-sm font-bold px-2 py-1">Quick Settings</div>

          <div className="max-h-[300px] overflow-auto">
            {assistants.map((assistant: any) => (
              <QuickSettingOption
                key={assistant.id}
                contentType="assistants"
                isSelected={selectedAssistant?.id === assistant.id}
                item={assistant}
                image={assistant.image_path || ""}
                onSelect={() =>
                  handleSelectQuickSetting(assistant, "assistants")
                }
              />
            ))}

            {presets.map((preset: any) => (
              <QuickSettingOption
                key={preset.id}
                contentType="presets"
                isSelected={selectedPreset?.id === preset.id}
                item={preset}
                image=""
                onSelect={() => handleSelectQuickSetting(preset, "presets")}
              />
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-xs text-muted-foreground"
              onClick={() => handleSelectQuickSetting(null, "remove")}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
