'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Server, Key, Send, CheckCircle2, XCircle } from 'lucide-react'

export default function TestModelsPage() {
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash')
    const [apiKey, setApiKey] = useState('')
    const [message, setMessage] = useState('Hello! Can you confirm you are working?')
    const [response, setResponse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleTest = async () => {
        setIsLoading(true)
        setResponse(null)
        try {
            const res = await fetch('/api/test-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modelName: selectedModel,
                    apiKey,
                    message
                })
            })
            const data = await res.json()
            setResponse(data)
        } catch (error: any) {
            setResponse({ success: false, error: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Model Diagnostic</h1>
                <p className="text-slate-500">測試與各個 AI 平台 API 的連線狀態</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Connection Settings</CardTitle>
                    <CardDescription>選擇模型並輸入 API Key 進行測試</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>AI Model</Label>
                        <Select value={selectedModel.replace('models/', '')} onValueChange={(v) => setSelectedModel(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Model" />
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

                    <div className="space-y-2">
                        <Label>API Key (Optional if Env Var set)</Label>
                        <Input 
                            type="password"
                            placeholder="Enter API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Test Message</Label>
                        <Textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter a message to send to the AI..."
                        />
                    </div>

                    <Button onClick={handleTest} disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Test Request
                    </Button>

                    {response && (
                        <div className={`mt-6 p-4 rounded-lg border ${response.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center gap-2 mb-2 font-semibold">
                                {response.success ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className={response.success ? 'text-green-800' : 'text-red-800'}>
                                    {response.success ? 'Connection Successful' : 'Connection Failed'}
                                </span>
                            </div>
                            
                            {response.success ? (
                                <div className="text-sm text-slate-700 mt-2">
                                    <p className="font-semibold text-xs text-slate-500 uppercase mb-1">AI Response:</p>
                                    <p>{response.message}</p>
                                </div>
                            ) : (
                                <div className="text-sm text-red-700 mt-2 overflow-auto font-mono text-xs">
                                    <p className="font-bold">Error:</p>
                                    <p>{response.error}</p>
                                    {response.details && (
                                        <pre className="mt-2 p-2 bg-red-100 rounded whitespace-pre-wrap">
                                            {response.details}
                                        </pre>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
