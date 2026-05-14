/// @ts-nocheck
import { LivingEquationEngine } from "@/lib/LivingEquationEngine"
import { trackResonance } from "@/lib/ResonancePatternTracker"
import { analyzeResonance } from "@/lib/ResonanceEngine"
import { MemoryCore } from "@/lib/MemoryCore"
import { createChatFiles } from "@/db/chat-files"
import { createChat } from "@/db/chats"
import { createMessageFileItems } from "@/db/message-file-items"
import { createMessages, updateMessage } from "@/db/messages"
import { uploadMessageImage } from "@/db/storage/message-images"
import {
  buildFinalMessages,
  adaptMessagesForGoogleGemini
} from "@/lib/build-prompt"
import { consumeReadableStream } from "@/lib/consume-stream"
import { Tables } from "@/supabase/types"
import {
  ChatFile,
  ChatMessage,
  ChatPayload,
  ChatSettings,
  LLM,
  MessageImage
} from "@/types"
import React from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  profile: any | null,
  selectedWorkspace: any | null,
  messageContent: string
) => {
  if (!chatSettings) throw new Error("Chat settings not found")
  if (!modelData) throw new Error("Model not found")
  if (!profile) throw new Error("Profile not found")
  if (!selectedWorkspace) throw new Error("Workspace not found")
  if (!messageContent) throw new Error("Message content not found")
}

export const handleRetrieval = async (
  userInput: string,
  newMessageFiles: ChatFile[],
  chatFiles: ChatFile[],
  embeddingsProvider: "openai" | "local",
  sourceCount: number
) => {
  const response = await fetch("/api/retrieval/retrieve", {
    method: "POST",
    body: JSON.stringify({
      userInput,
      fileIds: [...newMessageFiles, ...chatFiles].map(file => file.id),
      embeddingsProvider,
      sourceCount
    })
  })

  if (!response.ok) console.error("Error retrieving:", response)

  const { results } = (await response.json()) as { results: any[] }
  return results
}

export const createTempMessages = (
  messageContent: string,
  chatMessages: ChatMessage[],
  chatSettings: ChatSettings,
  b64Images: string[],
  isRegeneration: boolean,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  selectedAssistant: any | null
) => {
  let tempUserChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      assistant_id: selectedAssistant?.id || null,
      content: messageContent,
      created_at: "",
      id: uuidv4(),
      image_paths: b64Images,
      model: chatSettings.model,
      role: "user",
      sequence_number: chatMessages.length,
      updated_at: "",
      user_id: ""
    },
    fileItems: []
  }

  let tempAssistantChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      assistant_id: selectedAssistant?.id || null,
      content: "",
      created_at: "",
      id: uuidv4(),
      image_paths: [],
      model: chatSettings.model,
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      updated_at: "",
      user_id: ""
    },
    fileItems: []
  }

  let newMessages = isRegeneration
    ? ((chatMessages[chatMessages.length - 1].message.content = ""),
      [...chatMessages])
    : [...chatMessages, tempUserChatMessage, tempAssistantChatMessage]

  setChatMessages(newMessages)

  return { tempUserChatMessage, tempAssistantChatMessage }
}

export const handleLocalChat = async (
  payload: ChatPayload,
  profile: any,
  chatSettings: ChatSettings,
  tempAssistantMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  const formattedMessages = await buildFinalMessages(payload, profile, [])

  // =====================================================
  // SOURCEFIELD PROCESSING LAYER
  // =====================================================

  const memoryCore = new MemoryCore()

  const equationEngine = new LivingEquationEngine(memoryCore)

  const latestMessage = payload.chatMessages[payload.chatMessages.length - 1]

  const equationResults = equationEngine.evaluateMessage(
    latestMessage.message.content
  )

  const resonanceResults = analyzeResonance({
    signal: latestMessage.message.content
  })

  await trackResonance(profile.user_id, latestMessage.message.content)

  // Inject resonance state into prompt
  formattedMessages.push({
    role: "system",
    content: `
SOURCEFIELD STATE:

Equation Matches:
${JSON.stringify(equationResults)}

Resonance:
${JSON.stringify(resonanceResults)}

Coherence Mode:
SourceFieldV11
`
  }) // AUDIT FIX: Accessing temperature directly from payload due to flattened interface

  const response = await fetchChatResponse(
    process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/chat",
    {
      model: chatSettings.model,
      messages: formattedMessages,
      options: {
        temperature: payload.temperature
      }
    },
    false,
    newAbortController,
    setIsGenerating,
    setChatMessages
  )

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantMessage,
    false,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages,
    setToolInUse
  )
}

export const handleHostedChat = async (
  payload: ChatPayload,
  profile: any,
  modelData: LLM,
  tempAssistantChatMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  newMessageImages: MessageImage[],
  chatImages: MessageImage[],
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  const provider =
    modelData.provider === "openai" && profile.use_azure_openai
      ? "azure"
      : modelData.provider
  let draftMessages = await buildFinalMessages(payload, profile, chatImages)

  let formattedMessages =
    provider === "google"
      ? await adaptMessagesForGoogleGemini(payload, draftMessages)
      : draftMessages

  const apiEndpoint =
    provider === "custom" ? "/api/chat/custom" : `/api/chat/${provider}`

  // AUDIT FIX: requestBody updated to use flattened payload properties
  const requestBody = {
    chatSettings: {
      model: payload.model,
      prompt: payload.prompt,
      temperature: payload.temperature,
      contextLength: payload.contextCount,
      includeProfileContext: payload.includeProfileContext,
      includeRetrievedContext: payload.includeRetrievedContext,
      embeddingsProvider: payload.embeddingsProvider
    },
    messages: formattedMessages,
    customModelId: provider === "custom" ? modelData.hostedId : ""
  }

  const response = await fetchChatResponse(
    apiEndpoint,
    requestBody,
    true,
    newAbortController,
    setIsGenerating,
    setChatMessages
  )

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    true,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages,
    setToolInUse
  )
}

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal
  })

  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      toast.error(
        "Model not found. Make sure you have it downloaded via Ollama."
      )
    }
    const errorData = await response.json()
    toast.error(errorData.message)
    setIsGenerating(false)
    setChatMessages(prevMessages => prevMessages.slice(0, -2))
  }

  return response
}

export const processResponse = async (
  response: Response,
  lastChatMessage: ChatMessage,
  isHosted: boolean,
  controller: AbortController,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  let fullText = ""
  if (response.body) {
    await consumeReadableStream(
      response.body,
      chunk => {
        setFirstTokenReceived(true)
        setToolInUse("none")
        try {
          fullText += isHosted
            ? chunk
            : chunk
                .trimEnd()
                .split("\n")
                .reduce(
                  (acc, line) => acc + JSON.parse(line).message.content,
                  ""
                )
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }
        setChatMessages(prev =>
          prev.map(msg =>
            msg.message.id === lastChatMessage.message.id
              ? { ...msg, message: { ...msg.message, content: fullText } }
              : msg
          )
        )
      },
      controller.signal
    )
    return fullText
  } else {
    throw new Error("Response body is null")
  }
}

export const handleCreateChat = async (
  chatSettings: ChatSettings,
  profile: any,
  selectedWorkspace: any,
  messageContent: string,
  selectedAssistant: any,
  newMessageFiles: ChatFile[],
  setSelectedChat: React.Dispatch<React.SetStateAction<any | null>>,
  setChats: React.Dispatch<React.SetStateAction<any[]>>,
  setChatFiles: React.Dispatch<React.SetStateAction<ChatFile[]>>
) => {
  const createdChat = await createChat({
    user_id: profile.user_id,
    workspace_id: selectedWorkspace.id,
    assistant_id: selectedAssistant?.id || null,
    context_length: chatSettings.contextLength,
    include_profile_context: chatSettings.includeProfileContext,
    include_workspace_instructions: chatSettings.includeWorkspaceInstructions,
    model: chatSettings.model,
    name: messageContent.substring(0, 100),
    prompt: chatSettings.prompt,
    temperature: chatSettings.temperature,
    embeddings_provider: chatSettings.embeddingsProvider
  })

  setSelectedChat(createdChat)
  setChats(chats => [createdChat, ...chats])
  await createChatFiles(
    newMessageFiles.map(file => ({
      user_id: profile.user_id,
      chat_id: createdChat?.id,
      file_id: file.id
    }))
  )
  setChatFiles(prev => [...prev, ...newMessageFiles])
  return createdChat
}

export const handleCreateMessages = async (
  chatMessages: ChatMessage[],
  currentChat: any,
  profile: any,
  modelData: LLM,
  messageContent: string,
  generatedText: string,
  newMessageImages: MessageImage[],
  isRegeneration: boolean,
  retrievedFileItems: any[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setChatFileItems: React.Dispatch<React.SetStateAction<any[]>>,
  setChatImages: React.Dispatch<React.SetStateAction<MessageImage[]>>,
  selectedAssistant: any | null
) => {
  const finalUserMessage = {
    chat_id: currentChat.id,
    assistant_id: selectedAssistant?.id || null,
    user_id: profile.user_id,
    content: messageContent,
    model: modelData.modelId,
    role: "user",
    sequence_number: chatMessages.length,
    image_paths: []
  }
  const finalAssistantMessage = {
    chat_id: currentChat.id,
    assistant_id: selectedAssistant?.id || null,
    user_id: profile.user_id,
    content: generatedText,
    model: modelData.modelId,
    role: "assistant",
    sequence_number: chatMessages.length + 1,
    image_paths: []
  }

  if (isRegeneration) {
    const lastMsg = chatMessages[chatMessages.length - 1].message
    const updated = await updateMessage(lastMsg.id, {
      ...lastMsg,
      content: generatedText
    })
    chatMessages[chatMessages.length - 1].message = updated
    setChatMessages([...chatMessages])
  } else {
    const created = await createMessages([
      finalUserMessage,
      finalAssistantMessage
    ])
    const uploadPromises = newMessageImages
      .filter(obj => obj.file !== null)
      .map(obj => {
        let path = `${profile.user_id}/${currentChat.id}/${created?.[0]?.id}/${uuidv4()}`
        return uploadMessageImage(path, obj.file as File).catch(() => null)
      })
    const paths = (await Promise.all(uploadPromises)).filter(
      Boolean
    ) as string[]
    setChatImages(prev => [
      ...prev,
      ...newMessageImages.map((obj, i) => ({
        ...obj,
        messageId: created?.[0]?.id,
        path: paths[i]
      }))
    ])
    const updatedUserMsg = await updateMessage(created?.[0]?.id, {
      ...created?.[0],
      image_paths: paths
    })
    await createMessageFileItems(
      retrievedFileItems.map(item => ({
        user_id: profile.user_id,
        message_id: created?.[1]?.id,
        file_item_id: item.id
      }))
    )

    setChatFileItems(prev => [
      ...prev,
      ...retrievedFileItems.filter(item => !prev.some(p => p.id === item.id))
    ])
    setChatMessages([
      ...chatMessages,
      { message: updatedUserMsg, fileItems: [] },
      {
        message: created?.[1],
        fileItems: retrievedFileItems.map(item => item.id)
      }
    ])
  }
}
