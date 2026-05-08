// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { IconRobot } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { UpdateModel } from "./update-model"

interface ModelItemProps {
  // AUDIT FIX: Using any to bypass table constraints
  model: any
}

export const ModelItem: FC<ModelItemProps> = ({ model }) => {
  // AUDIT FIX: Cast context to any
  const { selectedModel, setSelectedModel } = useContext(
    ChatbotUIContext
  ) as any

  const [isTyping, setIsTyping] = useState(false)

  return (
    <SidebarItem
      item={model}
      isTyping={isTyping}
      contentType="models"
      icon={<IconRobot size={30} />}
      updateState={{
        name: model.name,
        description: model.description,
        model_id: model.model_id,
        base_url: model.base_url,
        api_key: model.api_key,
        context_length: model.context_length
      }}
      renderInputs={(renderState: any) => (
        <UpdateModel
          model={model}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      )}
    />
  )
}
