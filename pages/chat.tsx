// @ts-nocheck
import React, { useState, useEffect, useRef } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Key Logic: Enter to send, Shift + Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: input
    }

    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages,

          sourcefield: {
            resonanceTracking: true,
            memoryEnabled: true,
            equationEngineEnabled: true,
            coherenceMode: "v11"
          }
        })
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()

      const botMessage: Message = {
        role: "assistant",
        content: data.reply || data.message || "No response generated."
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error("CHAT FAILURE:", err)

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ SourceField connection failure."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: "#000000", // Full black background
        color: "#FFFFFF", // White text base
        fontFamily: "sans-serif"
      }}
    >
      {/* Messages Window */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: m.role === "user" ? "#2563eb" : "#262626", // Blue for user, Grey for Bot
              color: "white",
              padding: "12px 16px",
              borderRadius: "15px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap" // Crucial: shows the new lines from Shift+Enter
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          backgroundColor: "#000000"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            maxWidth: "900px",
            margin: "0 auto",
            backgroundColor: "#171717", // Slightly lighter black for the input box
            borderRadius: "10px",
            padding: "8px",
            border: "1px solid #444"
          }}
        >
          <textarea
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "#FFFFFF", // Typing text is white
              border: "none",
              outline: "none",
              padding: "10px",
              fontSize: "16px",
              resize: "none",
              minHeight: "40px"
            }}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim() ? "#333" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0 20px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.2s"
            }}
          >
            {loading ? "..." : "SEND"}
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "10px",
            color: "#666",
            marginTop: "10px"
          }}
        >
          Enter to send | Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}
