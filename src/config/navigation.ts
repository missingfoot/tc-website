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

// TODO: most of these routes don't exist yet
export const mobileNav: MobileNavGroup[] = [
  {
    items: [
      { label: "Home", href: "/" },
      { label: "Mission", href: "/mission" },
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
    label: "The Collective",
    items: [
      { label: "Our story", href: "/our-story" },
      { label: "Press", href: "/press" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "More Products",
    items: [
      { label: "Event Spaces", href: "/event-spaces" },
      { label: "Serviced living", href: "/serviced-living" },
    ],
  },
  {
    label: "Initiatives",
    items: [
      { label: "Global accelerator", href: "/global-accelerator" },
      { label: "Foundation", href: "/foundation" },
      { label: "Labs", href: "/labs" },
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
  "/co-living": "Co-Living",
  "/working": "Working",
};
