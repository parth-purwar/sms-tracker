
import { GoogleGenAI, Type } from "@google/genai";
import { Expense } from "./types";

// Note: The API_KEY is automatically provided via process.env.API_KEY in this environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseSmsToExpense(smsText: string): Promise<Partial<Expense>> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a financial assistant. Extract transaction data from this SMS notification: "${smsText}". 
    Look for:
    - Amount (number only)
    - Date (YYYY-MM-DD format)
    - Merchant/Vendor (The name of the store or person paid)
    - Category (Assign one: Food, Transport, Shopping, Utilities, Entertainment, Health, or Other)
    
    If the date is "today" or not specified, use the current date: ${new Date().toISOString().split('T')[0]}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: {
            type: Type.NUMBER,
            description: 'The numeric cost of the transaction.',
          },
          date: {
            type: Type.STRING,
            description: 'The date in YYYY-MM-DD format.',
          },
          merchant: {
            type: Type.STRING,
            description: 'Name of the shop or service provider.',
          },
          category: {
            type: Type.STRING,
            description: 'The expense category.',
          }
        },
        required: ["amount", "merchant"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      date: data.date || new Date().toISOString().split('T')[0],
      id: crypto.randomUUID(),
      originalSms: smsText
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return {};
  }
}
