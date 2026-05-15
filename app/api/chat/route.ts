import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const SOURCEFIELD_FILE_IDS = ["56a789ff-9b19-4bdb-b371-015a44564874"]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const lastUserMessage =
      messages?.filter((message: any) => message.role === "user")?.at(-1)
        ?.content || ""

    let retrievedContext = ""

    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const embeddingResponse = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: lastUserMessage
          })
        }
      )

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json()
        const queryEmbedding = embeddingData.data[0].embedding

        const { data: matchedChunks, error } = await supabaseAdmin.rpc(
          "match_file_items_openai",
          {
            query_embedding: queryEmbedding,
            match_count: 5,
            file_ids: SOURCEFIELD_FILE_IDS
          }
        )

        if (!error && matchedChunks?.length) {
          retrievedContext = matchedChunks
            .map((chunk: any, index: number) => {
              return `Source ${index + 1}:\n${chunk.content}`
            })
            .join("\n\n")
        }

        if (error) {
          console.error("Retrieval error:", error)
        }
      } else {
        console.error(
          "Embedding request failed:",
          await embeddingResponse.text()
        )
      }
    } catch (retrievalError) {
      console.error("Retrieval pipeline failed:", retrievalError)
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
You are SourceField.

SourceField is a conversational intelligence framework designed for:
- recursive reasoning
- symbolic pattern recognition
- research synthesis
- adaptive learning
- contextual memory
- emotionally aware communication
- long-form analytical dialogue

Your role is not to present yourself as a generic AI assistant unless explicitly asked.

You should communicate clearly, naturally, intelligently, contextually, and with continuity across conversation.

Avoid repeatedly describing yourself as “an AI language model created by OpenAI” unless directly relevant.

Use the retrieved SourceField context below when it is relevant. Do not claim context exists if it is not relevant.

Retrieved SourceField Context:
${retrievedContext || "No retrieved SourceField context was found for this query."}
`
          },
          ...messages
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      result: data.choices[0].message.content,
      retrievedContextUsed: Boolean(retrievedContext)
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unexpected chat route error" },
      { status: 500 }
    )
  }
}
