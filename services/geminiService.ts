
import { GoogleGenAI } from "@google/genai";
import { FarmContext } from "../types";

export const askWeeraAI = async (
  context: FarmContext, 
  userMessage: string, 
  history: { role: 'user' | 'model', text: string }[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const totalHarvest = context.harvests.reduce((acc, h) => acc + h.weight, 0);
  const totalWorkHours = context.workRecords.reduce((acc, w) => acc + w.hoursWorked, 0);
  const totalRevenue = context.orders.reduce((acc, o) => acc + (o.weight * o.price), 0);
  const totalExpenses = context.expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Prepare a data snapshot for the model to reference
  const dataSnapshot = `
    CURRENT FARM DATA SNAPSHOT (WEERA AGRICULTURE):
    - Total Revenue: Rs. ${totalRevenue.toLocaleString()}
    - Total Expenses: Rs. ${totalExpenses.toLocaleString()}
    - Net Profit/Loss: Rs. ${netProfit.toLocaleString()}
    - Total Harvest Yield: ${totalHarvest.toLocaleString()}kg
    - Total Labor Investment: ${totalWorkHours.toLocaleString()} hours
    
    Variety Performance:
    ${Array.from(new Set(context.harvests.map(h => h.vegetableType))).map(type => {
      const weight = context.harvests.filter(h => h.vegetableType === type).reduce((acc, h) => acc + h.weight, 0);
      return `- ${type}: ${weight}kg`;
    }).join('\n')}

    Recent Orders:
    ${context.orders.slice(0, 5).map(o => `- ${o.date}: ${o.vegetableType}, ${o.weight}kg @ Rs.${o.price}/kg`).join('\n')}
  `;

  const systemInstruction = `
    You are WEERA AI, an expert agricultural business consultant for WEERA AGRICULTURE (PVT) LTD. 
    You have full access to the company's real-time farm data.
    
    Your goal is to answer ANY question the user asks about their farm operations, finances, and performance using the data provided.
    
    RULES:
    1. Always use the data snapshot provided to give specific answers.
    2. Be professional, helpful, and analytical.
    3. If the user asks about things not in the data, use your general agricultural expertise to guide them.
    4. Keep answers concise but thorough.
    5. Always refer to the company as "Weera Agriculture".
    
    ${dataSnapshot}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error connecting to the intelligence server. Please try again in a moment.";
  }
};

// Keeping this for backward compatibility if needed, but updated to use the new logic
export const getFarmInsights = async (context: FarmContext): Promise<string> => {
  return askWeeraAI(context, "Provide a brief summary and financial health verdict of my farm operations.", []);
};
