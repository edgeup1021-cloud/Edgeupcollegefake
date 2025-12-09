import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are James, an AI interviewer conducting a mock interview.

Interview Flow:
1. Start with a friendly greeting and ask "Tell me about yourself"
2. Ask 1-2 technical questions relevant to the job role and technologies
3. On your 3rd question, use the ask_language_preference tool to let them choose their coding language
4. After language selection, continue with a mix of:
   - 2 coding challenges (spread out, not back-to-back) - tailor to the job requirements and difficulty level
   - Technical questions about their experience with the specific technologies
   - Behavioral/HR questions related to the job requirements (teamwork, handling challenges, career goals)
   - Personal questions (interests, work-life balance)
5. End with brief overall feedback

IMPORTANT - Language Selection:
- Use ask_language_preference tool on the 3rd question (not at the start)
- Do NOT ask for language in text - use the tool
- Remember their choice for all coding challenges

When using show_coding_challenge:
- ALWAYS set "language" parameter to match user's selected preference
- Generate function signatures in their preferred language syntax
- Tailor challenges to the job description and required skill level
- Space out the 2 coding challenges (don't do them back-to-back)
- Consider the key technologies mentioned in the job description

IMPORTANT - When user completes a coding challenge:
- If you see "[User completed the coding challenge successfully]", congratulate briefly and move to a DIFFERENT type of question
- Do NOT give another coding challenge immediately
- Do NOT repeat the same challenge

Guidelines:
- Keep responses to 1-2 short sentences max
- Brief acknowledgment, then next question
- Adapt coding challenge difficulty based on the job level specified
- Ask technical questions relevant to the technologies in the job description
- Mix question types for a natural interview feel
- After approximately 8-10 questions total, use the end_interview tool to conclude

IMPORTANT - Ending the Interview:
- After sufficient questions (8-10 total), use the end_interview tool
- Provide honest scores and feedback based on the conversation
- Evaluate against the job requirements provided
- Be constructive with areas for improvement

Start with a friendly greeting referencing the job role if provided.`;

// Job Description interface
interface JobDescriptionData {
  fullJD: string;
  jobTitle: string;
  keyTechnologies: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Function to build system prompt with JD context
function buildSystemPromptWithJD(basePrompt: string, jd: JobDescriptionData): string {
  const difficultyGuidance = {
    easy: `
- Ask entry-level technical questions suitable for junior candidates
- Coding challenges: basic algorithms (arrays, strings, loops)
- Examples: reverse string, find duplicates, sum array, FizzBuzz
- Focus on fundamental concepts and syntax`,

    medium: `
- Ask mid-level technical questions about data structures
- Coding challenges: hashmaps, linked lists, trees, two pointers
- Examples: sliding window, BFS/DFS, basic dynamic programming
- Explore system design fundamentals`,

    hard: `
- Ask advanced questions about complex algorithms and system design
- Coding challenges: graph algorithms, advanced DP, optimization
- Examples: LRU cache, tree manipulation, scalability
- Include system design considerations`
  };

  const techStackContext = jd.keyTechnologies.length > 0
    ? `\n\nKey Technologies for This Role:\n${jd.keyTechnologies.map(tech => `- ${tech}`).join('\n')}`
    : '';

  const jdSection = `
===== JOB-SPECIFIC CONTEXT =====

Job Title: ${jd.jobTitle}
Difficulty Level: ${jd.difficulty.toUpperCase()}

Full Job Description:
${jd.fullJD}
${techStackContext}

${difficultyGuidance[jd.difficulty]}

IMPORTANT - TAILOR YOUR INTERVIEW:
1. Reference the job title in your greeting (e.g., "applying for ${jd.jobTitle}")
2. Ask technical questions relevant to the listed technologies
3. Design coding challenges matching the ${jd.difficulty} difficulty level
4. Use show_coding_challenge with problems relevant to this role
5. Relate behavioral questions to job requirements
6. Prefer coding problems using the key technologies

================================

`;

  return jdSection + basePrompt;
}

// Tool definitions
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "ask_language_preference",
      description: "Show language selection buttons to the user. Use this at the very start of the interview to let the user choose their preferred programming language.",
      parameters: {
        type: "object",
        properties: {
          spoken_prompt: {
            type: "string",
            description: "What James says to ask for language preference (1 sentence, e.g., 'Which programming language would you like to use today?')",
          },
        },
        required: ["spoken_prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "show_coding_challenge",
      description: "Display a coding challenge for the candidate to solve. Use this for 1-2 questions during the interview. Tailor the challenge to the job description provided, considering the role's key technologies and required difficulty level.",
      parameters: {
        type: "object",
        properties: {
          spoken_intro: {
            type: "string",
            description: "What James says to introduce the challenge (1-2 sentences)",
          },
          title: {
            type: "string",
            description: "Title of the coding problem",
          },
          description: {
            type: "string",
            description: "Full problem description with constraints",
          },
          function_signature: {
            type: "string",
            description: "The function signature the user should implement. Use Python syntax by default, e.g. 'def add_numbers(a: int, b: int) -> int:'",
          },
          language: {
            type: "string",
            enum: ["python", "javascript", "typescript", "java", "cpp", "c", "csharp", "go", "ruby", "rust"],
            description: "Programming language for the challenge. Default to 'python' unless the user specifies otherwise.",
          },
          test_cases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                input: { type: "string" },
                output: { type: "string" },
              },
              required: ["input", "output"],
            },
            description: "Test cases with input/output. IMPORTANT: Use positional arguments only (e.g., '3, 5' not 'a = 3, b = 5'). For arrays: '[1, 2, 3], 5'. For strings: '\"hello\"'.",
          },
          hints: {
            type: "array",
            items: { type: "string" },
            description: "Hints to help if the candidate struggles",
          },
          solution_approach: {
            type: "string",
            description: "Brief description of the optimal approach for evaluation",
          },
        },
        required: ["spoken_intro", "title", "description", "function_signature", "test_cases"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "end_interview",
      description: "End the interview and trigger report generation. Use this after asking 8-10 questions to conclude the interview with final feedback and scores.",
      parameters: {
        type: "object",
        properties: {
          spoken_outro: {
            type: "string",
            description: "What James says to wrap up the interview (2-3 sentences thanking them and giving brief verbal feedback)",
          },
          overall_assessment: {
            type: "string",
            description: "A 2-3 sentence overall assessment of the candidate's performance",
          },
          strengths: {
            type: "array",
            items: { type: "string" },
            description: "List of 3-5 strengths observed during the interview",
          },
          areas_for_improvement: {
            type: "array",
            items: { type: "string" },
            description: "List of 2-4 areas where the candidate could improve",
          },
          technical_score: {
            type: "number",
            description: "Technical skills score from 1-10 based on coding challenges and technical questions",
          },
          communication_score: {
            type: "number",
            description: "Communication skills score from 1-10 based on clarity and articulation",
          },
          problem_solving_score: {
            type: "number",
            description: "Problem-solving ability score from 1-10 based on approach to challenges",
          },
        },
        required: ["spoken_outro", "overall_assessment", "strengths", "areas_for_improvement", "technical_score", "communication_score", "problem_solving_score"],
      },
    },
  },
];

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, disableTools, jobDescription } = await request.json();

    console.log("\n=== CHAT API REQUEST ===");
    console.log("Messages count:", messages?.length || 0);
    console.log("Disable tools:", disableTools || false);
    console.log("Job Description:", jobDescription ? "Provided" : "None");

    // Build system prompt with JD context if provided
    const systemPrompt = jobDescription
      ? buildSystemPromptWithJD(SYSTEM_PROMPT, jobDescription)
      : SYSTEM_PROMPT;

    const chatMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    if (messages && messages.length > 0) {
      chatMessages.push(...messages);
    } else {
      // First message - prompt to start
      const startMessage = jobDescription
        ? `[Interview starting - candidate is ready. Job Role: ${jobDescription.jobTitle}]`
        : "[Interview starting - candidate is ready]";

      chatMessages.push({
        role: "user",
        content: startMessage,
      });
    }

    // Build request options - disable tools when requesting hints
    const requestOptions: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-4o",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 500,
    };

    // Only include tools if not disabled (e.g., for hint requests)
    if (!disableTools) {
      requestOptions.tools = tools;
      requestOptions.tool_choice = "auto";
    }

    const response = await openai.chat.completions.create(requestOptions);

    const message = response.choices[0].message;

    console.log("\n=== AI RESPONSE ===");
    console.log("Content:", message.content);
    console.log("Tool calls:", message.tool_calls ? JSON.stringify(message.tool_calls, null, 2) : "None");

    // Check if there are tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];

      if (toolCall.type === "function") {
        const args = JSON.parse(toolCall.function.arguments);

        // Handle ask_language_preference tool
        if (toolCall.function.name === "ask_language_preference") {
          console.log("\n=== TOOL CALL: ask_language_preference ===");
          console.log("Spoken prompt:", args.spoken_prompt);

          return NextResponse.json({
            content: args.spoken_prompt,
            tool_call: {
              name: "ask_language_preference",
            },
          });
        }

        // Handle show_coding_challenge tool
        if (toolCall.function.name === "show_coding_challenge") {
          console.log("\n=== TOOL CALL: show_coding_challenge ===");
          console.log("Spoken intro:", args.spoken_intro);
          console.log("Challenge title:", args.title);

          return NextResponse.json({
            content: args.spoken_intro,
            tool_call: {
              name: "show_coding_challenge",
              challenge: {
                title: args.title,
                description: args.description,
                functionSignature: args.function_signature,
                language: args.language || "python",
                testCases: args.test_cases,
                hints: args.hints || [],
                solutionApproach: args.solution_approach || "",
              },
            },
          });
        }

        // Handle end_interview tool
        if (toolCall.function.name === "end_interview") {
          console.log("\n=== TOOL CALL: end_interview ===");
          console.log("Spoken outro:", args.spoken_outro);
          console.log("Scores:", args.technical_score, args.communication_score, args.problem_solving_score);

          return NextResponse.json({
            content: args.spoken_outro,
            tool_call: {
              name: "end_interview",
              assessment: {
                spokenOutro: args.spoken_outro,
                overallAssessment: args.overall_assessment,
                strengths: args.strengths || [],
                areasForImprovement: args.areas_for_improvement || [],
                technicalScore: args.technical_score,
                communicationScore: args.communication_score,
                problemSolvingScore: args.problem_solving_score,
              },
            },
          });
        }
      }
    }

    // Regular conversation response
    return NextResponse.json({
      content: message.content || "",
      tool_call: null,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
