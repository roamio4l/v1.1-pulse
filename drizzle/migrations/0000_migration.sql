CREATE TABLE public.workspace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  chapter text NOT NULL CHECK (chapter IN ('01','02','03','04','05','06','07','08')),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  details text NOT NULL DEFAULT '' CHECK (char_length(details) <= 2000),
  tag text NOT NULL DEFAULT '' CHECK (char_length(tag) <= 80),
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_items TO authenticated;
GRANT ALL ON public.workspace_items TO service_role;
ALTER TABLE public.workspace_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.workspace_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.workspace_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.workspace_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.workspace_items FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX workspace_items_user_chapter ON public.workspace_items(user_id, chapter, created_at DESC);