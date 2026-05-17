import dotenv from "dotenv";
import Groq from "groq-sdk";
dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const GenerateNoteInsights = async ({ title, content, tags, category }) => {
  try {
    if (!content?.trim()) {
      throw new Error("Note content is required");
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",

          content: `

You are an AI assistant integrated into a productivity note-taking workspace.

Your purpose is to help users quickly understand and act on their notes.

Analyze the note primarily from its CONTENT.

Use title, tags, and category only as supporting context.

Generate:

1. summary
2. actionItems
3. suggestedTitle

Instructions:

SUMMARY:
- 1–2 concise sentences
- focus on the main idea
- avoid repeating metadata
- avoid phrases like:
  "the note discusses"
  "this note covers"

ACTION ITEMS:
- extract practical tasks if they exist
- infer useful next actions when appropriate
- maximum 5 items
- short and actionable

SUGGESTED TITLE:
- concise
- meaningful
- improve weak titles if possible
- maximum 6 words

Important rules:

- prioritize note content over tags
- do not describe category or tags
- avoid generic AI wording
- no markdown
- no explanation
- return JSON only
- never return text outside JSON

Return exactly:

{
"summary":"",
"actionItems":[],
"suggestedTitle":""
}

`,
        },

        {
          role: "user",

          content: `

Title:
${title || "Untitled"}

Category:
${category || "General"}

Tags:
${tags?.join(", ") || "None"}

Content:
${content}

`,
        },
      ],

      model: "llama-3.3-70b-versatile",

      temperature: 0.2,

      max_tokens: 400,

      response_format: {
        type: "json_object",
      },
    });

    const response = chatCompletion.choices[0]?.message?.content;

    return JSON.parse(response);
  } catch (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export { GenerateNoteInsights };
