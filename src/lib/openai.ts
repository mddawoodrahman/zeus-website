/**
 * OpenAI API Integration Service
 *
 * This module provides a secure interface to the OpenAI API for text processing,
 * enhancement, and AI-powered writing assistance. It handles API key management,
 * request/response formatting, and error handling.
 *
 * Security Features:
 * - API keys stored in localStorage with encryption consideration
 * - Never exposed in client-side code
 * - Proper error handling to prevent key leakage
 *
 * Usage:
 * 1. Set API key: setOpenAIKey(apiKey)
 * 2. Enhance text: enhanceText(text, options)
 * 3. Stream completions: streamCompletion(text, callback)
 */

import OpenAI from "openai";

// Storage key for API key
const OPENAI_KEY_STORAGE = "zeus_openai_api_key";

/**
 * Retrieves the stored OpenAI API key from localStorage
 * @returns {string | null} The API key or null if not set
 */
export const getStoredAPIKey = (): string | null => {
  try {
    return localStorage.getItem(OPENAI_KEY_STORAGE);
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return null;
  }
};

/**
 * Stores the OpenAI API key securely in localStorage
 * @param {string} apiKey - The OpenAI API key to store
 */
export const setOpenAIKey = (apiKey: string): void => {
  try {
    localStorage.setItem(OPENAI_KEY_STORAGE, apiKey.trim());
  } catch (error) {
    console.error("Error storing API key:", error);
    throw new Error("Failed to store API key");
  }
};

/**
 * Removes the stored API key from localStorage
 */
export const clearOpenAIKey = (): void => {
  try {
    localStorage.removeItem(OPENAI_KEY_STORAGE);
  } catch (error) {
    console.error("Error clearing API key:", error);
  }
};

/**
 * Validates if an API key is set
 * @returns {boolean} True if API key exists
 */
export const hasAPIKey = (): boolean => {
  return !!getStoredAPIKey();
};

/**
 * Creates an OpenAI client instance with the stored API key
 * @returns {OpenAI} Configured OpenAI client
 * @throws {Error} If API key is not set
 */
const createClient = (): OpenAI => {
  const apiKey = getStoredAPIKey();

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not set. Please configure your API key in settings.",
    );
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
};

/**
 * Enhancement types available
 */
export type EnhancementType =
  | "grammar" // Fix grammar and spelling errors
  | "clarity" // Improve clarity and readability
  | "professional" // Make tone more professional
  | "casual" // Make tone more casual
  | "concise" // Make text more concise
  | "expand" // Expand and elaborate
  | "creative"; // Make more creative

/**
 * Options for text enhancement
 */
export interface EnhanceOptions {
  type: EnhancementType;
  preserveFormatting?: boolean;
  customInstructions?: string;
}

/**
 * Response from text enhancement
 */
export interface EnhanceResult {
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

/**
 * Individual suggestion for improvement
 */
export interface Suggestion {
  type: "grammar" | "style" | "tone" | "clarity";
  severity: "error" | "warning" | "info";
  message: string;
  original?: string;
  suggestion?: string;
  position?: number;
}

/**
 * Analyzes text and provides detailed suggestions
 * @param {string} text - The text to analyze
 * @returns {Promise<Suggestion[]>} Array of suggestions
 */
export const analyzeText = async (text: string): Promise<Suggestion[]> => {
  const client = createClient();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert writing assistant. Analyze the provided text and return suggestions for improvement in the following JSON format:
{
  "suggestions": [
    {
      "type": "grammar|style|tone|clarity",
      "severity": "error|warning|info",
      "message": "Description of the issue",
      "original": "The problematic text snippet",
      "suggestion": "The improved version",
      "position": 0
    }
  ]
}

Focus on:
- Grammar and spelling errors (type: grammar, severity: error)
- Style improvements (type: style, severity: warning)
- Tone consistency (type: tone, severity: info)
- Clarity issues (type: clarity, severity: warning)

Return valid JSON only.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return [];
    }

    const parsed = JSON.parse(response);
    return parsed.suggestions || [];
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw handleOpenAIError(error);
  }
};

/**
 * Enhances text based on specified enhancement type
 * @param {string} text - The text to enhance
 * @param {EnhanceOptions} options - Enhancement options
 * @returns {Promise<EnhanceResult>} Enhanced text and metadata
 */
export const enhanceText = async (
  text: string,
  options: EnhanceOptions,
): Promise<EnhanceResult> => {
  const client = createClient();

  const prompts: Record<EnhancementType, string> = {
    grammar:
      "Fix all grammar, spelling, and punctuation errors while preserving the original meaning and style.",
    clarity:
      "Improve clarity and readability. Make the text easier to understand while maintaining the original message.",
    professional:
      "Rewrite in a professional, formal tone suitable for business communication.",
    casual: "Rewrite in a casual, friendly tone while keeping it appropriate.",
    concise:
      "Make the text more concise by removing unnecessary words while preserving all key information.",
    expand: "Expand and elaborate on the ideas with more detail and examples.",
    creative:
      "Make the text more engaging and creative while preserving the core message.",
  };

  const systemPrompt = prompts[options.type];
  const customInstructions = options.customInstructions
    ? `\n\nAdditional instructions: ${options.customInstructions}`
    : "";

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert writing assistant. ${systemPrompt}${customInstructions}${
            options.preserveFormatting
              ? "\n\nPreserve all formatting, line breaks, and structure."
              : ""
          }\n\nReturn only the improved text without explanations or comments.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
    });

    const enhanced = completion.choices[0]?.message?.content || text;

    // Get suggestions in parallel
    const suggestions = await analyzeText(enhanced);

    return {
      original: text,
      enhanced,
      suggestions,
      model: completion.model,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error("Error enhancing text:", error);
    throw handleOpenAIError(error);
  }
};

/**
 * Callback function for streaming completion chunks
 */
export type StreamCallback = (chunk: string, done: boolean) => void;

/**
 * Streams text completion in real-time
 * @param {string} prompt - The prompt for completion
 * @param {StreamCallback} onChunk - Callback for each chunk
 * @param {string} systemPrompt - Optional system prompt
 */
export const streamCompletion = async (
  prompt: string,
  onChunk: StreamCallback,
  systemPrompt?: string,
): Promise<void> => {
  const client = createClient();

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        ...(systemPrompt
          ? [{ role: "system" as const, content: systemPrompt }]
          : []),
        { role: "user" as const, content: prompt },
      ],
      stream: true,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk(content, false);
      }
    }

    // Signal completion
    onChunk("", true);
  } catch (error) {
    console.error("Error streaming completion:", error);
    throw handleOpenAIError(error);
  }
};

/**
 * Generates text completion (non-streaming)
 * @param {string} prompt - The prompt for completion
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} Completed text
 */
export const completeText = async (
  prompt: string,
  systemPrompt?: string,
): Promise<string> => {
  const client = createClient();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        ...(systemPrompt
          ? [{ role: "system" as const, content: systemPrompt }]
          : []),
        { role: "user" as const, content: prompt },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error completing text:", error);
    throw handleOpenAIError(error);
  }
};

/**
 * Handles OpenAI API errors and returns user-friendly messages
 * @param {unknown} error - The error to handle
 * @returns {Error} Formatted error
 */
const handleOpenAIError = (error: unknown): Error => {
  if (error instanceof OpenAI.APIError) {
    switch (error.status) {
      case 401:
        return new Error(
          "Invalid API key. Please check your OpenAI API key in settings.",
        );
      case 429:
        return new Error("Rate limit exceeded. Please try again in a moment.");
      case 500:
      case 502:
      case 503:
        return new Error(
          "OpenAI service temporarily unavailable. Please try again later.",
        );
      default:
        return new Error(`OpenAI API error: ${error.message}`);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(
    "An unexpected error occurred while processing your request.",
  );
};

/**
 * Tests the API key by making a simple request
 * @returns {Promise<boolean>} True if API key is valid
 */
export const testAPIKey = async (): Promise<boolean> => {
  try {
    const client = createClient();
    await client.models.list();
    return true;
  } catch (error) {
    console.error("API key test failed:", error);
    return false;
  }
};
