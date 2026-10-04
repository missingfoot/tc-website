export type NavLink = {
  label: string;
  href: string;
  /** Shows a dropdown chevron. Menu contents aren't wired up yet. */
  dropdown?: boolean;
};

export const mainNav: NavLink[] = [
  { label: "Co-Living", href: "#" },
  { label: "Locations", href: "#", dropdown: true },
  { label: "Mission", href: "#" },
  { label: "Working", href: "#" },
  { label: "More", href: "#", dropdown: true },
];

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

// TODO: these routes don't exist yet
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
      { label: "Co-Working", href: "/co-working" },
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
