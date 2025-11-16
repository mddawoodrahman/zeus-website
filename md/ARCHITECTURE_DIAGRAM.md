# OpenAI Integration - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Zeus Editor Application                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Editor Page    │      │  API Key Dialog  │      │  Header/Toolbar  │
│  (Editor.tsx)    │      │ (ApiKeySetup.tsx)│      │   (Header.tsx)   │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                           │
        │                           │
        │                           ▼
        │                  ┌──────────────────┐
        └─────────────────▶│  OpenAI Service  │
                           │  (openai.ts)     │
                           └──────────────────┘
                                    │
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ API Key Mgmt│ │Text Analysis│ │Text Enhance │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │  OpenAI API      │
                           │  (External)      │
                           └──────────────────┘
                                    │
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   GPT-4o    │ │ GPT-4o-mini │ │  Streaming  │
            │ Enhancement │ │  Analysis   │ │ Completion  │
            └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Component Flow

### 1. User Interaction Flow

```
User Opens Editor
       │
       ▼
   Has API Key? ──No──▶ Show "API Key Required" Message
       │                        │
      Yes                       │
       │                        ▼
       │                Click "Setup API Key"
       │                        │
       │                        ▼
       │                Open API Key Dialog
       │                        │
       │                        ▼
       │                Enter API Key
       │                        │
       │                        ▼
       │                Validate Key (testAPIKey)
       │                        │
       │                    ┌───┴───┐
       │                    │       │
       │                  Valid  Invalid
       │                    │       │
       │                    │       └──▶ Show Error
       │                    │
       │                    ▼
       │              Save to localStorage
       │                    │
       │◀───────────────────┘
       │
       ▼
User Writes Text
       │
       ├──▶ Click "Analyze" ──▶ analyzeText() ──▶ Show Suggestions
       │                                                  │
       │                                                  ▼
       │                                          Apply/Dismiss
       │
       └──▶ Click "Enhance" ──▶ enhanceText() ──▶ Update Text
                                                         │
                                                         ▼
                                                  Show New Suggestions
```

---

## Data Flow

### API Key Management

```
┌─────────────────┐
│ User Input      │
│ (API Key)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validation      │
│ - Check format  │
│ - Test with API │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ localStorage    │
│ Key: zeus_*     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OpenAI Client   │
│ Initialization  │
└─────────────────┘
```

### Text Enhancement Flow

```
┌─────────────────┐
│ User Text       │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Enhancement Request │
│ - type: grammar     │
│ - preserveFormat    │
│ - customInstr       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ OpenAI API Call     │
│ - model: gpt-4o     │
│ - messages: [...]   │
│ - temperature: 0.7  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ API Response        │
│ - enhanced text     │
│ - token usage       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Parallel Analysis   │
│ analyzeText()       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Return Result       │
│ - original          │
│ - enhanced          │
│ - suggestions       │
│ - usage stats       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Update UI           │
│ - Set text          │
│ - Show suggestions  │
│ - Display toast     │
└─────────────────────┘
```

---

## State Management

### Editor Component State

```typescript
┌─────────────────────────────────────┐
│        Editor Component State       │
├─────────────────────────────────────┤
│ currentDocument: DocType | null     │
│ title: string                       │
│ text: string                        │
│ analyzing: boolean                  │
│ enhancing: boolean                  │
│ saving: boolean                     │
│ loading: boolean                    │
│ session: WritingSession | null      │
│ suggestions: Suggestion[]           │
│ showApiDialog: boolean              │
│ hasKey: boolean                     │
└─────────────────────────────────────┘
```

### API Key Dialog State

```typescript
┌─────────────────────────────────────┐
│    API Key Dialog Component State   │
├─────────────────────────────────────┤
│ apiKey: string                      │
│ testing: boolean                    │
│ showKey: boolean                    │
│ error: string | null                │
│ success: boolean                    │
└─────────────────────────────────────┘
```

---

## API Integration Points

### OpenAI Service Methods

```
┌──────────────────────────────────────────────────────────┐
│                   OpenAI Service API                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Key Management:                                         │
│  ├─ getStoredAPIKey(): string | null                    │
│  ├─ setOpenAIKey(key: string): void                     │
│  ├─ clearOpenAIKey(): void                              │
│  ├─ hasAPIKey(): boolean                                │
│  └─ testAPIKey(): Promise<boolean>                      │
│                                                          │
│  Text Processing:                                        │
│  ├─ analyzeText(text): Promise<Suggestion[]>           │
│  ├─ enhanceText(text, options): Promise<EnhanceResult> │
│  ├─ streamCompletion(prompt, cb): Promise<void>        │
│  └─ completeText(prompt): Promise<string>              │
│                                                          │
│  Error Handling:                                         │
│  └─ handleOpenAIError(error): Error                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
API Call Initiated
       │
       ▼
   Try Block
       │
       ├──▶ Success ──▶ Return Result ──▶ Update UI
       │
       └──▶ Error
             │
             ▼
        Catch Block
             │
             ├──▶ APIError?
             │      │
             │      ├─ 401 ──▶ "Invalid API key"
             │      ├─ 429 ──▶ "Rate limit exceeded"
             │      └─ 5xx ──▶ "Service unavailable"
             │
             ├──▶ NetworkError? ──▶ "Connection failed"
             │
             └──▶ Unknown ──▶ "Unexpected error"
                   │
                   ▼
            Show User Message
                   │
                   ▼
            Log to Console
                   │
                   ▼
         Open API Dialog? (if key issue)
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Input Validation                              │
│  ├─ API key format check (sk- prefix)                  │
│  ├─ Text sanitization                                   │
│  └─ Type checking                                       │
│                                                          │
│  Layer 2: API Key Protection                            │
│  ├─ localStorage only                                   │
│  ├─ Never in URLs                                       │
│  ├─ Never in logs                                       │
│  └─ Masked in UI                                        │
│                                                          │
│  Layer 3: Communication Security                        │
│  ├─ HTTPS only                                          │
│  ├─ Direct to OpenAI                                    │
│  └─ No intermediate servers                             │
│                                                          │
│  Layer 4: Error Handling                                │
│  ├─ No sensitive data in errors                        │
│  ├─ User-friendly messages                              │
│  └─ Proper error boundaries                             │
│                                                          │
│  Layer 5: XSS Prevention                                │
│  ├─ React sanitization                                  │
│  ├─ No innerHTML                                        │
│  └─ Proper escaping                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Enhancement Pipeline

```
User Input Text
       │
       ▼
Select Enhancement Type
       │
       ├─ Grammar ──────┐
       ├─ Clarity ──────┤
       ├─ Professional ─┤
       ├─ Casual ───────┼──▶ Build System Prompt
       ├─ Concise ──────┤         │
       ├─ Expand ───────┤         ▼
       └─ Creative ─────┘    Create Client
                                  │
                                  ▼
                          Send to GPT-4o
                                  │
                                  ▼
                          Receive Response
                                  │
                                  ▼
                          Parallel Analysis
                                  │
                                  ▼
                          Combine Results
                                  │
                                  ▼
                          Return to User
                                  │
                                  ▼
                          Update Editor
                                  │
                                  ▼
                          Show Suggestions
```

---

## Suggestion Application Flow

```
User Reviews Suggestions
       │
       ▼
   Has Apply Option?
       │
    ├──No──▶ Dismiss Only
    │            │
   Yes           ▼
    │        Remove from List
    ▼
Click Apply
    │
    ▼
Find Original Text
    │
    ▼
Replace with Suggestion
    │
    ▼
Update Editor Text
    │
    ▼
Remove from Suggestions
    │
    ▼
Show Success Toast
```

---

## Storage Architecture

```
┌──────────────────────────────────────┐
│       Browser localStorage            │
├──────────────────────────────────────┤
│                                       │
│  zeus_openai_api_key: "sk-..."      │
│                                       │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│         OpenAI Client                 │
├──────────────────────────────────────┤
│  apiKey: getStoredAPIKey()           │
│  dangerouslyAllowBrowser: true       │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│         OpenAI API                    │
├──────────────────────────────────────┤
│  POST /v1/chat/completions           │
│  Authorization: Bearer sk-...        │
└──────────────────────────────────────┘
```

---

## Response Processing

```
OpenAI API Response
       │
       ▼
Parse JSON
       │
       ├──▶ Chat Completion
       │         │
       │         ▼
       │    Extract Content
       │         │
       │         ▼
       │    Extract Usage Stats
       │
       └──▶ Analysis Response
                 │
                 ▼
            Parse Suggestions
                 │
                 ▼
            Validate Format
                 │
                 ▼
            Return Array
```

---

## Component Communication

```
┌─────────────────┐          ┌─────────────────┐
│  Editor Page    │◀────────▶│ API Key Dialog  │
└────────┬────────┘          └─────────────────┘
         │                            │
         │                            │
         ├────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ OpenAI Service  │
└────────┬────────┘
         │
         ├──▶ localStorage (read/write)
         │
         ├──▶ OpenAI API (HTTP calls)
         │
         └──▶ Error Handler (process errors)
```

---

## Lifecycle Hooks

```
Editor Component Mount
       │
       ├──▶ Check API Key Status
       │
       ├──▶ Load Document (if ID)
       │
       └──▶ Start Writing Session
              │
              ▼
User Interaction
              │
              ├──▶ Text Change ──▶ Update State
              │
              ├──▶ Analyze ──▶ API Call ──▶ Update Suggestions
              │
              └──▶ Enhance ──▶ API Call ──▶ Update Text
                                              │
                                              ▼
                                      Auto-save (every 30s)
                                              │
                                              ▼
Component Unmount
       │
       └──▶ End Writing Session
              │
              ▼
         Save Final State
```

---

## Performance Optimization

```
┌─────────────────────────────────────────┐
│      Performance Strategies             │
├─────────────────────────────────────────┤
│                                          │
│  React Optimization:                    │
│  ├─ useMemo for expensive calcs         │
│  ├─ useCallback for functions           │
│  ├─ useRef for non-state values         │
│  └─ Proper dependency arrays            │
│                                          │
│  API Optimization:                      │
│  ├─ Efficient model selection           │
│  ├─ Proper prompt engineering           │
│  ├─ Request cancellation                │
│  └─ Error retry logic                   │
│                                          │
│  UI Optimization:                       │
│  ├─ Loading states                      │
│  ├─ Optimistic updates                  │
│  ├─ Debounced inputs                    │
│  └─ Virtual scrolling (suggestions)     │
│                                          │
└─────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                Development Environment                │
├──────────────────────────────────────────────────────┤
│  Vite Dev Server                                     │
│  ├─ Hot Module Replacement                           │
│  ├─ Fast Refresh                                     │
│  └─ Source Maps                                      │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                Production Build                       │
├──────────────────────────────────────────────────────┤
│  Vite Build                                          │
│  ├─ Code splitting                                   │
│  ├─ Tree shaking                                     │
│  ├─ Minification                                     │
│  └─ Asset optimization                               │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                Deployment Target                      │
├──────────────────────────────────────────────────────┤
│  Static Hosting (Vercel, Netlify, etc.)            │
│  ├─ CDN distribution                                 │
│  ├─ HTTPS enabled                                    │
│  └─ Environment variables                            │
└──────────────────────────────────────────────────────┘
```

---

## Legend

```
│  = Flow direction
▼  = Next step
├─ = Branch/Option
└─ = End of branch
◀─ = Return/Callback
──▶ = Process flow
```

---

**Document Version:** 1.0.0
**Last Updated:** November 2025
