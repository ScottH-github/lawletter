import { create } from 'zustand'

interface LetterState {
  step: number
  senderName: string
  senderAddress: string
  receiverName: string
  receiverAddress: string
  caseDetails: string
  generatedLetter: string
  tone: string
  isGenerating: boolean
  availableModels: string[]
  selectedModel: string
  apiKey: string
  additionalInstructions: string
  isRawContent: boolean
  
  setStep: (step: number) => void
  setSenderInfo: (name: string, address: string) => void
  setReceiverInfo: (name: string, address: string) => void
  setCaseDetails: (details: string) => void
  setGeneratedLetter: (letter: string) => void
  setTone: (tone: string) => void
  setIsGenerating: (isGenerating: boolean) => void
  setAvailableModels: (models: string[]) => void
  setSelectedModel: (model: string) => void
  setApiKey: (key: string) => void
  setAdditionalInstructions: (instructions: string) => void
  setIsRawContent: (isRaw: boolean) => void
}

export const useLetterStore = create<LetterState>((set) => ({
  step: 1,
  senderName: '',
  senderAddress: '',
  receiverName: '',
  receiverAddress: '',
  caseDetails: '',
  generatedLetter: '',
  tone: 'professional', // professional, bold, mild
  isGenerating: false,
  availableModels: [],
  selectedModel: 'models/gemini-2.5-pro', // Default
  apiKey: '',
  additionalInstructions: '',
  isRawContent: false,

  setStep: (step) => set({ step }),
  setSenderInfo: (name, address) => set({ senderName: name, senderAddress: address }),
  setReceiverInfo: (name, address) => set({ receiverName: name, receiverAddress: address }),
  setCaseDetails: (details) => set({ caseDetails: details }),
  setGeneratedLetter: (letter) => set({ generatedLetter: letter }),
  setTone: (tone) => set({ tone }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setAvailableModels: (models) => set({ availableModels: models }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setApiKey: (key) => set({ apiKey: key }),
  setAdditionalInstructions: (instructions) => set({ additionalInstructions: instructions }),
  setIsRawContent: (isRaw) => set({ isRawContent: isRaw }),
}))
