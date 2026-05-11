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

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Note: Ensure your API route is at /api/chat and handles this specific JSON body
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          // Adding default settings in case the API expects them from previous fixes
          chatSettings: { model: "gpt-3.5-turbo", temperature: 0.7 }
        })
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()

      // If your API returns data.response, this stays.
      // If it returns data.message, change data.response to data.message.
      const botMessage: Message = {
        role: "assistant",
        content: data.response || data.message || "No response received."
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error(err)
      const errorMsg: Message = {
        role: "assistant",
        content:
          "⚠️ Error: Unable to get a response. Check console for details."
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="chat-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: "#ffffff",
        color: "#000000"
      }}
    >
      {/* Messages Window */}
      <div
        className="messages-window"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: m.role === "user" ? "#007bff" : "#e9e9eb",
              color: m.role === "user" ? "white" : "black",
              padding: "12px 16px",
              borderRadius: "18px",
              maxWidth: "80%",
              wordBreak: "break-word",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Visible and High Contrast */}
      <div
        className="input-container"
        style={{
          padding: "20px",
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: "10px",
          backgroundColor: "#f8f9fa"
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "12px 15px",
            borderRadius: "8px",
            border: "2px solid #007bff",
            fontSize: "16px",
            color: "black",
            backgroundColor: "white"
          }}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "0 25px",
            backgroundColor: loading || !input.trim() ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            minWidth: "100px"
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
}
