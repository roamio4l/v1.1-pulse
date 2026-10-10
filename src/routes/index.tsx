import { createFileRoute } from "@tanstack/react-router";
import PulseLanding from "@/components/pulse/PulseLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulse — Election Operating System" },
      { name: "description", content: "Explore Pulse, the connected election operating system from campaign planning to governance transition." },
      { property: "og:title", content: "Pulse — Election Operating System" },
      { property: "og:description", content: "Follow a campaign through eight connected Pulse workspaces, from strategy to governance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PulseLanding />;
}
