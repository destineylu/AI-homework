import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import type { AiChatMessage } from "./chat-types";

export interface GeminiModel {
  name: string;
  displayName: string;
}

export interface GeminiConfig {
  thinkingBudget?: number;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  safetySettings?: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>;
}

export class GeminiAi {
  private ai: GoogleGenAI;
  private systemPrompt?: string;
  private config: GeminiConfig;

  constructor(key: string, baseUrl?: string, config?: GeminiConfig) {
    this.ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        baseUrl: baseUrl,
      },
    });

    this.config = {
      thinkingBudget: config?.thinkingBudget ?? -1,
      temperature: config?.temperature ?? 0.3,
      topP: config?.topP ?? 0.9,
      maxOutputTokens: config?.maxOutputTokens ?? 8192,
      safetySettings: config?.safetySettings ?? [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    };
  }

  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }

  // async sendText(userText: string, model = "gemini-2.5-pro") {
  //   const contents = [];
  //
  //   if (this.systemPrompt) {
  //     contents.push({
  //       role: "user",
  //       parts: [{ text: this.systemPrompt }],
  //     });
  //   }
  //
  //   contents.push({
  //     role: "user",
  //     parts: [{ text: userText }],
  //   });
  //
  //   const response = await this.ai.models.generateContentStream({
  //     model,
  //     config: {
  //       thinkingConfig: { thinkingBudget: this.config.thinkingBudget },
  //       safetySettings: this.config.safetySettings,
  //     },
  //     contents,
  //   });
  //
  //   let result = "";
  //   for await (const chunk of response) {
  //     if (chunk.text) {
  //       result += chunk.text;
  //     }
  //   }
  //   return result;
  // }

  async sendMedia(
    media: string,
    mimeType: string,
    prompt?: string,
    model = "gemini-2.5-pro",
    callback?: (text: string) => void,
  ) {
    const contents = [];

    if (this.systemPrompt) {
      contents.push({
        role: "user",
        parts: [{ text: this.systemPrompt }],
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];
    if (prompt) {
      parts.push({ text: prompt });
    }

    if (media.startsWith("http")) {
      parts.push({
        fileData: {
          mimeType,
          fileUri: media,
        },
      });
    } else {
      parts.push({
        inlineData: {
          mimeType,
          data: media, // base64
        },
      });
    }

    contents.push({
      role: "user",
      parts,
    });

    const response = await this.ai.models.generateContentStream({
      model,
      config: {
        thinkingConfig: { thinkingBudget: this.config.thinkingBudget },
        temperature: this.config.temperature,
        topP: this.config.topP,
        maxOutputTokens: this.config.maxOutputTokens,
        safetySettings: this.config.safetySettings,
      },
      contents,
    });

    let result = "";
    for await (const chunk of response) {
      if (chunk.text) {
        result += chunk.text;
        callback?.(chunk.text);
      }
    }
    return result;
  }

  async getAvailableModels(): Promise<GeminiModel[]> {
    try {
      const response: any = await this.ai.models.list();
      
      // 获取所有模型
      const allModels = response.page || [];
      console.log(`[Gemini] Fetched ${allModels.length} models from API`);
      
      // 处理所有模型
      const validModels = allModels.map((model: any) => {
        console.log(`[Gemini] Model: ${model.name}, display: ${model.displayName}, methods: ${(model.supportedGenerationMethods || []).join(", ")}`);
        return {
          name: model.name!,
          displayName: model.displayName ?? model.name!,
        };
      });
      
      console.log(`[Gemini] Total models returned: ${validModels.length}`);
      
      // 改进排序逻辑：按版本号和名称排序
      return validModels.sort((a: GeminiModel, b: GeminiModel) => {
        // 提取版本号 (支持 3, 3.0, 2.5, 2.0, 1.5 等格式)
        const extractVersion = (name: string): number => {
          // 匹配 gemini-X.X 或 gemini-X
          const match = name.toLowerCase().match(/gemini[- ](\d+)(?:\.(\d+))?/);
          if (match) {
            const major = parseInt(match[1] || "0");
            const minor = parseInt(match[2] || "0");
            return major * 100 + minor; // 3.0 -> 300, 2.5 -> 205, 3 -> 300
          }
          return 0;
        };
        
        const versionA = extractVersion(a.name);
        const versionB = extractVersion(b.name);
        
        // 版本号降序
        if (versionA !== versionB) {
          return versionB - versionA;
        }
        
        // 版本号相同时，按名称字母序
        return a.displayName.localeCompare(b.displayName);
      });
    } catch (error) {
      console.error("Failed to fetch Gemini models:", error);
      throw error;
    }
  }

  async sendChat(
    messages: AiChatMessage[],
    model = "gemini-2.5-pro",
    callback?: (text: string) => void,
  ) {
    const contents = [];

    if (this.systemPrompt) {
      contents.push({
        role: "user",
        parts: [{ text: this.systemPrompt }],
      });
    }

    for (const message of messages) {
      const trimmed = message.content?.trim();
      if (!trimmed) continue;

      const role = message.role === "assistant" ? "model" : "user";

      contents.push({
        role,
        parts: [{ text: trimmed }],
      });
    }

    const response = await this.ai.models.generateContentStream({
      model,
      config: {
        thinkingConfig: { thinkingBudget: this.config.thinkingBudget },
        safetySettings: this.config.safetySettings,
      },
      contents,
    });

    let result = "";
    for await (const chunk of response) {
      if (chunk.text) {
        result += chunk.text;
        callback?.(chunk.text);
      }
    }
    return result.trim();
  }
}
