'use client'

import { useLetterStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, ArrowRight, ArrowLeft, Wand2, Server, Key } from 'lucide-react'
import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

const PdfDownloadButton = dynamic(() => import('./pdf-download-button'), { ssr: false })


export function InputForm() {
    const { 
        step, setStep, 
        senderName, setSenderInfo, senderAddress,
        receiverName, setReceiverInfo, receiverAddress,
        caseDetails, setCaseDetails,
        generatedLetter, setGeneratedLetter,
        tone, setTone,
        isGenerating, setIsGenerating,
        availableModels, setAvailableModels,
        selectedModel, setSelectedModel,
        apiKey, setApiKey,
        additionalInstructions, setAdditionalInstructions,
        isRawContent, setIsRawContent
    } = useLetterStore()
    
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // No auto-detect needed
    }, [])
    
    // ...

    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)
        
        // Raw Mode Bypass
        if (isRawContent) {
            // Simulate brief delay for UX
            setIsGenerating(true)
            await new Promise(resolve => setTimeout(resolve, 800))
            setGeneratedLetter(caseDetails)
            setIsGenerating(false)
            setStep(3)
            return
        }

        try {
            const response = await fetch('/api/rewrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderName,
                    receiverName,
                    caseDetails,
                    tone,
                    modelName: selectedModel,
                    apiKey,
                    additionalInstructions
                })
            })
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate letter')
            }

            if (data.text) {
                setGeneratedLetter(data.text)
                if (step === 2) setStep(3)
            }
        } catch (error: any) {
            console.error("Error generating letter:", error)
            setError(error.message || "發生未知錯誤，請稍後再試。")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">LegalLetter AI 存證信函產生器</h1>
                <p className="text-slate-500 mt-2">專業、快速、符合中華郵政格式</p>
            </div>
            
            {/* Steps Indicator */}
            <div className="flex justify-center mb-8 gap-4">
               {[1, 2, 3].map((s) => (
                   <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'}`}>
                           {s}
                       </div>
                       <span className="hidden sm:inline">{s === 1 ? '基本資料' : s === 2 ? '案情描述' : '生成結果'}</span>
                   </div>
               ))}
            </div>

            <Card className="border-slate-200 shadow-lg bg-white/95 backdrop-blur">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "第一步：填寫雙方資訊"}
                        {step === 2 && "第二步：描述案情經過"}
                        {step === 3 && "第三步：確認與修飾信函"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "請準確填寫寄件人與收件人資訊，以確保法律效力。"}
                        {step === 2 && "請用白話文描述發生了什麼事，AI 律師將為您改寫。"}
                        {step === 3 && "請檢查生成的內容，您可以手動修改或調整語氣重新產生。"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800">寄件人 (您)</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="senderName">姓名 / 公司名稱</Label>
                                    <Input 
                                        id="senderName" 
                                        placeholder="例如：王小明" 
                                        value={senderName}
                                        onChange={(e) => setSenderInfo(e.target.value, senderAddress)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="senderAddress">地址</Label>
                                    <Input 
                                        id="senderAddress" 
                                        placeholder="例如：台北市信義區..." 
                                        value={senderAddress}
                                        onChange={(e) => setSenderInfo(senderName, e.target.value)}
                                    />
                                </div>
                             </div>
                             
                             <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800">收件人 (對方)</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="receiverName">姓名 / 公司名稱</Label>
                                    <Input 
                                        id="receiverName" 
                                        placeholder="例如：陳大文" 
                                        value={receiverName}
                                        onChange={(e) => setReceiverInfo(e.target.value, receiverAddress)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="receiverAddress">地址</Label>
                                    <Input 
                                        id="receiverAddress" 
                                        placeholder="例如：新北市板橋區..." 
                                        value={receiverAddress}
                                        onChange={(e) => setReceiverInfo(receiverName, e.target.value)}
                                    />
                                </div>
                             </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="caseDetails">案情描述 (白話文即可)</Label>
                                <Textarea 
                                    id="caseDetails" 
                                    placeholder="例如：我是房東，房客陳大文已經三個月沒繳房租了，一共欠我四萬五。我希望他七天內付清，不然我就要解約。" 
                                    className="min-h-[200px] text-base"
                                    value={caseDetails}
                                    onChange={(e) => setCaseDetails(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                                <Wand2 className="w-5 h-5 text-indigo-500" />
                                <span>AI 將自動轉換「我看你不爽」為「查台端...」，請放心填寫真實情況。</span>
                            </div>

                            
                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-base font-semibold">進階選項</Label>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="additionalInstructions">另外說明 (給 AI 的額外指示)</Label>
                                    <Textarea 
                                        id="additionalInstructions" 
                                        placeholder="例如：請強調違約金部分、語氣請再委婉一點..." 
                                        value={additionalInstructions}
                                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="isRawContent" 
                                        checked={isRawContent}
                                        onCheckedChange={(checked) => setIsRawContent(checked as boolean)}
                                    />
                                    <Label 
                                        htmlFor="isRawContent" 
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        直接使用原文 (不進行 AI 改寫，僅套用 PDF 格式)
                                    </Label>
                                </div>

                                {!isRawContent && (
                                    <ModelSelectionPanel 
                                        apiKey={apiKey}
                                        setApiKey={setApiKey}
                                        selectedModel={selectedModel}
                                        setSelectedModel={setSelectedModel}
                                        availableModels={availableModels}
                                    />
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 shrink-0">!</div>
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
                                <div className="space-y-1 w-full sm:w-auto">
                                    <Label>調整語氣</Label>
                                    <Select value={tone} onValueChange={(v) => setTone(v)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="選擇語氣" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">專業客觀 (Professional)</SelectItem>
                                            <SelectItem value="aggressive">語氣強硬 (Strong)</SelectItem>
                                            <SelectItem value="soft">語氣溫和 (Soft)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleGenerate} disabled={isGenerating} variant="outline" className="gap-2">
                                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    重新生成
                                </Button>
                            </div>

                            {/* Model Selection (Reused) */}
                            <ModelSelectionPanel 
                                apiKey={apiKey}
                                setApiKey={setApiKey}
                                selectedModel={selectedModel}
                                setSelectedModel={setSelectedModel}
                                availableModels={availableModels}
                            />

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 shrink-0">!</div>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="generatedLetter">信函內容</Label>
                                <Textarea 
                                    id="generatedLetter" 
                                    className="min-h-[300px] font-mono text-base leading-relaxed"
                                    value={generatedLetter}
                                    onChange={(e) => setGeneratedLetter(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => setStep(step - 1)} 
                        disabled={step === 1 || isGenerating}
                        className={step === 1 ? 'invisible' : ''}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> 上一步
                    </Button>
                    
                    {step < 3 ? (
                        <Button 
                            onClick={step === 2 ? handleGenerate : () => setStep(step + 1)}
                            disabled={isGenerating}
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                        >
                            {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {step === 2 ? 'AI 生成信函' : '下一步'}
                            {!isGenerating && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <PdfDownloadButton 
                                senderName={senderName}
                                senderAddress={senderAddress}
                                receiverName={receiverName}
                                receiverAddress={receiverAddress}
                                content={generatedLetter}
                            />
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

function ModelSelectionPanel({ apiKey, setApiKey, selectedModel, setSelectedModel, availableModels }: any) {
    return (
        <div className="space-y-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <h4 className="text-sm font-semibold text-slate-700">AI 模型設定</h4>
            
            {/* Model Selection */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 min-w-[100px]">
                    <Server className="w-4 h-4" />
                    <span>AI 模型:</span>
                </div>
                <div className="flex-1 w-full flex items-center gap-2">
                        <Select value={selectedModel.replace('models/', '')} onValueChange={(v) => setSelectedModel(`models/${v}`)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="選擇模型" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gemini-2.5-flash">Google Gemini 2.5 Flash</SelectItem>
                            <SelectItem value="gemini-1.5-pro">Google Gemini 1.5 Pro</SelectItem>
                            <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                            <SelectItem value="gpt-4o-mini">OpenAI GPT-4o Mini</SelectItem>
                            <SelectItem value="grok-beta">xAI Grok (Beta)</SelectItem>
                            <SelectItem value="deepseek-chat">DeepSeek V3</SelectItem>
                            <SelectItem value="qwen-max">Alibaba Qwen Max</SelectItem>
                            <SelectItem value="qwen-plus">Alibaba Qwen Plus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* API Key Input */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 min-w-[100px]">
                    <Key className="w-4 h-4" />
                    <span>API Key:</span>
                </div>
                <div className="flex-1 w-full">
                    <Input 
                        type="password" 
                        placeholder={
                            selectedModel.includes('gpt') ? "請輸入 OpenAI API Key" :
                            selectedModel.includes('grok') ? "請輸入 xAI API Key" :
                            selectedModel.includes('deepseek') ? "請輸入 DeepSeek API Key" :
                            selectedModel.includes('qwen') ? "請輸入 Alibaba DashScope API Key" :
                            "請輸入 Google AI Studio API Key (支援免費額度)"
                        }
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-white"
                    />
                    <p className="text-xs text-slate-500 mt-1">選用不同模型需輸入對應廠商的 API Key (留空則嘗試使用伺服器預設值)。</p>
                </div>
            </div>
        </div>
    )
}
