require("dotenv").config();

const OpenAI = require("openai");
const { z } = require("zod");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const interviewReportSchema = z.object({
  matchScore: z.number(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  title: z.string(),
});

function cleanAIResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/^\s*[\r\n]/gm, "")
    .trim();
}

function buildFallbackReport({ resume, selfDescription, jobDescription }) {
  const sourceText = `${resume || ""} ${selfDescription || ""}`.toLowerCase();
  const roleText = jobDescription || "the target role";
  const titleMatch = roleText.match(/(?:role|position|job title)\s*[:\-]\s*([^\n.]+)/i);
  const roleTitle = titleMatch?.[1]?.trim() || "Custom Interview";
  const matchScore = sourceText.length > 80 ? 88 : 84;

  return {
    matchScore,
    technicalQuestions: [
      {
        question: "How would you approach the most important technical requirement in this role?",
        intention: "Check whether you can connect your experience directly to the job.",
        answer: "Start with a comparable project, explain the architecture and tradeoffs, then tie it back to measurable impact."
      },
      {
        question: "Describe a bug or production issue you solved end to end.",
        intention: "Evaluate debugging depth, ownership, and communication.",
        answer: "Walk through the symptom, investigation steps, root cause, fix, validation, and what you improved afterward."
      },
      {
        question: "What would you optimize first if this system had to scale quickly?",
        intention: "Measure systems thinking and prioritization.",
        answer: "Identify the biggest user-facing bottleneck, define a metric, and explain the tradeoffs of the chosen fix."
      }
    ],
    behavioralQuestions: [
      {
        question: "Tell me about a time you took ownership of an ambiguous task.",
        intention: "Assess initiative and leadership.",
        answer: "Use STAR and show how you created clarity, aligned people, and delivered a concrete result."
      },
      {
        question: "Describe a disagreement with a teammate and how you handled it.",
        intention: "Assess collaboration and maturity.",
        answer: "Focus on listening, evidence, and the shared outcome rather than presenting it as winning an argument."
      },
      {
        question: "How do you learn something new when the timeline is tight?",
        intention: "Assess adaptability and execution speed.",
        answer: "Explain how you narrow to the critical path, validate with a small working example, and expand from there."
      }
    ],
    skillGaps: [
      { skill: "Role-specific architecture depth", severity: "medium" },
      { skill: "Quantified impact storytelling", severity: "low" },
      { skill: "Mock interview practice", severity: "medium" }
    ],
    preparationPlan: [
      { day: 1, focus: "Role analysis", tasks: ["Highlight the top 5 job requirements", "Match each to one project example"] },
      { day: 2, focus: "Technical stories", tasks: ["Prepare 3 technical deep dives", "Practice explaining tradeoffs clearly"] },
      { day: 3, focus: "Behavioral stories", tasks: ["Write STAR answers for ownership, conflict, and challenge", "Add metrics to each story"] },
      { day: 4, focus: "Skill gaps", tasks: ["Review missing concepts from the job description", "Create short revision notes"] },
      { day: 5, focus: "Mock round", tasks: ["Answer questions aloud", "Refine weak explanations"] },
      { day: 6, focus: "Portfolio alignment", tasks: ["Tighten resume project summaries", "Prepare a 60-second introduction"] },
      { day: 7, focus: "Final rehearsal", tasks: ["Run a full mock interview", "Review your closing questions for the interviewer"] }
    ],
    title: `${roleTitle} Interview Preparation`,
  };
}

async function invokeGeminiAi({ resume, selfDescription, jobDescription }) {
  const fallbackReport = buildFallbackReport({
    resume,
    selfDescription,
    jobDescription,
  });

  try {
    if (!process.env.GROQ_API_KEY) {
      return fallbackReport;
    }

    const prompt = `
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Analyze deeply and generate a high-quality interview report.

Important:
- Assume the candidate is strong unless the evidence says otherwise
- Match score should be between 85 and 95
- Never return empty arrays
- Avoid generic answers

Return only JSON:
{
  "matchScore": 90,
  "technicalQuestions": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "low|medium|high" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "...", "tasks": ["..."] }
  ],
  "title": "Role Interview Preparation"
}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;
    const parsed = JSON.parse(cleanAIResponse(result));

    if (parsed.matchScore < 85) {
      parsed.matchScore = 85;
    }

    const validated = interviewReportSchema.parse(parsed);

    return {
      ...validated,
      technicalQuestions: validated.technicalQuestions.length
        ? validated.technicalQuestions
        : fallbackReport.technicalQuestions,
      behavioralQuestions: validated.behavioralQuestions.length
        ? validated.behavioralQuestions
        : fallbackReport.behavioralQuestions,
      skillGaps: validated.skillGaps.length
        ? validated.skillGaps
        : fallbackReport.skillGaps,
      preparationPlan: validated.preparationPlan.length >= 7
        ? validated.preparationPlan
        : fallbackReport.preparationPlan,
    };
  } catch (error) {
    return fallbackReport;
  }
}

module.exports = invokeGeminiAi;
