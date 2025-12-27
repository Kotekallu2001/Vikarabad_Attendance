
import { GoogleGenAI } from "@google/genai";
import { AttendanceEntry } from "../types";

export const getDashboardInsights = async (data: AttendanceEntry[]) => {
  // Prevent crash if data is empty or process.env is not yet available
  if (!data || data.length === 0) return "Start marking attendance to see AI-powered insights here.";
  
  const summary = JSON.stringify(data.slice(-10)); 
  
  try {
    // Initialize inside the function to ensure process.env.API_KEY is accessed at runtime
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
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
    return "Insights are currently unavailable. Please ensure your API key is configured correctly.";
  }
};
