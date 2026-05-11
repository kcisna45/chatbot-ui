import { LLM } from "@/types"

const OPENAI_PLATORM_LINK = "https://platform.openai.com/docs/overview"

// OpenAI Models (UPDATED 2026) -----------------------------

const GPT4o: LLM = {
  modelId: "gpt-4o",
  modelName: "SourceField Omni (GPT-4o)",
  provider: "openai",
  hostedId: "gpt-4o",
  platformLink: "https://platform.openai.com/docs/models/gpt-4o",
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5,
    outputCost: 15
  }
}

// GPT-4 Turbo
const GPT4Turbo: LLM = {
  modelId: "gpt-4-turbo-preview",
  modelName: "GPT-4 Turbo",
  provider: "openai",
  hostedId: "gpt-4-turbo-preview",
  platformLink: "https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo",
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 10,
    outputCost: 30
  }
}

// GPT-4 Vision (Redirected to Omni to fix 404)
const GPT4Vision: LLM = {
  modelId: "gpt-4o",
  modelName: "SourceField Vision (Omni)",
  provider: "openai",
  hostedId: "gpt-4o",
  platformLink: "https://platform.openai.com/docs/models/gpt-4o",
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5,
    outputCost: 15
  }
}

// GPT-4
const GPT4: LLM = {
  modelId: "gpt-4",
  modelName: "GPT-4",
  provider: "openai",
  hostedId: "gpt-4",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 30,
    outputCost: 60
  }
}

// GPT-3.5 Turbo
const GPT3_5Turbo: LLM = {
  modelId: "gpt-3.5-turbo",
  modelName: "GPT-3.5 Turbo",
  provider: "openai",
  hostedId: "gpt-3.5-turbo",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.5,
    outputCost: 1.5
  }
}

export const OPENAI_LLM_LIST: LLM[] = [
  GPT4o,
  GPT4Turbo,
  GPT4Vision,
  GPT4,
  GPT3_5Turbo
]
