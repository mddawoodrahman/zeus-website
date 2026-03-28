import OpenAI from "openai";
import { NextResponse } from "next/server";

type EnhancementType =
  | "grammar"
  | "clarity"
  | "professional"
  | "casual"
  | "concise"
  | "expand"
  | "creative";

interface EnhanceOptions {
  type: EnhancementType;
  preserveFormatting?: boolean;
  customInstructions?: string;
}

const getOpenAIClient = (request: Request) => {
  const headerKey = request.headers.get("x-openai-key")?.trim();
  const envKey = process.env.OPENAI_API_KEY?.trim();
  const apiKey = envKey || headerKey;

  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  return new OpenAI({ apiKey });
};

const analyzeWithOpenAI = async (client: OpenAI, text: string) => {
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

  const parsed = JSON.parse(response) as { suggestions?: unknown[] };
  return parsed.suggestions || [];
};

const getEnhancementPrompt = (type: EnhancementType) => {
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

  return prompts[type];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      action?: "analyze" | "enhance" | "complete" | "validate" | "config";
      text?: string;
      prompt?: string;
      systemPrompt?: string;
      options?: EnhanceOptions;
    };

    if (body.action === "config") {
      return NextResponse.json({
        strictServerOnly: Boolean(process.env.OPENAI_API_KEY?.trim()),
      });
    }

    const client = getOpenAIClient(req);

    if (body.action === "validate") {
      await client.models.list();
      return NextResponse.json({
        ok: true,
        strictServerOnly: Boolean(process.env.OPENAI_API_KEY?.trim()),
      });
    }

    if (body.action === "analyze") {
      if (!body.text?.trim()) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
      }

      const suggestions = await analyzeWithOpenAI(client, body.text);
      return NextResponse.json({ suggestions });
    }

    if (body.action === "enhance") {
      if (!body.text?.trim()) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
      }

      if (!body.options?.type) {
        return NextResponse.json(
          { error: "Enhancement type is required" },
          { status: 400 },
        );
      }

      const systemPrompt = getEnhancementPrompt(body.options.type);
      const customInstructions = body.options.customInstructions
        ? `\n\nAdditional instructions: ${body.options.customInstructions}`
        : "";

      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert writing assistant. ${systemPrompt}${customInstructions}${
              body.options.preserveFormatting
                ? "\n\nPreserve all formatting, line breaks, and structure."
                : ""
            }\n\nReturn only the improved text without explanations or comments.`,
          },
          {
            role: "user",
            content: body.text,
          },
        ],
        temperature: 0.7,
      });

      const enhanced = completion.choices[0]?.message?.content || body.text;
      const suggestions = await analyzeWithOpenAI(client, enhanced);

      return NextResponse.json({
        original: body.text,
        enhanced,
        suggestions,
        model: completion.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      });
    }

    if (body.action === "complete") {
      if (!body.prompt?.trim()) {
        return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
      }

      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...(body.systemPrompt
            ? [{ role: "system" as const, content: body.systemPrompt }]
            : []),
          { role: "user" as const, content: body.prompt },
        ],
        temperature: 0.7,
      });

      return NextResponse.json({
        result: completion.choices[0]?.message?.content || "",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 },
      );
    }

    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
