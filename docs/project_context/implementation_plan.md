# 實作計畫 - LegalLetter AI

## 目標描述
為台灣市場建立一個 Web 應用程式「LegalLetter AI」(存證信函產生器)，協助使用者產生符合中華郵政標準的法律存證信函。系統將使用 AI 將使用者輸入的白話文改寫為專業的法律用語。

## 需要使用者審閱
> [!IMPORTANT]
> **PDF 生成與字型**: 必須嚴格遵守中華郵政的網格格式。**關鍵**: 為避免「豆腐字」並確保 Vibe Coding 順暢，我們將下載繁體中文字型 (如 Noto Sans TC 或 標楷體) 至專案 `public/fonts` 目錄供 `@react-pdf/renderer` 載入，或使用 Google Fonts CDN。
> **AI 整合**: 使用 Vercel SDK (`@ai-sdk/google`)。**關鍵**: 系統提示詞需設定為「台灣律師」，並嚴格遵守法律用語 (台端、本人、查、惟、茲...) 與結構。使用 **Gemini 1.5 Pro** 或 **Flash** 模型。
> **新增功能**: 前端需加入「語氣調整」(Regenerate/Refine) 按鈕與選單 (如：語氣強硬、語氣溫和)。

## 建議變更

### 技術堆疊
- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS, Shadcn/UI
- **狀態管理**: Zustand
- **AI**: Vercel AI SDK (Google Gemini)
- **PDF**:- Accept `additionalInstructions` and append to System Prompt or User Prompt.

#### [MODIFY] [letter-pdf.tsx](file:///Users/scott/.gemini/antigravity/playground/vast-halo/components/letter-pdf.tsx)
- Refactor layout to match official "郵局存證信函用紙".
- **Header**: Center title "郵局存證信函用紙".
- **Info Box**: Create specific bordered section for Sender/Receiver info (Top right).
- **Grid**: Ensure 10 rows per page, 20 columns. Label rows (一...十) and columns (1...20).
- **Footer**: Add standard disclaimer text, page counters, and stamp placeholders.

#### [NEW] [page.tsx](file:///Users/scott/.gemini/antigravity/playground/vast-halo/app/page.tsx)
- 主要登陸頁面 + 輸入表單容器。

#### [NEW] [components/input-form.tsx](file:///Users/scott/.gemini/antigravity/playground/vast-halo/components/input-form.tsx)
- 多步驟表單。
- **新增**: 在 AI 改寫步驟加入「語氣」選擇器 (Tone Selector) 與「重新產生」按鈕。

#### [NEW] [app/api/rewrite/route.ts](file:///Users/scott/.gemini/antigravity/playground/vast-halo/app/api/rewrite/route.ts)
- 處理 LLM 文字改寫。
- **關鍵**: 實作特定的 System Prompt (台灣律師角色、四段式結構：查/惟/茲/限)。
- 接收 `tone` 參數以調整語氣。

#### [NEW] [lib/store.ts](file:///Users/scott/.gemini/antigravity/playground/vast-halo/lib/store.ts)
- 用於管理信函狀態的 Zustand store。

## 驗證計畫
### 自動化測試
- 執行 `npm run dev` 並驗證無建置錯誤。
### 手動驗證
- 測試 PDF 生成，確保中文字元 (如：台端、債務) 顯示正常且網格對齊。
- 測試 AI 改寫，確認語氣變化 (強硬 vs 溫和) 及法律用語的正確性。
