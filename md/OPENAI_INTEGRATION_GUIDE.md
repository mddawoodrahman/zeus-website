# OpenAI API Integration Guide

## Overview

This guide provides comprehensive documentation for the OpenAI API integration in the Zeus Editor. The integration enables powerful AI-driven text enhancement, analysis, and writing assistance features.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [API Key Management](#api-key-management)
5. [Using the Editor](#using-the-editor)
6. [API Reference](#api-reference)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

---

## Features

### ✨ AI-Powered Text Enhancement

The editor includes the following AI enhancement capabilities:

- **Grammar Check**: Automatically fix grammar, spelling, and punctuation errors
- **Clarity Improvement**: Make text easier to understand and more readable
- **Professional Tone**: Transform text into professional, business-appropriate language
- **Casual Tone**: Make text more friendly and conversational
- **Concise Writing**: Remove unnecessary words while preserving meaning
- **Text Expansion**: Elaborate on ideas with more detail and examples
- **Creative Enhancement**: Make text more engaging and creative

### 🔍 Intelligent Analysis

- Real-time text analysis with detailed suggestions
- Categorized feedback (grammar, style, tone, clarity)
- Severity levels (error, warning, info)
- One-click suggestion application
- Before/after comparison for each suggestion

### 🔐 Secure API Key Management

- Local storage of API keys (never sent to our servers)
- API key validation before use
- Visual feedback on API key status
- Easy setup and removal

---

## Architecture

### File Structure

```
src/
├── lib/
│   └── openai.ts              # OpenAI service layer
├── components/
│   └── ApiKeySetupDialog.tsx  # API key configuration UI
└── pages/
    └── Editor.tsx             # Main editor page with AI features
```

### Key Components

#### 1. OpenAI Service (`src/lib/openai.ts`)

The service layer provides a clean interface to the OpenAI API:

```typescript
// Core Functions
- getStoredAPIKey(): string | null
- setOpenAIKey(apiKey: string): void
- clearOpenAIKey(): void
- hasAPIKey(): boolean
- testAPIKey(): Promise<boolean>

// AI Features
- analyzeText(text: string): Promise<Suggestion[]>
- enhanceText(text: string, options: EnhanceOptions): Promise<EnhanceResult>
- streamCompletion(prompt: string, onChunk: StreamCallback): Promise<void>
- completeText(prompt: string): Promise<string>
```

#### 2. API Key Setup Dialog (`src/components/ApiKeySetupDialog.tsx`)

A secure, user-friendly dialog for API key configuration with:

- Masked input field
- Real-time validation
- Clear setup instructions
- Direct link to OpenAI platform
- Visual success/error feedback

#### 3. Enhanced Editor (`src/pages/Editor.tsx`)

The main editor interface featuring:

- Text input area
- Enhancement dropdown menu
- Real-time suggestions panel
- Document management
- Auto-save functionality

---

## Setup Instructions

### Prerequisites

1. Node.js (v18 or higher)
2. OpenAI API account
3. Valid OpenAI API key

### Installation

The OpenAI package is already installed in this project:

```json
"dependencies": {
  "openai": "^6.8.1"
}
```

If you need to install it in a new project:

```bash
npm install openai
```

### Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the generated key (you won't be able to see it again)
6. Store it securely

---

## API Key Management

### Setting Up Your API Key

1. Open the Zeus Editor
2. Click the **"API Key"** button in the toolbar
3. Paste your OpenAI API key
4. Click **"Save & Test"**
5. Wait for validation confirmation

### API Key Storage

- Keys are stored in browser localStorage
- Storage key: `zeus_openai_api_key`
- Keys are **never** transmitted to our servers
- Keys are only used for direct communication with OpenAI

### Removing Your API Key

1. Click the **"API Key"** button
2. Click **"Remove Key"**
3. Confirm the action

---

## Using the Editor

### Basic Workflow

1. **Create or Open Document**
   - Navigate to `/editor`
   - Start typing or load an existing document

2. **Analyze Text**
   - Write your text
   - Click **"Analyze"** button
   - Review suggestions in the right panel

3. **Enhance Text**
   - Click **"Enhance Text"** dropdown
   - Select enhancement type:
     - Fix Grammar
     - Improve Clarity
     - Make Professional
     - Make Casual
     - Make Concise
     - Expand Text
     - Make Creative
   - Wait for AI processing
   - Review the enhanced text

4. **Apply Suggestions**
   - Review suggestions in the panel
   - Click **"Apply"** to accept
   - Click **"Dismiss"** to ignore

### Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S`: Save document
- `Ctrl+C` / `Cmd+C`: Copy text
- `Ctrl+V` / `Cmd+V`: Paste text

---

## API Reference

### OpenAI Service API

#### `analyzeText(text: string): Promise<Suggestion[]>`

Analyzes text and returns detailed suggestions.

**Parameters:**

- `text` (string): The text to analyze

**Returns:**

- Array of `Suggestion` objects

**Example:**

```typescript
const suggestions = await analyzeText("Your text here");
console.log(suggestions);
```

**Suggestion Object:**

```typescript
interface Suggestion {
  type: "grammar" | "style" | "tone" | "clarity";
  severity: "error" | "warning" | "info";
  message: string;
  original?: string;
  suggestion?: string;
  position?: number;
}
```

---

#### `enhanceText(text: string, options: EnhanceOptions): Promise<EnhanceResult>`

Enhances text based on specified options.

**Parameters:**

- `text` (string): The text to enhance
- `options` (EnhanceOptions): Enhancement configuration

**EnhanceOptions:**

```typescript
interface EnhanceOptions {
  type: EnhancementType;
  preserveFormatting?: boolean;
  customInstructions?: string;
}

type EnhancementType =
  | "grammar"
  | "clarity"
  | "professional"
  | "casual"
  | "concise"
  | "expand"
  | "creative";
```

**Returns:**

```typescript
interface EnhanceResult {
  original: string;
  enhanced: string;
  suggestions: Suggestion[];
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

**Example:**

```typescript
const result = await enhanceText("Your text here", {
  type: "professional",
  preserveFormatting: true,
});

console.log(result.enhanced);
console.log(`Used ${result.usage.totalTokens} tokens`);
```

---

#### `streamCompletion(prompt: string, onChunk: StreamCallback, systemPrompt?: string): Promise<void>`

Streams text completion in real-time.

**Parameters:**

- `prompt` (string): The user prompt
- `onChunk` (StreamCallback): Callback for each chunk
- `systemPrompt` (string, optional): System instructions

**StreamCallback:**

```typescript
type StreamCallback = (chunk: string, done: boolean) => void;
```

**Example:**

```typescript
await streamCompletion(
  "Write a professional email about...",
  (chunk, done) => {
    if (done) {
      console.log("Streaming complete");
    } else {
      process.stdout.write(chunk);
    }
  },
  "You are a professional email writer",
);
```

---

#### `completeText(prompt: string, systemPrompt?: string): Promise<string>`

Generates text completion (non-streaming).

**Parameters:**

- `prompt` (string): The user prompt
- `systemPrompt` (string, optional): System instructions

**Returns:**

- Completed text as string

**Example:**

```typescript
const completion = await completeText(
  "Continue this story: Once upon a time...",
);
console.log(completion);
```

---

#### `testAPIKey(): Promise<boolean>`

Tests if the stored API key is valid.

**Returns:**

- `true` if valid, `false` otherwise

**Example:**

```typescript
const isValid = await testAPIKey();
if (!isValid) {
  console.error("Invalid API key");
}
```

---

## Error Handling

### Common Errors

#### 1. Invalid API Key (401)

```
Error: Invalid API key. Please check your OpenAI API key in settings.
```

**Solution:**

- Verify your API key is correct
- Ensure it starts with `sk-`
- Check if the key has been revoked
- Generate a new key if necessary

#### 2. Rate Limit Exceeded (429)

```
Error: Rate limit exceeded. Please try again in a moment.
```

**Solution:**

- Wait a few seconds and retry
- Check your OpenAI usage dashboard
- Consider upgrading your plan

#### 3. Service Unavailable (500/502/503)

```
Error: OpenAI service temporarily unavailable. Please try again later.
```

**Solution:**

- Wait and retry
- Check OpenAI status page
- Try again in a few minutes

#### 4. Missing API Key

```
Error: OpenAI API key not set. Please configure your API key in settings.
```

**Solution:**

- Click "API Key" button
- Enter and save your API key

### Error Handling in Code

All OpenAI functions include comprehensive error handling:

```typescript
try {
  const result = await enhanceText(text, { type: "grammar" });
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    // User-friendly error message
    toast.error(error.message);

    // Check if API key issue
    if (error.message.includes("API key")) {
      // Show API key dialog
      setShowApiDialog(true);
    }
  }
}
```

---

## Security Considerations

### API Key Security

✅ **What We Do:**

- Store keys in browser localStorage only
- Never transmit keys to our servers
- Keys are only used for direct OpenAI communication
- Provide clear privacy information

⚠️ **Best Practices:**

- Never share your API key
- Don't commit keys to version control
- Regularly rotate keys
- Monitor usage on OpenAI dashboard
- Set spending limits in OpenAI account

### Data Privacy

- User text is sent directly to OpenAI
- We don't store or process the text
- Follow OpenAI's data usage policies
- Consider data sensitivity before using AI features

### Browser Security

The OpenAI SDK requires `dangerouslyAllowBrowser: true` for client-side usage:

```typescript
const client = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});
```

**Why this is needed:**

- OpenAI SDK is designed for server-side use
- Browser usage requires explicit acknowledgment
- Your API key is exposed in browser memory

**Recommended for production:**

- Implement a backend proxy
- Use environment variables on server
- Never expose keys in client code

---

## Troubleshooting

### Issue: "API key not working"

**Symptoms:**

- Error 401 responses
- "Invalid API key" message

**Solutions:**

1. Verify key format (starts with `sk-`)
2. Check for extra spaces
3. Confirm key is active on OpenAI platform
4. Generate a new key
5. Clear browser cache and re-enter key

### Issue: "No suggestions appearing"

**Symptoms:**

- Analysis completes but no suggestions shown
- Empty suggestions panel

**Solutions:**

1. Check browser console for errors
2. Verify API key is set
3. Ensure text is not empty
4. Try analyzing again
5. Refresh the page

### Issue: "Enhancement taking too long"

**Symptoms:**

- Enhancement button stuck on "Enhancing..."
- No response after 30+ seconds

**Solutions:**

1. Check internet connection
2. Verify OpenAI service status
3. Try with shorter text
4. Refresh page and retry
5. Check API rate limits

### Issue: "Features not available"

**Symptoms:**

- Buttons disabled
- "API Key Required" warning

**Solutions:**

1. Click "API Key" in toolbar
2. Enter valid OpenAI API key
3. Complete validation
4. Reload editor

---

## Cost Considerations

### OpenAI Pricing

The editor uses the following models:

- **gpt-4o**: Main enhancement model
- **gpt-4o-mini**: Analysis and suggestions

**Approximate costs** (as of 2024):

- Analysis: ~$0.01 per request
- Enhancement: ~$0.02-0.05 per request

**Tips to minimize costs:**

1. Use "Analyze" before "Enhance"
2. Select specific enhancement types
3. Work with shorter text sections
4. Monitor usage in OpenAI dashboard
5. Set spending limits

---

## Advanced Usage

### Custom Enhancement

You can modify the enhancement prompts in `src/lib/openai.ts`:

```typescript
const prompts: Record<EnhancementType, string> = {
  grammar: "Your custom grammar prompt...",
  clarity: "Your custom clarity prompt...",
  // ...
};
```

### Adding New Enhancement Types

1. Update `EnhancementType` in `src/lib/openai.ts`
2. Add prompt in `prompts` object
3. Add menu item in `Editor.tsx`

Example:

```typescript
// In openai.ts
export type EnhancementType =
  | 'grammar'
  | 'myCustomType';  // Add new type

const prompts: Record<EnhancementType, string> = {
  grammar: '...',
  myCustomType: 'Your custom instructions...'
};

// In Editor.tsx
<DropdownMenuItem onClick={() => handleEnhance('myCustomType')}>
  <Icon className="h-4 w-4 mr-2" />
  My Custom Enhancement
</DropdownMenuItem>
```

---

## Testing

### Manual Testing Checklist

- [ ] API key setup and validation
- [ ] Text analysis with various content
- [ ] Each enhancement type
- [ ] Suggestion application
- [ ] Suggestion dismissal
- [ ] Error handling (invalid key)
- [ ] Error handling (rate limits)
- [ ] Document saving
- [ ] Auto-save functionality

### Testing API Key

```typescript
import { testAPIKey } from "@/lib/openai";

const isValid = await testAPIKey();
console.log("API Key Valid:", isValid);
```

---

## FAQ

**Q: Is my API key secure?**
A: Your key is stored locally in your browser and only used to communicate directly with OpenAI. We never see or store your key.

**Q: Can I use this without an OpenAI account?**
A: No, you need an OpenAI API key to use AI features. However, basic editor functionality works without one.

**Q: How much does OpenAI cost?**
A: OpenAI charges based on usage. Check their pricing page for current rates. Most casual users spend less than $5/month.

**Q: Can I use a different AI model?**
A: Yes, modify the `model` parameter in the API calls in `src/lib/openai.ts`.

**Q: Is my text data saved?**
A: Text is sent to OpenAI for processing but follows their data usage policies. We don't store your text on our servers.

**Q: Can I use this offline?**
A: No, AI features require an internet connection to communicate with OpenAI's API.

---

## Support

### Getting Help

1. Check this documentation
2. Review the troubleshooting section
3. Check OpenAI status page
4. Review OpenAI documentation
5. Open an issue on GitHub

### Useful Links

- [OpenAI Platform](https://platform.openai.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Status](https://status.openai.com/)
- [OpenAI Community Forum](https://community.openai.com/)

---

## Version History

### v1.0.0 (Current)

- Initial OpenAI integration
- API key management
- Text analysis
- 7 enhancement types
- Real-time suggestions
- Error handling
- Security features

---

## License

This project uses the OpenAI API, which is subject to OpenAI's terms of service and usage policies.

---

## Contributing

Contributions are welcome! Areas for improvement:

- Additional enhancement types
- Batch processing
- Custom prompts UI
- Usage analytics
- Cost tracking
- Multi-language support
- Accessibility improvements

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Author:** Zeus Development Team
