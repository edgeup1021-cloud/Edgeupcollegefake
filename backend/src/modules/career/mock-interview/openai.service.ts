import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatResponseDto } from './dto';

const SYSTEM_PROMPT = `You are James, an AI interviewer conducting a mock interview.

Interview Flow:
1. Start with a friendly greeting and ask "Tell me about yourself"
2. Ask 1-2 general technical questions
3. On your 3rd question, use the ask_language_preference tool to let them choose their coding language
4. After language selection, continue with a mix of:
   - 2 coding challenges (spread out, not back-to-back)
   - Technical questions about their experience
   - Behavioral/HR questions (teamwork, handling challenges, career goals)
   - Personal questions (interests, work-life balance)
5. End with brief overall feedback

IMPORTANT - Language Selection:
- Use ask_language_preference tool on the 3rd question (not at the start)
- DO NOT ask for language in text - use the tool
- Remember their choice for all coding challenges

When using show_coding_challenge:
- ALWAYS set "language" parameter to match user's selected preference
- Generate function signatures in their preferred language syntax
- Space out the 2 coding challenges (don't do them back-to-back)

IMPORTANT - When user completes a coding challenge:
- If you see "[User completed the coding challenge successfully]", congratulate briefly and move to a DIFFERENT type of question
- Do NOT give another coding challenge immediately
- Do NOT repeat the same challenge

Guidelines:
- Keep responses to 1-2 short sentences max
- Brief acknowledgment, then next question
- Coding challenges should be easy/entry-level
- Mix question types for a natural interview feel
- After approximately 8-10 questions total, use the end_interview tool to conclude

IMPORTANT - Ending the Interview:
- After sufficient questions (8-10 total), use the end_interview tool
- Provide honest scores and feedback based on the conversation
- Be constructive with areas for improvement

Start with a friendly greeting and ask them to tell you about themselves.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'ask_language_preference',
      description:
        'Show language selection buttons to the user. Use this at the very start of the interview to let the user choose their preferred programming language.',
      parameters: {
        type: 'object',
        properties: {
          spoken_prompt: {
            type: 'string',
            description:
              "What James says to ask for language preference (1 sentence, e.g., 'Which programming language would you like to use today?')",
          },
        },
        required: ['spoken_prompt'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'show_coding_challenge',
      description:
        'Display a coding challenge for the candidate to solve. Use this for 1-2 questions during the interview.',
      parameters: {
        type: 'object',
        properties: {
          spoken_intro: {
            type: 'string',
            description: 'What James says to introduce the challenge (1-2 sentences)',
          },
          title: {
            type: 'string',
            description: 'Title of the coding problem',
          },
          description: {
            type: 'string',
            description: 'Full problem description with constraints',
          },
          function_signature: {
            type: 'string',
            description:
              "The function signature the user should implement. Use Python syntax by default, e.g. 'def add_numbers(a: int, b: int) -> int:'",
          },
          language: {
            type: 'string',
            enum: [
              'python',
              'javascript',
              'typescript',
              'java',
              'cpp',
              'c',
              'csharp',
              'go',
              'ruby',
              'rust',
            ],
            description:
              "Programming language for the challenge. Default to 'python' unless the user specifies otherwise.",
          },
          test_cases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                input: { type: 'string' },
                output: { type: 'string' },
              },
              required: ['input', 'output'],
            },
            description:
              'Test cases with input/output. IMPORTANT: Use positional arguments only (e.g., \'3, 5\' not \'a = 3, b = 5\'). For arrays: \'[1, 2, 3], 5\'. For strings: \'"hello"\'.',
          },
          hints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Hints to help if the candidate struggles',
          },
          solution_approach: {
            type: 'string',
            description: 'Brief description of the optimal approach for evaluation',
          },
        },
        required: ['spoken_intro', 'title', 'description', 'function_signature', 'test_cases'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'end_interview',
      description:
        'End the interview and trigger report generation. Use this after asking 8-10 questions to conclude the interview with final feedback and scores.',
      parameters: {
        type: 'object',
        properties: {
          spoken_outro: {
            type: 'string',
            description:
              'What James says to wrap up the interview (2-3 sentences thanking them and giving brief verbal feedback)',
          },
          overall_assessment: {
            type: 'string',
            description: "A 2-3 sentence overall assessment of the candidate's performance",
          },
          strengths: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of 3-5 strengths observed during the interview',
          },
          areas_for_improvement: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of 2-4 areas where the candidate could improve',
          },
          technical_score: {
            type: 'number',
            description: 'Technical skills score from 1-10 based on coding challenges and technical questions',
          },
          communication_score: {
            type: 'number',
            description: 'Communication skills score from 1-10 based on clarity and articulation',
          },
          problem_solving_score: {
            type: 'number',
            description: 'Problem-solving ability score from 1-10 based on approach to challenges',
          },
        },
        required: [
          'spoken_outro',
          'overall_assessment',
          'strengths',
          'areas_for_improvement',
          'technical_score',
          'communication_score',
          'problem_solving_score',
        ],
      },
    },
  },
];

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not configured');
    }
    this.openai = new OpenAI({ apiKey });
    this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o';
  }

  async createChatCompletion(
    messages: ChatMessage[],
    disableTools = false,
  ): Promise<ChatResponseDto> {
    try {
      const chatMessages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];

      if (messages && messages.length > 0) {
        chatMessages.push(...messages);
      } else {
        chatMessages.push({
          role: 'user',
          content: '[Interview starting - candidate is ready]',
        });
      }

      const requestOptions: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
        model: this.model,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
      };

      if (!disableTools) {
        requestOptions.tools = tools;
        requestOptions.tool_choice = 'auto';
      }

      const response = await this.openai.chat.completions.create(requestOptions);
      const message = response.choices[0].message;

      this.logger.log(`AI Response: ${message.content}`);

      // Check for tool calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];

        if (toolCall.type === 'function') {
          const args = JSON.parse(toolCall.function.arguments);

          if (toolCall.function.name === 'ask_language_preference') {
            return {
              content: args.spoken_prompt,
              tool_call: {
                name: 'ask_language_preference',
              },
            };
          }

          if (toolCall.function.name === 'show_coding_challenge') {
            return {
              content: args.spoken_intro,
              tool_call: {
                name: 'show_coding_challenge',
                challenge: {
                  title: args.title,
                  description: args.description,
                  functionSignature: args.function_signature,
                  language: args.language || 'python',
                  testCases: args.test_cases,
                  hints: args.hints || [],
                  solutionApproach: args.solution_approach || '',
                },
              },
            };
          }

          if (toolCall.function.name === 'end_interview') {
            return {
              content: args.spoken_outro,
              tool_call: {
                name: 'end_interview',
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
            };
          }
        }
      }

      return {
        content: message.content || '',
        tool_call: null,
      };
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateReportAnalysis(conversationText: string, language: string): Promise<any> {
    try {
      const REPORT_GENERATION_PROMPT = `You are an interview analysis expert. Based on the interview transcript provided, generate a comprehensive assessment report.

Analyze the conversation and provide:
1. Executive Summary (2-3 paragraphs summarizing the interview and candidate's overall performance)
2. Technical Analysis (detailed assessment of technical skills demonstrated)
3. Communication Analysis (assessment of how well they communicated, articulated thoughts)
4. Coding Performance Details (if coding challenges were attempted, analyze their approach and solution)
5. Key Highlights (3-5 notable moments or responses from the interview)
6. Recommendations (3-5 actionable recommendations for the candidate)

Respond in JSON format:
{
  "executiveSummary": "...",
  "technicalAnalysis": "...",
  "communicationAnalysis": "...",
  "codingPerformanceDetails": "...",
  "keyHighlights": ["...", "..."],
  "recommendations": ["...", "..."]
}`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: REPORT_GENERATION_PROMPT },
          {
            role: 'user',
            content: `Here is the interview transcript to analyze:\n\n${conversationText}\n\nThe candidate used ${language} for coding challenges.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const analysisContent = response.choices[0].message.content;
      return JSON.parse(analysisContent || '{}');
    } catch (error) {
      this.logger.error('Report generation error:', error);
      return {
        executiveSummary: 'Unable to generate detailed analysis.',
        technicalAnalysis: 'Analysis unavailable.',
        communicationAnalysis: 'Analysis unavailable.',
        codingPerformanceDetails: 'Analysis unavailable.',
        keyHighlights: [],
        recommendations: [],
      };
    }
  }
}
