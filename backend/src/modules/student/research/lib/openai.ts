export interface KeywordExtraction {
  keywords: string[];
}

export async function extractKeywords(query: string): Promise<KeywordExtraction> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract 3-5 key search terms from the user's research query. Return only a JSON object with a 'keywords' array. Be specific and academic.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenAI API error:", error);
    throw new Error("Failed to extract keywords from your query");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content);

  return {
    keywords: parsed.keywords,
  };
}
