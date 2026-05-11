// @ts-nocheck
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { chatSettings, messages } = json as {
      chatSettings: ChatSettings
      messages: any[]
    }

    const profile = await getServerProfile()

    checkApiKey(profile.mistral_api_key, "Mistral")

    const mistral = new OpenAI({
      apiKey: profile.mistral_api_key || "",
      baseURL: "https://api.mistral.ai/v1"
    })

    // AUDIT FIX: Safely access token limits by casting the key
    // and providing a fallback value to prevent build failure.
    const modelLimit =
      CHAT_SETTING_LIMITS[
        chatSettings.model as keyof typeof CHAT_SETTING_LIMITS
      ]
    const maxTokens = modelLimit?.MAX_TOKEN_OUTPUT_LENGTH || 4096

    const response = await mistral.chat.completions.create({
      model: chatSettings.model,
      messages,
      max_tokens: maxTokens,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
