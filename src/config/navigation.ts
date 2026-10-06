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

export const mobileNav: MobileNavGroup[] = [
  {
    items: [
      { label: "Home", href: "/" },
      {
        label: "Locations",
        href: "/locations",
        children: [
          { label: "Old Oak", href: "/locations/old-oak" },
          { label: "Canary Wharf", href: "/waitlist?location=canary-wharf" },
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

const menuGroup = (label: string) => mobileNav.find((group) => group.label === label)?.items ?? [];

/**
 * Footer link columns. Unlike the menu, the footer has nothing else above it, so every page is
 * listed here, products included. The Collective and Initiatives reuse the menu's groups.
 */
export const footerNav: MobileNavGroup[] = [
  { label: "The Collective", items: menuGroup("The Collective") },
  {
    label: "Our Products",
    items: [
      { label: "Co-living", href: "/co-living" },
      { label: "Serviced living", href: "/serviced-living" },
      { label: "Working", href: "/working" },
      { label: "Event Spaces", href: "/event-spaces" },
    ],
  },
  { label: "Initiatives", items: menuGroup("Initiatives") },
];
