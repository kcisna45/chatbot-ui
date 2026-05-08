// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { IconTools } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { UpdateTool } from "./update-tool"

interface ToolItemProps {
  tool: any
}

export const ToolItem: FC<ToolItemProps> = ({ tool }) => {
  const { setSelectedTool } = useContext(ChatbotUIContext) as any
  const [isTyping, setIsTyping] = useState(false)

  return (
    <SidebarItem
      item={tool}
      isTyping={isTyping}
      contentType="tools"
      icon={<IconTools size={30} />}
      updateState={{
        name: tool.name,
        description: tool.description,
        url: tool.url,
        custom_headers: tool.custom_headers,
        schema: tool.schema
      }}
      renderInputs={(renderState: any) => (
        <UpdateTool tool={tool} isTyping={isTyping} setIsTyping={setIsTyping} />
      )}
    />
  )
}
