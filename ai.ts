import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import type { FaceDetectionOutput } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to detect if a clear, single human face is present in an image.
 * @param photoDataUri - The base64-encoded image data URI.
 * @returns A promise that resolves to a FaceDetectionOutput object.
 */
export const detectFace = async (photoDataUri: string): Promise<FaceDetectionOutput> => {
  try {
    const base64Data = photoDataUri.split(',')[1];
    if (!base64Data) {
      return { faceDetected: false, reason: "Invalid image data." };
    }

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    };
    
    const textPart = {
      text: "Analyze this image. Does it contain a single, clearly visible human face? Do not consider cartoons or drawings. The face should not be obscured."
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      // Per official guidelines, 'gemini-2.5-flash' is the recommended model for this task.
      // It provides the best combination of speed, accuracy, and features.
      // The 'gemini-1.5-flash' series is considered deprecated.
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceDetected: {
              type: Type.BOOLEAN,
              description: 'True if a single, clear human face is detected, otherwise false.',
            },
            reason: {
              type: Type.STRING,
              description: 'A brief reason for the detection result.',
            },
          },
          required: ['faceDetected', 'reason'],
        },
      },
    });
    
    const jsonString = response.text.trim();
    const result: FaceDetectionOutput = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error('AI face detection failed:', error);
    return { faceDetected: false, reason: 'Could not connect to the verification service.' };
  }
};

/**
 * Provides a brief, friendly analysis of user profiles for chat compatibility.
 * @returns A promise that resolves to a string with the AI's decision.
 */
export const enhanceRandomChat = async (): Promise<string> => {
  try {
    // In a real app, these would be fetched for the current users.
    const currentUserProfile = "Loves hiking, technology, and Italian food. Based in New York.";
    const otherUserProfile = "Art student from San Francisco, enjoys photography and indie music.";

    const response = await ai.models.generateContent({
      // Using 'gemini-2.5-flash' as it is the latest and most capable model for this type of general text task.
      model: 'gemini-2.5-flash',
      contents: `Based on these two user profiles, would they be a good match for a random chat? Profile 1: ${currentUserProfile}. Profile 2: ${otherUserProfile}. Give a brief, friendly reason for your decision, focusing on potential shared interests. Keep it under 20 words. Example: "You both love art! This could be a great chat."`,
    });

    return response.text;
  } catch (error) {
    console.error('AI enhancement failed:', error);
    return "Analyzing profiles for a good match...";
  }
};


const BOT_SYSTEM_INSTRUCTION = 'You are a friendly, witty, and engaging AI assistant in a random chat app. A user could not be matched with a real person, so you are their chat partner. Keep your responses concise and conversational.';

/**
 * Creates a new, empty chat session with the AI bot. Used as a fallback.
 * @returns A Gemini Chat instance.
 */
export const createBotChat = (): Chat => {
  return ai.chats.create({
    // 'gemini-2.5-flash' is the correct model for high-quality, fast chat interactions.
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: BOT_SYSTEM_INSTRUCTION,
    },
  });
};

/**
 * Starts a new chat with the AI by first generating a dynamic greeting.
 * @returns A promise that resolves to an object containing the chat session and the initial message.
 */
export const startBotChat = async (): Promise<{ chat: Chat; initialMessage: string; }> => {
  // 1. Generate the dynamic greeting separately to keep the chat history clean.
  const greetingResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: "Generate a friendly, brief, and witty greeting to start a conversation with a user in a random chat app. You are their AI partner because no human was available.",
    config: {
      systemInstruction: BOT_SYSTEM_INSTRUCTION,
    },
  });
  const initialMessage = greetingResponse.text;

  // 2. Create the chat session with the greeting pre-filled in the history.
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: BOT_SYSTEM_INSTRUCTION,
    },
    history: [
      { role: "model", parts: [{ text: initialMessage }] },
    ],
  });

  return { chat, initialMessage };
};