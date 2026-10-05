import { BarKitchen, CalendarCheck, Dining, Dumbbell, HandsHeart, Plane } from "@/components/icons";
import type { ChecklistItem } from "@/components/sections/Checklist";

export const careersBenefits: ChecklistItem[] = [
  {
    icon: Dumbbell,
    title: "Fitness & health",
    text: "Wellness programmes including yoga, sound baths, running clubs, kickboxing, dance cardio, meditation and rock climbing. Get your pulse racing, or take some mental time out.",
  },
  {
    icon: BarKitchen,
    title: "Thought fuel",
    text: "Free micro-roasted coffee from a barista-serviced café. OK, you’re the barista and it comes from a machine, but same thing.",
  },
  { icon: Plane, title: "Perks", text: "Discounts on gym memberships, travel, hotels, phone plans and plenty more." },
  { icon: Dining, title: "Food & fun", text: "Free breakfast, Monday-night dinners and surprise snacks. Food is brain fuel, after all. Plus, poker nights." },
  {
    icon: CalendarCheck,
    title: "Company events",
    text: "Company events and retreats, and a nightly programme of professional, educational and social events. We preach connected communities, so we live it too.",
  },
  {
    icon: HandsHeart,
    title: "Cowabunga",
    text: "Unlimited sick days. We want everyone at their physical and mental best, not worrying about being off one too many times.",
  },
];

export type Job = {
  slug: string;
  title: string;
  location: string;
  sector: string;
  /** The role, in a paragraph or two. */
  about: string[];
  /** Headed bullet lists, e.g. "Key responsibilities", "Essential". */
  requirements: { heading: string; points: string[] }[];
  /** Role-specific benefits (the company-wide ones are on the Careers page). */
  benefits: string[];
  salary: string;
};

const london = "London, England, United Kingdom";

/** Shared "About The Collective" on every job page. */
export const aboutTheCollective = [
  "We are The Collective, a community of creative thinkers with big ambitions, curious minds and the drive to get stuff done. We’re looking for people with entrepreneurial passion who have what it takes to challenge the status quo with us.",
  "We’re disrupting the rental market in a big way. Not a traditional property company, we focus on creating a new lifestyle for our members that empowers them to live a life they never knew they could.",
  "Launching the world’s largest co-living building in 2016, we pioneered a new generation of renters who value experiences, quality and convenience. Shared spaces and a communal mindset let people live somewhere they’re proud to call home, with the convenience of serviced living, a like-minded community and events to broaden their horizons.",
];

// TODO: the real roles (the old site loaded them from Workable). Finance Associate is the design's
// full example; the others are the design's titles with placeholder details.
const comingSoon = {
  about: ["Full details for this role are coming soon. In the meantime, get in touch and we’ll tell you more."],
  requirements: [],
  benefits: [],
  salary: "Salary based on experience",
};

export const jobs: Job[] = [
  {
    slug: "finance-associate",
    title: "Finance Associate",
    location: london,
    sector: "Finance",
    about: [
      "You’ll provide the analysis and support that helps management make key business decisions. Reporting to the Finance Director, you’ll work directly with our finance and operational teams, as well as with investors and banks, gaining unparalleled insight into our business.",
      "Typical projects might include the £100m+ refinancing of portfolio properties, appraising new development projects or helping to raise equity capital.",
    ],
    requirements: [
      {
        heading: "Key responsibilities",
        points: [
          "Producing financial forecasts for individual projects and the entire business",
          "Ad hoc financial analysis such as return on investment (IRR, multiple), valuation or debt pay down",
          "Creating and updating presentations and information memorandums for our board, investors and banks",
          "Competitor and sector benchmarking and research",
          "Compiling and updating information for due diligence and investor relations",
          "Supporting the development of our business plan and strategy",
          "Liaising with design, development and operations teams to deliver the above",
          "Embodying The Collective’s core values",
        ],
      },
      {
        heading: "Essential",
        points: [
          "Degree educated, 2:1 or above",
          "Advanced financial modelling skills, with experience of financial forecasts (P&L, cash flow, balance sheet)",
          "Advanced Excel and VBA, and proficient PowerPoint",
          "Works on own initiative and is self-motivated",
          "Able to work in a fast-paced environment and prioritise work to tight timescales",
          "A good team player who’s solution-driven, with an attention to detail",
        ],
      },
    ],
    benefits: [
      "An understanding of real estate appraisal models and promotes",
      "Being part of a fast-growing and exciting company",
      "The chance to take on financial planning, investor relations and treasury duties",
      "Private healthcare",
      "Pension",
      "25 days’ holiday a year, plus bank holidays",
      "Flexi-time on specific days",
      "Significant responsibility early in your career",
      "Career progression: develop the role as the company grows",
    ],
    salary: "Salary based on experience",
  },
  { slug: "social-media-coordinator", title: "Social Media Coordinator", location: london, sector: "Marketing", ...comingSoon },
  { slug: "digital-marketing-manager", title: "Digital Marketing Manager", location: london, sector: "Marketing", ...comingSoon },
  { slug: "sales-and-community-specialist", title: "Temporary Sales and Community Specialist", location: london, sector: "Sales", ...comingSoon },
];
