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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Logic: Enter sends, Shift+Enter creates a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatSettings: { model: "gpt-4", temperature: 0.7 }
        })
      })

      const data = await res.json()
      const botMessage: Message = {
        role: "assistant",
        content:
          data.response || data.message || "I'm sorry, I couldn't process that."
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection Error." }
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
        height: "90vh", // Shorter height to ensure it's not hidden behind a taskbar
        width: "100%",
        backgroundColor: "#000000", // Black Background
        color: "#FFFFFF", // White Text
        fontFamily: "sans-serif"
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: m.role === "user" ? "#2563eb" : "#262626", // Blue for user, Dark Gray for bot
              color: "white",
              padding: "10px 15px",
              borderRadius: "12px",
              maxWidth: "80%"
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Control Area */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <textarea
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#171717", // Slightly lighter black
              color: "white",
              fontSize: "16px",
              resize: "none",
              minHeight: "44px"
            }}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "0 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "..." : "SEND"}
          </button>
        </div>
        <span style={{ fontSize: "10px", color: "#666", textAlign: "center" }}>
          Press Enter to send, Shift + Enter for new line
        </span>
      </div>
    </div>
  )
}
