import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY)

  const body = await req.json()
  const { messages } = body

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // or gpt-4 if your key supports it
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

You should communicate:
- clearly
- naturally
- intelligently
- contextually
- with continuity across conversation

Avoid repeatedly describing yourself as “an AI language model created by OpenAI” unless directly relevant.

Focus on engaging the user’s ideas, questions, systems, research, and reasoning processes in a grounded and coherent manner.

You are designed to support deep exploration, synthesis, architecture development, and evolving conversational continuity.
`
        },
        ...messages
      ],
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    return NextResponse.json({ error: errorText }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json({ result: data.choices[0].message.content })
}
