import logoAsset from "@/assets/pulse-logo.asset.json";

import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Problem from "./sections/Problem";
import Concept from "./sections/Concept";
import Walkthrough from "./sections/Walkthrough";
import Advisor from "./sections/Advisor";
import MissionControl from "./sections/MissionControl";
import Ecosystem from "./sections/Ecosystem";
import Showcases from "./sections/Showcases";
import Intelligence from "./sections/Intelligence";
import Governance from "./sections/Governance";
import Closing from "./sections/Closing";
import Footer from "./sections/Footer";

export default function PulseLanding() {
  return (
    <main className="relative overflow-x-clip bg-canvas text-ink">
      <Nav logoUrl={logoAsset.url} />
      <Hero logoUrl={logoAsset.url} />
      <Problem />
      <Concept />
      <Walkthrough />
      <Advisor />
      <MissionControl />
      <Ecosystem />
      <Showcases />
      <Intelligence />
      <Governance />
      <Closing />
      <Footer logoUrl={logoAsset.url} />
    </main>
  );
}