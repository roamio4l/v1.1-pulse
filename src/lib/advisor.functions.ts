import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ goals: z.string().trim().min(10).max(2000) });

export type Recommendation = {
  summary: string;
  chapters: { n: string; reason: string }[];
};

export const recommendChapters = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<Recommendation> => {
    const { runAdvisor } = await import("./advisor.server");
    return runAdvisor(data.goals);
  });
