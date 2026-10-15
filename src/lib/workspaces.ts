export type Workspace = {
  n: string;
  slug: string;
  title: string;
  blurb: string;
  item: string; // singular noun for an entry
  tagLabel: string;
  tagPlaceholder: string;
  detailsPlaceholder: string;
  doneLabel: string;
};

export const WORKSPACES: Workspace[] = [
  { n: "01", slug: "planning", title: "Campaign planning", blurb: "Milestones across regions, owners and budgets.", item: "Milestone", tagLabel: "Region", tagPlaceholder: "e.g. Nairobi County", detailsPlaceholder: "Owner, budget, deadline…", doneLabel: "Reached" },
  { n: "02", slug: "volunteers", title: "Volunteer organization", blurb: "Your volunteer roster by area and skill.", item: "Volunteer", tagLabel: "Area / skill", tagPlaceholder: "e.g. Ward 4 · canvassing", detailsPlaceholder: "Phone, availability, notes…", doneLabel: "Onboarded" },
  { n: "03", slug: "community", title: "Community engagement", blurb: "Supporter groups that persist beyond the campaign.", item: "Community", tagLabel: "Group type", tagPlaceholder: "e.g. Youth, Traders", detailsPlaceholder: "Leaders, size, next touchpoint…", doneLabel: "Active" },
  { n: "04", slug: "communications", title: "Communications", blurb: "Messages drafted, approved and sent across channels.", item: "Message", tagLabel: "Channel", tagPlaceholder: "WhatsApp, SMS, Email…", detailsPlaceholder: "Message text and audience…", doneLabel: "Approved" },
  { n: "05", slug: "field", title: "Field operations", blurb: "Canvassing runs, town halls and events.", item: "Event", tagLabel: "Location", tagPlaceholder: "e.g. Kibera market", detailsPlaceholder: "Date, team, goals…", doneLabel: "Completed" },
  { n: "06", slug: "polling", title: "Polling & consultation", blurb: "Questions you're asking communities and what you heard.", item: "Poll question", tagLabel: "Audience", tagPlaceholder: "e.g. First-time voters", detailsPlaceholder: "Answers and findings…", doneLabel: "Closed" },
  { n: "07", slug: "election-day", title: "Election day", blurb: "Stations, observers and incidents in one situation room.", item: "Incident / station", tagLabel: "Station", tagPlaceholder: "e.g. Station 112", detailsPlaceholder: "What happened, who's on it…", doneLabel: "Resolved" },
  { n: "08", slug: "governance", title: "Governance transition", blurb: "Promises carried forward into delivery.", item: "Commitment", tagLabel: "Area", tagPlaceholder: "e.g. Water, Roads", detailsPlaceholder: "Plan, partners, progress…", doneLabel: "Delivered" },
];

export const byNumber = (n: string) => WORKSPACES.find((w) => w.n === n);
export const bySlug = (s: string) => WORKSPACES.find((w) => w.slug === s);
