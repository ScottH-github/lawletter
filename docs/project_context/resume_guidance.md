# 跨機器開發接續 Prompt (Resume Development Prompt)

這份文件包含一段 Prompt，當您換到另一台電腦並開啟新的 Agent (如 Antigravity 或其他支援 Agentic 模式的 AI) 時，可以直接貼給它。這能確保它了解專案狀況並無縫接軌。

---

### Copy below block (複製下方區塊貼給 Agent):

```markdown
I want to continue developing the "LegalLetter AI" project.
Please follow these steps to initialize the environment:

1.  **Clone the Repository (下載程式碼 repository)**:
    The project is located at: `https://github.com/ScottH-github/lawletter.git`
    Please clone it into the current workspace.

2.  **Restore Context (還原開發脈絡)**:
    Read the following files located in `docs/project_context/` within the cloned repository to understand the current progress and requirements (請讀取以下文件以了解進度):
    -   `docs/project_context/task.md` (Current task list and status / 當前任務列表與狀態)
    -   `docs/project_context/implementation_plan.md` (Technical specifications and plan / 技術規格與實作計畫)
    -   `docs/project_context/walkthrough.md` (Verification records / 驗證紀錄)

3.  **Install Dependencies (安裝相依套件)**:
    Run `npm install` to set up the environment.

4.  **Confirm Status (確認狀態)**:
    After reading the files, please summarize the current project status and tell me what the next pending task is (based on task.md).

My goal is to continue working on this project seamlessly.
```
