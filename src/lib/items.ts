import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Item = { id: string; chapter: string; title: string; details: string; tag: string; done: boolean; created_at: string };

export const itemsQuery = (chapter?: string) =>
  queryOptions({
    queryKey: ["items", chapter ?? "all"],
    queryFn: async () => {
      let q = supabase.from("workspace_items").select("id, chapter, title, details, tag, done, created_at").order("created_at", { ascending: false });
      if (chapter) q = q.eq("chapter", chapter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Item[];
    },
  });
