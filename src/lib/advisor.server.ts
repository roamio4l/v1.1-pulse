import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";

const CHAPTERS = `01 Campaign planning — strategy blueprint: regions, milestones, coordinators, budgets.
02 Volunteer organization — onboarding volunteers by geography, skill, availability.
03 Community engagement — structured supporter communities that persist.
04 Communications — unified WhatsApp, SMS, email, social messaging with approvals.
05 Field operations — canvassing, town halls, events with live coverage maps.
06 Polling & consultation — structured polls and feedback into planning.
07 Election day — situation room for stations, observers, incidents.
08 Governance transition — campaign artifacts become governance workspaces.`;

const Schema = z.object({
  summary: z.string(),
  chapters: z.array(
    z.object({
      n: z.enum(["01", "02", "03", "04", "05", "06", "07", "08"]),
      reason: z.string(),
    }),
  ),
});

export async function runAdvisor(goals: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured yet.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions:
        "You advise campaign leaders on which Pulse election-OS chapters matter most to them. Pick the 2-4 most relevant chapters, ordered by relevance. Give a one-sentence summary and, per chapter, a concrete 1-2 sentence explanation tied to the leader's own words.\n\nChapters:\n" +
        CHAPTERS,
      messages: [{ role: "user", content: goals }],
      output: Output.object({ schema: Schema }),
      maxRetries: 0,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    return Schema.parse(await result.output);
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    if (status === 429) throw new Error("Too many requests right now — please try again shortly.");
    if (status === 402) throw new Error("AI credits are exhausted for this workspace.");
    if (status === 403) throw new Error("AI access is currently unavailable for this workspace.");
    console.error(e);
    throw new Error("Couldn't generate recommendations. Please try again.");
  }
}
