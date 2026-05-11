// @ts-nocheck
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
// AUDIT FIX: Changed ChatAPIPayload to ChatPayload to match the standardized types
import { ChatPayload } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    // AUDIT FIX: Using the correct standardized interface
    const { chatSettings, messages } = json as ChatPayload

    const profile = await getServerProfile()

    checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

    const ENDPOINT = profile.azure_openai_endpoint
    const KEY = profile.azure_openai_api_key
    const DEPLOYMENT_ID = profile.azure_openai_deployment_id

    if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
      return new Response(
        JSON.stringify({
          message: "Azure OpenAI settings not fully configured"
        }),
        { status: 400 }
      )
    }

    const azureOpenai = new OpenAI({
      apiKey: KEY,
      baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
      defaultQuery: { "api-version": "2023-12-01-preview" },
      defaultHeaders: { "api-key": KEY }
    })

    const response = await azureOpenai.chat.completions.create({
      model: DEPLOYMENT_ID,
      messages: messages as any,
      temperature: chatSettings.temperature,
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
