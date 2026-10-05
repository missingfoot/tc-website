export type MobileNavItem = {
  label: string;
  href: string;
  /** Sub-links revealed by tapping the item's chevron. */
  children?: { label: string; href: string }[];
};

export type MobileNavGroup = {
  /** Small grey heading above the group. Omit for the first, unlabelled group. */
  label?: string;
  items: MobileNavItem[];
};

// TODO: Foundation, Labs and Blog don't exist yet
export const mobileNav: MobileNavGroup[] = [
  {
    items: [
      { label: "Home", href: "/" },
      {
        label: "Locations",
        href: "/locations",
        children: [
          { label: "Old Oak", href: "/locations/old-oak" },
          { label: "Canary Wharf", href: "/locations/canary-wharf" },
          { label: "Stratford", href: "/locations/stratford" },
        ],
      },
      { label: "Co-Living", href: "/co-living" },
      { label: "Working", href: "/working" },
    ],
  },
  {
    label: "More Products",
    items: [
      { label: "Serviced living", href: "/serviced-living" },
      { label: "Event spaces", href: "/event-spaces" },
    ],
  },
  {
    label: "The Collective",
    items: [
      { label: "Mission", href: "/mission" },
      { label: "FAQ", href: "/faq" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    label: "Initiatives",
    items: [
      { label: "Referrals", href: "/refer-a-friend" },
      { label: "Foundation", href: "/foundation" },
      { label: "Labs", href: "/labs" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export type NavLink = {
  label: string;
  href: string;
  /** Opens a dropdown of these groups instead of linking (each group is a column). */
  menu?: MobileNavGroup[];
};

const locations = mobileNav[0].items.find((item) => item.label === "Locations")?.children ?? [];

/** Desktop nav. Dropdowns reuse the mobile menu's data so both always list the same pages. */
export const mainNav: NavLink[] = [
  { label: "Co-Living", href: "/co-living" },
  { label: "Locations", href: "/locations", menu: [{ items: locations }] },
  { label: "Mission", href: "/mission" },
  { label: "Working", href: "/working" },
  { label: "More", href: "#", menu: mobileNav.filter((group) => group.label) },
];

/** Short page titles shown in the middle of the mobile top bar, by path. */
export const pageTitles: Record<string, string> = {
  "/": "The Collective",
  "/locations/old-oak": "Old Oak",
  "/locations/old-oak/rooms/ensuite": "Ensuite",
  "/locations/old-oak/rooms/studio": "Studio",
  "/locations/old-oak/rooms/one-bed-flat": "One Bed Flat",
  "/co-living": "Co-Living",
  "/working": "Working",
  "/mission": "Mission",
  "/faq": "FAQ",
  "/careers": "Careers",
  "/press": "Press",
  "/refer-a-friend": "Refer a friend",
  "/refer-a-friend/terms": "Referral terms",
  "/event-spaces": "Event Spaces",
  "/event-spaces/the-den": "The Den",
  "/event-spaces/the-terrace": "The Terrace",
  "/event-spaces/the-boardroom": "The Boardroom",
  "/event-spaces/the-blackroom": "The Blackroom",
  "/event-spaces/the-exchange": "The Exchange",
  "/event-spaces/the-gallery": "The Gallery",
  "/event-spaces/the-private-dining-room": "Private Dining Room",
  "/serviced-living": "Serviced Living",
  "/serviced-living/acton": "Acton",
  "/serviced-living/notting-hill": "Notting Hill",
  "/working/bedford-square": "Bedford Square",
  "/working/old-oak": "Old Oak",
  "/working/kings-cross": "Kings Cross",
  "/working/doughnut-factory": "The Doughnut Factory",
};
