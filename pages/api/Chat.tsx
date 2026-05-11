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
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      const botMessage: Message = { role: "assistant", content: data.response }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error(err)
      const errorMsg: Message = {
        role: "assistant",
        content: "⚠️ Error: Unable to get a response."
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    /* AUDIT FIX: Replaced 'styles.xxx' with plain strings to prevent "Cannot find name 'styles'" */
    <div
      className="chat-container-main"
      style={{
        padding: "20px",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        className="messages-window"
        style={{ flex: 1, overflowY: "auto", marginBottom: "20px" }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "user-msg-bubble" : "bot-msg-bubble"}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: m.role === "user" ? "#007bff" : "#f1f1f1",
              color: m.role === "user" ? "white" : "black",
              borderRadius: "10px",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start"
            }}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area" style={{ display: "flex", gap: "10px" }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
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
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
}
