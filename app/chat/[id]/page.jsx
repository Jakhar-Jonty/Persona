"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, MoreVertical, Smile } from "lucide-react"

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Initial greeting (old logic)
  useEffect(() => {
    if (id) {
      setMessages([{ role: "assistant", content: `Hi! You are now chatting with ${id}.` }])
    }
  }, [id])
  

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const newMessages = [...messages, { role: "user", content: inputMessage }]
    setMessages(newMessages)
    setInputMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, person: id })
      })
      const data = await res.json()

      setMessages([...newMessages, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Top Bar */}
      <div className=" backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="hover:bg-emerald-50 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center font-bold">
              {id?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold">{id}</h1>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
                Chat Active
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-emerald-50 rounded-xl">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
                  <Smile className="w-5 h-5 text-emerald-700" />
                </div>
              )}
              <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-xs sm:max-w-md lg:max-w-lg`}>
                <Card
                  className={`p-4 shadow-lg border-0 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                      : "bg-white text-slate-900 border border-emerald-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed text-accent-foreground">{message.content}</p>
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
                <Smile className="w-5 h-5 text-emerald-700" />
              </div>
              <Card className="p-4 bg-white border border-emerald-100 shadow-lg">
                <span className="text-sm text-slate-600">Typing...</span>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="backdrop-blur-md border-t border-emerald-100 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${id}...`}
            disabled={isLoading}
            className="pr-4 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-whit rounded-xl py-3 px-4 shadow-sm"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
