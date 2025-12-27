
import { GoogleGenAI } from "@google/genai";
import { AttendanceEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDashboardInsights = async (data: AttendanceEntry[]) => {
  const summary = JSON.stringify(data.slice(-10)); // Take last 10 entries for context
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following staff attendance data and provide 3 short, professional insights or recommendations for productivity: ${summary}`,
      config: {
        systemInstruction: "You are an HR data analyst. Keep insights concise, professional, and helpful.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this moment. Maintain consistent attendance for better reporting.";
  }
};
