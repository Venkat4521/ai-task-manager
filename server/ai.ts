import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initialize the Google Generative AI client
 * Make sure to set GOOGLE_API_KEY in your environment variables
 */
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

/**
 * Interface defining the structure of AI task suggestions
 * Contains detailed breakdown, optimization recommendations, and scheduling suggestions
 */
interface TaskSuggestion {
  breakdown: string[];
  suggestions: string[];
  checkpoints: string[];
  optimization: {
    timeEstimate: string;
    priority: 'high' | 'medium' | 'low';
    bestTimeOfDay: string;
    potentialBlockers: string[];
    recommendations: string[];
  };
  recommendedDueDate?: string;
  recommendedReminder?: string;
}

/**
 * Generates AI-powered suggestions for a given task
 * @param task - The task title/description to analyze
 * @returns A JSON string containing structured task suggestions and optimization recommendations
 * 
 * The function provides:
 * - Step-by-step task breakdown
 * - Productivity suggestions
 * - Progress checkpoints
 * - Time estimation and scheduling
 * - Potential blockers and solutions
 * - Focus and efficiency recommendations
 */
export async function generateTaskSuggestions(task: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an advanced AI task management assistant, analyze this task and provide comprehensive assistance:
    Task: "${task}"

    Respond with JSON in this format:
    {
      "breakdown": string[], // Detailed step-by-step breakdown of the task
      "suggestions": string[], // Productivity tips and recommendations
      "checkpoints": string[], // Key milestones for progress tracking
      "optimization": {
        "timeEstimate": string, // Estimated time to complete (e.g., "2 hours", "3 days")
        "priority": "high" | "medium" | "low", // Suggested priority level
        "bestTimeOfDay": string, // Recommended time of day for optimal focus
        "potentialBlockers": string[], // Potential challenges or dependencies
        "recommendations": string[] // Specific optimization suggestions
      },
      "recommendedDueDate": string, // ISO date string for suggested deadline
      "recommendedReminder": string // ISO date string for suggested reminder
    }

    Consider:
    1. Task complexity and realistic timeframes
    2. Natural workflow breakpoints for checkpoints
    3. Best practices and efficiency optimization
    4. Dependencies and potential roadblocks
    5. Mental energy requirements and focus optimization
    6. Time-boxing and scheduling recommendations`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse and validate the response
    let parsedResponse: TaskSuggestion;
    try {
      parsedResponse = JSON.parse(text);
      return JSON.stringify(parsedResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return JSON.stringify({
        breakdown: ["Unable to generate task breakdown"],
        suggestions: ["AI suggestions temporarily unavailable"],
        checkpoints: [],
        optimization: {
          timeEstimate: "Unknown",
          priority: "medium",
          bestTimeOfDay: "Any time",
          potentialBlockers: [],
          recommendations: []
        }
      });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return JSON.stringify({
      breakdown: ["Unable to generate task breakdown"],
      suggestions: ["AI suggestions temporarily unavailable"],
      checkpoints: [],
      optimization: {
        timeEstimate: "Unknown",
        priority: "medium",
        bestTimeOfDay: "Any time",
        potentialBlockers: [],
        recommendations: []
      }
    });
  }
}

/**
 * Provides real-time AI assistance for specific task-related queries
 * @param query - The user's question or request about the task
 * @param taskContext - Optional context about the task for more relevant suggestions
 * @returns A JSON string containing the AI's response and recommendations
 * 
 * The function provides:
 * - Direct responses to user queries
 * - Action items and next steps
 * - Time management suggestions
 * - Focus strategies
 * - Tool recommendations
 */
export async function getTaskAssistance(query: string, taskContext?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an AI task management assistant, help with this query about a task:
    Query: "${query}"
    ${taskContext ? `Task Context: "${taskContext}"` : ''}

    Respond with JSON in this format:
    {
      "response": string, // Direct response to the user's query
      "actionItems": string[], // Specific actions to take
      "additionalTips": string[], // Related helpful suggestions
      "optimizationSuggestions": {
        "timeManagement": string[], // Time management tips
        "focusStrategies": string[], // Focus and productivity strategies
        "toolsAndTechniques": string[] // Recommended tools or techniques
      }
    }

    Consider:
    1. User's immediate needs and concerns
    2. Practical, actionable advice
    3. Productivity optimization
    4. Focus and efficiency improvements`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("AI Assistant error:", error);
    return JSON.stringify({
      response: "I'm currently unable to process your request. Please try again later.",
      actionItems: [],
      additionalTips: [],
      optimizationSuggestions: {
        timeManagement: [],
        focusStrategies: [],
        toolsAndTechniques: []
      }
    });
  }
}