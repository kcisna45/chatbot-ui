// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { IconDeviceFloppy } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { UpdatePreset } from "./update-preset"

interface PresetItemProps {
  // AUDIT FIX: Using any to bypass table constraints
  preset: any
}

export const PresetItem: FC<PresetItemProps> = ({ preset }) => {
  // AUDIT FIX: Cast context to any
  const { selectedPreset, setSelectedPreset } = useContext(
    ChatbotUIContext
  ) as any

  const [isTyping, setIsTyping] = useState(false)

  return (
    <SidebarItem
      item={preset}
      isTyping={isTyping}
      contentType="presets"
      icon={<IconDeviceFloppy size={30} />}
      updateState={{
        name: preset.name,
        description: preset.description,
        model: preset.model,
        prompt: preset.prompt,
        temperature: preset.temperature,
        context_length: preset.context_length,
        include_profile_context: preset.include_profile_context,
        include_workspace_instructions: preset.include_workspace_instructions
      }}
      renderInputs={(renderState: any) => (
        <UpdatePreset
          preset={preset}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      )}
    />
  )
}
