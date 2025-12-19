# LegalLetter AI - 法律存證信函產生器

專為台灣市場設計，結合 **AI 法律用語改寫** 與 **標準中華郵政 PDF 格式** 的現代化 Web 應用程式。

## 專案功能 (Features)

1.  **AI 法律改寫引擎**:
    *   使用 Google **Gemini 2.5 Flash** 模型 (Default)。
    *   扮演具 20 年經驗的「台灣律師」角色，將口語輸入改寫為專業法律用語 (如：台端、本人、查、惟、茲、限)。
    *   支援語氣調整 (專業、強硬、溫和)。

2.  **標準中華郵政 PDF 生成**:
    *   **嚴格網格排版**: 每頁 10 行 x 20 字 (10x20 Grid)。
    *   **正確格式**: 精確的 A4 邊距、頁首/資訊區塊設計，以及標準頁尾 (含頁數、附件、騎縫章區)。
    *   **字型支援**: 內建 **BiauKai (標楷體)**，確保輸出符合公文標準。

3.  **無資料庫架構 (Privacy-First & Stateless)**:
    *   專案設計為 **完全前端運作 (Client-Side State)**。
    *   使用 `Zustand` 進行暫存狀態管理。
    *   使用者輸入的資料僅存在於瀏覽器記憶體中，刷新即消失，不儲存任何個人隱私資料於伺服器。

## 技術堆疊 (Tech Stack)

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **UI System**: [Shadcn/UI](https://ui.shadcn.com/) + Tailwind CSS
*   **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (`@ai-sdk/google`)
*   **PDF Generation**: `@react-pdf/renderer`
*   **State Management**: `zustand`

## 快速開始 (Getting Started)

### 1. 安裝相依套件

```bash
npm install
```

### 2. 環境變數設定

本專案支援由使用者在前端輸入 API Key，或是由伺服器端預設 Key。
若要設定伺服器端 Key，請建立 `.env.local`：

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

瀏覽器打開 [http://localhost:3000](http://localhost:3000) 即可使用。

## 部署 (Deployment)

本專案推薦部署至 **Vercel** (Free Tier)。

1.  將程式碼 Push 至 GitHub。
2.  在 Vercel Dashboard 匯入專案。
3.  (選用) 設定環境變數 `GOOGLE_GENERATIVE_AI_API_KEY`。
4.  部署完成。

> 詳情請參考專案內的 `docs/vercel_deploy_guide.md` (若有)。

## 授權 (License)

MIT License
