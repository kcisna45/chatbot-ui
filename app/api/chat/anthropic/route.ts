// @ts-nocheck
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import { AnthropicStream, StreamingTextResponse } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { chatSettings, messages } = json as {
      chatSettings: ChatSettings
      messages: any[]
    }

    const profile = await getServerProfile()

    checkApiKey(profile.anthropic_api_key, "Anthropic")

    const anthropic = new Anthropic({
      apiKey: profile.anthropic_api_key || ""
    })

    // AUDIT FIX: Safely access token limits by casting the key
    // and providing a fallback value to prevent build failure.
    const modelLimit =
      CHAT_SETTING_LIMITS[
        chatSettings.model as keyof typeof CHAT_SETTING_LIMITS
      ]
    const maxTokens = modelLimit?.MAX_TOKEN_OUTPUT_LENGTH || 4096

    const response = await anthropic.messages.create({
      model: chatSettings.model,
      messages: messages.filter(m => m.role !== "system"),
      system: messages.find(m => m.role === "system")?.content || "",
      max_tokens: maxTokens,
      stream: true
    })

    const stream = AnthropicStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
