import { Bill, DoorEntry, Plane } from "@/components/icons";
import type { ChecklistItem } from "@/components/sections/Checklist";

// Amounts from the scheme's terms (The Collective Partners LLP). TODO: confirm they're current.
export const rewardRows = [
  { who: "Old Oak members", nine: 150, twelve: 200 },
  { who: "Everyone else", nine: 100, twelve: 150 },
];

export const referralSteps: ChecklistItem[] = [
  { icon: Plane, title: "Invite friends", text: "Sign in to your account for your own link, then share it, or let us email your friends for you." },
  {
    icon: DoorEntry,
    title: "Your friend moves in",
    text: "They book a tour and move in on a membership of 9 months or more, and get up to £200 off their rent.",
  },
  {
    icon: Bill,
    title: "You get rewarded",
    text: "After their first rent payment, the same amount comes off your next month’s rent.",
  },
];

export type TermsSection = { heading: string; paragraphs?: string[]; points?: string[] };

/** The scheme's terms, tidied (the expired 2018 promotion is left out). */
export const referralTerms: TermsSection[] = [
  {
    heading: "Who runs the scheme",
    paragraphs: ["The Collective Partners LLP, 14 Bedford Square, London WC1B 3JA."],
  },
  {
    heading: "Definitions",
    points: [
      "The First Period: from the first to the fifteenth day of a month, inclusive.",
      "The Second Period: from the sixteenth to the last day of a month, inclusive.",
    ],
  },
  {
    heading: "The scheme",
    paragraphs: [
      "Subject to these terms, an individual (the Referee) is entitled to a referral fee (the Referral Fee) for recommending any building managed by The Collective (Living) Limited, trading as The Collective (a Collective Building), to another individual (the Candidate). The Candidate is also entitled to a one-off rebate on their licence fee (the Rebate).",
      "The Rebate and the Referral Fee are each:",
    ],
    points: [
      "For members of The Collective Old Oak: £150 for a licence of at least nine months, or £200 for at least twelve months.",
      "For non-members: £100 for a licence of at least nine months, or £150 for at least twelve months.",
    ],
  },
  {
    heading: "Qualifying",
    paragraphs: ["To qualify for the Referral Fee and the Rebate:"],
    points: [
      "the Referee must, with the Candidate’s consent, enter the Candidate’s email on the refer-a-friend page or in The Collective app (a Notification);",
      "we must receive the Notification before any contact between The Collective and the Candidate, or anyone acting for them;",
      "the Candidate must sign a licence agreement (or similar) for at least 9 months (the Licence Agreement); and",
      "the Candidate must pass The Collective’s standard checks for incoming members.",
    ],
  },
  {
    heading: "Payment",
    points: [
      "If the Candidate moves in during the First Period, the Rebate comes off their first rent payment; during the Second Period, off their second.",
      "A Referee living in a Collective Building has the Referral Fee taken off the rent payment due the month after the Candidate’s first full rent payment.",
      "A Referee not living in a Collective Building is paid by bank transfer to a UK bank account they’ve given us, within seven days of the Candidate’s first rent payment.",
      "We can’t pay the Referral Fee to an overseas account or in cash.",
      "If the Referee hasn’t given us their bank details within 30 days of the Licence Agreement starting, payment is at The Collective’s discretion.",
    ],
  },
  {
    heading: "Early termination",
    paragraphs: ["If the Candidate’s licence ends within its first 30 days (whoever ends it):"],
    points: [
      "any money due to the Candidate on termination is first reduced by any Rebate they’ve received; and",
      "the Referral Fee is not due to the Referee.",
    ],
  },
  {
    heading: "Changes",
    paragraphs: ["The Rebate and Referral Fee may change, and The Collective may suspend or end the scheme at any time without notice."],
  },
];
