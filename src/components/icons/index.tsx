import type { ReactNode, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Accessible name. Without one the icon is hidden from screen readers (decorative). */
  title?: string;
};

/**
 * Shared wrapper for the icon set: 24×24 grid, 2px square-capped stroke, coloured by
 * `currentColor`. Defaults to 24px; resize with a size class, e.g. className="size-4".
 * `large` icons are drawn on a 32×32 grid and default to 32px.
 */
function Icon({ title, className = "", large, children, ...props }: IconProps & { large?: boolean; children: ReactNode }) {
  const grid = large ? 32 : 24;
  return (
    <svg
      viewBox={`0 0 ${grid} ${grid}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={`${large ? "size-8" : "size-6"} shrink-0 ${className}`}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 12L3 12L3.5 12" />
      <path d="M10 19L3 12L10 5" />
    </Icon>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 12L21 12L20.5 12" />
      <path d="M14 19L21 12L14 5" />
    </Icon>
  );
}

/** 360° / 3D tour. */
export function Icon360(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 12C17 6.47715 14.7614 2 12 2C9.23858 2 7 6.47715 7 12C7 17.5228 9.23858 22 12 22C12.8251 22 13.6036 21.6002 14.2896 20.8923" />
      <path d="M12 7C17.5228 7 22 9.23858 22 12C22 14.7614 17.5228 17 12 17C6.47715 17 2 14.7614 2 12C2 11.1512 2.42301 10.3518 3.16938 9.65161" />
      <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" />
    </Icon>
  );
}

export function Menu(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="5" x2="22" y2="5" />
      <line x1="2" y1="19" x2="22" y2="19" />
    </Icon>
  );
}

export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="19" y1="19" x2="5" y2="5" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </Icon>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 10.5L12 14.5L8 10.5" />
    </Icon>
  );
}

/** Wash basin with tap (bathroom). */
export function Basin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 17V22H15V17" />
      <path d="M12 5H14" />
      <path d="M12 9V4C12 2.89543 11.1046 2 10 2V2C8.89543 2 8 2.89543 8 4V4" />
      <path d="M9 17L15 17C18.3137 17 21 14.3137 21 11C21 9.89543 20.1046 9 19 9L5 9C3.89543 9 3 9.89543 3 11C3 14.3137 5.68629 17 9 17Z" />
    </Icon>
  );
}

/** Steaming pan (kitchen). */
export function Hob(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 15L17.4472 14.1056C17.786 13.428 18.4785 13 19.2361 13H23" />
      <path d="M17 15H2V18C2 19.1046 2.89543 20 4 20H15C16.1046 20 17 19.1046 17 18V15Z" />
      <path d="M8.76088 4C7.65775 4.88251 7.7729 6.59446 8.98428 7.32129C10.1957 8.04812 10.3108 9.76006 9.20768 10.6426" />
      <path d="M13.7609 4C12.6577 4.88251 12.7729 6.59446 13.9843 7.32129C15.1957 8.04812 15.3108 9.76006 14.2077 10.6426" />
      <path d="M3.76088 4C2.65775 4.88251 2.7729 6.59446 3.98428 7.32129C5.19566 8.04812 5.31081 9.76006 4.20768 10.6426" />
    </Icon>
  );
}

/** Tape measure (floor area). */
export function TapeMeasure(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 19V16" />
      <path d="M13 19V16" />
      <path d="M8 19V16" />
      <path d="M13 6V9" />
      <path d="M7.5 9H23V19H6C3.79086 19 2 17.2091 2 15V6" />
      <path d="M7.5 9C10.5376 9 13 7.65685 13 6C13 4.34315 10.5376 3 7.5 3C4.46243 3 2 4.34315 2 6C2 7.65685 4.46243 9 7.5 9Z" />
    </Icon>
  );
}

/** Bed (room type). */
export function Bed(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 18H22" />
      <path d="M4 9L4 6C4 4.89543 4.89543 4 6 4L18 4C19.1046 4 20 4.89543 20 6L20 9" />
      <path d="M10 8L8 8L8 9L10 9L10 8Z" />
      <path d="M16 8L14 8L14 9L16 9L16 8Z" />
      <path d="M2 20L2 15C2 13.8954 2.89543 13 4 13L20 13C21.1046 13 22 13.8954 22 15L22 20" />
    </Icon>
  );
}

/** Receipt (all-inclusive bills). */
export function Bill(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 18.5L21 3L7 3L7 16" />
      <path d="M13 18.5V21H2V18C2 16.8954 2.89543 16 4 16H15H14" />
      <path d="M11 11H17" />
      <path d="M11 7H13" />
      <path d="M21 19C21 20.1046 20.1046 21 19 21C17.8954 21 17 20.1046 17 19L17 18C17 16.8954 16.1046 16 15 16C13.8954 16 13 16.8954 13 18" />
    </Icon>
  );
}

/** Spanner and screwdriver (maintenance). */
export function Wrench(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="10.376" y1="10.376" x2="7" y2="7" strokeLinecap="butt" />
      <polygon points="7 7 4 7 2 4 4 2 7 4 7 7" />
      <path d="m14.357,17.893l3.375,3.375c.976.976,2.559.976,3.536,0s.976-2.559,0-3.536l-1.76-1.76" />
      <path d="m11.373,9.479l-8.437,7.593c-1.204,1.083-1.253,2.955-.108,4.1,1.156,1.156,3.049,1.093,4.126-.136l7.413-8.465" strokeLinecap="butt" />
      <path d="m18.164,8.664l-2.828-2.828,3.372-3.372c-.676-.297-1.422-.464-2.207-.464-3.038,0-5.5,2.462-5.5,5.5s2.462,5.5,5.5,5.5,5.5-2.462,5.5-5.5c0-.786-.167-1.531-.464-2.207l-3.372,3.372Z" />
    </Icon>
  );
}

/** Spray bottle (cleaning). */
export function SprayBottle(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.82086 10L10.6915 7.32771C10.8352 7.12232 11.0702 7 11.3209 7V7" />
      <path d="M19 7L16 7L9.36153 16.4835C9.12622 16.8197 9 17.2201 9 17.6304L9 20C9 21.1046 9.89543 22 11 22L17 22C18.1046 22 19 21.1046 19 20L19 7Z" />
      <path d="M9 2L9 7L19.5 7C19.7761 7 20 6.77614 20 6.5C20 4.01472 17.9853 2 15.5 2L9 2Z" />
      <path d="M3.5 4.5C3.5 3.80964 4.05964 3.25 4.75 3.25C5.44036 3.25 6 3.80964 6 4.5C6 5.19036 5.44036 5.75 4.75 5.75C4.05964 5.75 3.5 5.19036 3.5 4.5Z" fill="currentColor" stroke="none" fillRule="evenodd" />
      <path d="M0 1.75C0 1.05964 0.559644 0.5 1.25 0.5C1.94036 0.5 2.5 1.05964 2.5 1.75C2.5 2.44036 1.94036 3 1.25 3C0.559644 3 0 2.44036 0 1.75Z" fill="currentColor" stroke="none" fillRule="evenodd" />
      <path d="M0 7.25C0 6.55964 0.559644 6 1.25 6C1.94036 6 2.5 6.55964 2.5 7.25C2.5 7.94036 1.94036 8.5 1.25 8.5C0.559644 8.5 0 7.94036 0 7.25Z" fill="currentColor" stroke="none" fillRule="evenodd" />
    </Icon>
  );
}

/** Router with signal (wifi). */
export function Router(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.92893 4.92892C8.83418 1.02367 15.1658 1.02367 19.0711 4.92892" />
      <path d="M7.75736 7.75735C10.1005 5.4142 13.8995 5.4142 16.2426 7.75735" />
      <path d="M10.5858 10.5858C11.3668 9.80473 12.6332 9.80473 13.4142 10.5858L12 12L10.5858 10.5858Z" />
      <path d="M18 20C18.5523 20 19 19.5523 19 19C19 18.4477 18.5523 18 18 18C17.4477 18 17 18.4477 17 19C17 19.5523 17.4477 20 18 20Z" fill="currentColor" stroke="none" />
      <path d="M14 20C14.5523 20 15 19.5523 15 19C15 18.4477 14.5523 18 14 18C13.4477 18 13 18.4477 13 19C13 19.5523 13.4477 20 14 20Z" fill="currentColor" stroke="none" />
      <path d="M20.5 16H3.5C2.67157 16 2 16.6716 2 17.5V20.5C2 21.3284 2.67157 22 3.5 22H20.5C21.3284 22 22 21.3284 22 20.5V17.5C22 16.6716 21.3284 16 20.5 16Z" />
    </Icon>
  );
}

/** Plane taking off (outings). */
export function Plane(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.26036 8.92725L19.8951 5.57936C20.909 5.31068 21.9563 5.8808 22.281 6.87825C22.6321 7.95663 22.0058 9.10864 20.9099 9.40037L16.362 10.611L14.1509 17L11.5 17L12.0153 11.7757L7.57823 12.9646C6.76326 13.183 5.89891 12.8664 5.41773 12.1734L2.37994 7.79797L4.868 7.1313L7.26036 8.92725Z" />
      <path d="M9.10057 5.33963L7.82896 3.56565L10.1246 2.24024L12.6136 4.39701" />
      <path d="M2 21H22" />
    </Icon>
  );
}

/** Hands holding a heart (clubs). */
export function HandsHeart(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 23V22.0744L22.278 15.9174C22.7441 15.3735 23.0002 14.6807 23 13.9644L22.5842 6.50937C22.537 5.66251 21.8365 5 20.9883 5V5C20.1497 5 19.4537 5.64806 19.394 6.4845L19 12L19.0149 11.792" />
      <path d="M7 23V22.0744L1.722 15.9174C1.25589 15.3735 0.999787 14.6807 1 13.9644L1.41581 6.50937C1.46305 5.66251 2.16354 5 3.01172 5V5C3.85029 5 4.54629 5.64806 4.60604 6.4845L5 12L4.97487 11.6482" />
      <path d="M12 22L12 18.3419C12 16.858 11.3409 15.4507 10.2009 14.5008L7.07886 11.899C6.46784 11.3899 5.56938 11.4306 5.00697 11.993V11.993C4.43876 12.5612 4.40382 13.4711 4.92677 14.0812L7 16.5" />
      <path d="M12 22L12 18.3419C12 16.858 12.6591 15.4507 13.7991 14.5008L16.9211 11.899C17.5322 11.3899 18.4306 11.4306 18.993 11.993V11.993C19.5612 12.5612 19.5962 13.4711 19.0732 14.0812L17 16.5" />
      <path d="M16.5 3.42502C16.5 5.71498 12.9983 8.04887 12 8.5C11.0017 8.04887 7.5 5.71498 7.5 3.42502C7.5 2.08549 8.58525 1 9.92325 1C10.7669 1 11.4078 1.50711 11.9308 2.09607H12.0692C12.5922 1.50711 13.2331 1 14.0767 1C15.4148 1 16.5 2.08549 16.5 3.42502Z" strokeLinecap="butt" />
    </Icon>
  );
}

/** Two people (networking). */
export function People(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5,7c1.105,0,2-.895,2-2s-.895-2-2-2-2,.895-2,2,.895,2,2,2Z" strokeLinecap="butt" />
      <path d="m19.5,7c-1.105,0-2-.895-2-2s.895-2,2-2,2,.895,2,2-.895,2-2,2Z" strokeLinecap="butt" />
      <path d="m7,17l-.5,4H2.5l-.405-8.909c-.052-1.139.858-2.091,1.998-2.091h.671c.758,0,1.45.428,1.789,1.106l1.171,2.342c.169.339.516.553.894.553h1.382" />
      <path d="m17,17l.5,4h4l.405-8.909c.052-1.139-.858-2.091-1.998-2.091h-.671c-.758,0-1.45.428-1.789,1.106l-1.171,2.342c-.169.339-.516.553-.894.553h-1.382" />
    </Icon>
  );
}

/** Calendar with a tick (events). */
export function CalendarCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="2" y1="9" x2="22" y2="9" strokeLinecap="butt" />
      <line x1="7" y1="1" x2="7" y2="4" />
      <line x1="17" y1="1" x2="17" y2="4" />
      <path d="m17.657,20h2.343c1.105,0,2-.896,2-2V6c0-1.105-.895-2-2-2H4c-1.105,0-2,.895-2,2v12c0,1.104.895,2,2,2h.143" />
      <polyline points="8 19 10.5 21.5 17 15" />
    </Icon>
  );
}

/** Two people with a speech bubble (community team). */
export function TeamChat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m20,1h-8c-.552,0-1,.448-1,1v7.5l3-2.5h6c.552,0,1-.448,1-1V2c0-.552-.448-1-1-1Z" />
      <path d="m5.5,18h0c-2.485,0-4.5,2.015-4.5,4.5v.5h9v-.5c0-2.485-2.015-4.5-4.5-4.5Z" />
      <circle cx="5.5" cy="12.5" r="2.5" />
      <path d="m18.5,18h0c-2.485,0-4.5,2.015-4.5,4.5v.5h9v-.5c0-2.485-2.015-4.5-4.5-4.5Z" />
      <circle cx="18.5" cy="12.5" r="2.5" />
    </Icon>
  );
}

/** Shelving unit (furnished room). */
export function Shelves(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 11V7H11V11" strokeLinecap="butt" />
      <path d="M13 19V15H7V19" strokeLinecap="butt" />
      <path d="M3 11H21" strokeLinecap="butt" />
      <path d="M3 19H21" strokeLinecap="butt" />
      <path d="M3 21L3 5C3 3.89543 3.89543 3 5 3L19 3C20.1046 3 21 3.89543 21 5L21 21" />
    </Icon>
  );
}

/** Sofa (communal spaces). */
export function Sofa(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5V10" />
      <path d="M4 10L4 7C4 5.89543 4.89543 5 6 5L18 5C19.1046 5 20 5.89543 20 7L20 10" strokeLinecap="butt" />
      <path d="M5 19V21" />
      <path d="M19 19V21" />
      <path d="M4 19L20 19C21.1046 19 22 18.1046 22 17L22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12L18 14L6 14L6 12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12L2 17C2 18.1046 2.89543 19 4 19Z" />
    </Icon>
  );
}

/** Washing machine (laundry). */
export function WashingMachine(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 2L6.00001 2C4.89544 2 4.00001 2.89543 4.00001 4L4.00001 20C4.00001 21.1046 4.89544 22 6.00001 22L18 22C19.1046 22 20 21.1046 20 20L20 4C20 2.89543 19.1046 2 18 2Z" />
      <path d="M12 18C14.2091 18 16 16.2091 16 14C16 11.7909 14.2091 10 12 10C9.79086 10 8 11.7909 8 14C8 16.2091 9.79086 18 12 18Z" />
      <path d="M10 6L8 6" />
      <path d="M16 6L15.99 6" />
    </Icon>
  );
}

/** Spoon and knife (dining room). */
export function Dining(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 22V2H19C16.7909 2 15 3.79086 15 6V15H19.5" />
      <path d="M7 22V11V11.5" />
      <path d="M3 6.5C3 4.01472 4.79086 2 7 2C9.20914 2 11 4.01472 11 6.5C11 8.98528 9.20914 11 7 11C4.79086 11 3 8.98528 3 6.5Z" />
    </Icon>
  );
}

/** Oven (shared kitchen). */
export function Oven(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 7L15 7" />
      <path d="M7.01001 7L7.00001 7" />
      <path d="M19 3L5 3C3.89543 3 3 3.89543 3 5L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 5C21 3.89543 20.1046 3 19 3Z" />
      <path d="M17 11L7 11L7 17L17 17L17 11Z" />
    </Icon>
  );
}

/** Chef (restaurant). */
export function Chef(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.3127 17.6561L9.9849 22.0959C9.89742 22.1688 9.98033 22.3079 10.0861 22.2656L12 21.5L13.9139 22.2656C14.0196 22.3079 14.1025 22.1688 14.0151 22.0959L8.68726 17.6561" strokeLinecap="butt" />
      <path d="M22 22.0001V22.0001C22 20.8057 21.2357 19.7453 20.1026 19.3676L15.8675 17.9559C15.0509 17.6837 14.5 16.9194 14.5 16.0585V15.2734C15.6023 14.5724 16.3973 13.4177 16.6082 12.0466L16.8477 10.8868L16.8906 10.0469" />
      <path d="M2 22V22C2 20.8057 2.76428 19.7453 3.89737 19.3676L8.13246 17.9559C8.94914 17.6837 9.5 16.9194 9.5 16.0585V15.2733C8.39767 14.5724 7.60271 13.4177 7.39177 12.0466L7.12311 10.8712L7.08661 9.98474" />
      <path d="M16.8949 10H7.08403L7 7.94999C5.85888 7.71836 5 6.70948 5 5.5C5 4.11929 6.11929 3 7.5 3C8.31791 3 9.04408 3.39278 9.50018 4H9.55001C9.51721 3.83844 9.5 3.67123 9.5 3.5C9.5 2.11929 10.6193 1 12 1C13.3807 1 14.5 2.11929 14.5 3.5C14.5 3.67115 14.4828 3.83828 14.45 3.99976H14.5C14.9561 3.39267 15.6822 3 16.5 3C17.8807 3 19 4.11929 19 5.5C19 6.70948 18.1411 7.71836 17 7.94999L16.8949 10Z" strokeLinecap="butt" />
    </Icon>
  );
}

/** Bench, tree and sun (outdoor space). */
export function Outdoor(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M1 20H14" />
      <path d="M4 20V22" />
      <path d="M11 20V22" />
      <path d="M19 22V13" />
      <path d="M12 15H3V20H12V15Z" />
      <path d="M19 16C21.2091 16 23 13.9107 23 11.3333C23 7 19 2 19 2C19 2 15 7 15 11.3333C15 13.9107 16.7909 16 19 16Z" />
      <path d="M10 2C10 3.65685 8.65685 5 7 5C5.34315 5 4 3.65685 4 2" />
      <path d="M7 7.90001V8.00001" />
      <path d="M1.10001 2L1.00001 2" />
      <path d="M13 1.99998L12.9 1.99998" />
      <path d="M2.76071 6.24265L2.69 6.31336" />
      <path d="M11.3167 6.31335L11.246 6.24264" />
    </Icon>
  );
}

/** Cocktail glass (event spaces). */
export function Cocktail(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 9.5H15" strokeLinecap="butt" />
      <path d="M14 5C14 2.79086 15.7909 1 18 1C20.2091 1 22 2.79086 22 5C22 7.20914 20.2091 9 18 9C17.2016 9 16.4578 8.76608 15.8335 8.36303" strokeLinecap="butt" />
      <path d="M18 5H4V5.5L11 15L18 5.5V5Z" strokeLinecap="butt" />
      <path d="M11 15V22" />
      <path d="M8 22H14" />
    </Icon>
  );
}

/** Basket of produce (grocery store). */
export function Groceries(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18.5 7H20.2693H19.9698" />
      <path d="M14 17L10 17" />
      <path d="M22 12H2V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V12Z" />
      <path d="M10.5 0V0.833333C10.5 1.27536 10.2366 1.69928 9.76777 2.01184C9.29893 2.32441 8.66304 2.5 8 2.5V1.66667C8 1.22464 8.26339 0.800716 8.73223 0.488155C9.20107 0.175595 9.83696 0 10.5 0Z" fill="currentColor" stroke="none" />
      <path d="M20.2311 8H20.1555C20.5185 4.75056 20.1436 2.09136 18.9683 1.77646C17.6138 1.4135 15.6227 4.27925 14.2556 8H13.4192C13.596 6.94247 13.4382 5.97043 12.9857 5.31846C12.4085 4.48647 11.4974 4 10.6411 4C9.76925 4 9.22118 4.44723 8.50001 4.44723C7.77885 4.44723 7.21079 4.00078 6.33892 4.00078C5.48264 4.00078 4.57159 4.48726 3.99434 5.31924C3.54191 5.97105 3.38413 6.94277 3.56072 8H3.50466" />
    </Icon>
  );
}

/** Dumbbell (gym). */
export function Dumbbell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.50159 21.5014L4.47608 19.527L4.33852 19.6645" />
      <path d="M21.5017 2.50157L19.5453 4.45798L19.658 4.34527" />
      <path d="M13.9481 10.055L10.0712 13.9319" />
      <path d="M4.42975 13.9303L2.30843 16.0516C1.9179 16.4422 1.9179 17.0753 2.30843 17.4659L4.42975 19.5872L6.55107 21.7085C6.94159 22.099 7.57476 22.099 7.96528 21.7085L10.0866 19.5872" strokeLinecap="butt" />
      <path d="M13.9276 4.41881L16.0489 2.29749C16.4394 1.90696 17.0726 1.90696 17.4631 2.29749L21.7057 6.54013C22.0963 6.93065 22.0963 7.56382 21.7057 7.95434L19.5844 10.0757" strokeLinecap="butt" />
      <path d="M3.01556 12.5161L11.1473 20.6478" />
      <path d="M12.5134 3.00456L20.6451 11.1363" />
    </Icon>
  );
}

/** Hand at a door (secure entry). */
export function DoorEntry(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18.5 6.5L21.1815 14.9915C21.3903 15.6525 21.4236 16.3564 21.2784 17.0341L20 23L20.1929 22.0999" />
      <path d="M7 1L7 17" />
      <path d="M8 17L5 17C3.89543 17 3 16.1046 3 15L3 3C3 1.89543 3.89543 1 5 1L14 1C15.1046 1 16 1.89543 16 3L16 12" />
      <path d="M17 17.4L17 12L16.5 12C14.8431 12 13.5 13.3431 13.5 15L13.5 16.5L12.7564 17.4915C12.2654 18.1461 12 18.9423 12 19.7606V19.7606C12 20.8646 12.4824 21.9135 13.3206 22.632L13.75 23L13.5 22.8333" />
      <path d="M11 23H22" />
      <path d="M12 5L12 7" />
    </Icon>
  );
}

/** Bicycle (bike storage). */
export function Bike(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="19" cy="16" r="4" strokeLinecap="butt" />
      <circle cx="5" cy="16" r="4" strokeLinecap="butt" />
      <path d="M5 15.5L6.5 9H17.5H16.5" />
      <path d="M19 15.5L16.3462 4H14" />
      <path d="M9 6H5" />
      <path d="M16 4H20C21.1046 4 22 4.89543 22 6C22 6.90474 21.3993 7.66917 20.5749 7.91614" />
    </Icon>
  );
}

/** Security guard. */
export function Guard(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 19V17.866L18.3208 17.1821L17.5099 17.995" strokeLinecap="butt" />
      <path d="M3.5 19V17.866L5.67915 17.1821L6.48793 17.9878" strokeLinecap="butt" />
      <path d="M13.5 22L17.3735 18.1297L17.4556 18.0472L13.5234 22H13.5Z" />
      <path d="M22 22V21.6623C22 20.371 21.1737 19.2246 19.9487 18.8162L15.8675 17.4558C15.0509 17.1836 14.5 16.4193 14.5 15.5585V14.7733C15.6023 14.0723 16.3973 12.9176 16.6082 11.5465L17 9.0887V8.5" />
      <path d="M10.5 5.5C10.5 4.67157 11.1716 4 12 4C12.8284 4 13.5 4.67157 13.5 5.5C13.5 6.32843 12.8284 7 12 7C11.1716 7 10.5 6.32843 10.5 5.5Z" fill="currentColor" stroke="none" />
      <path d="M2 22V21.6623C2 20.371 2.82629 19.2246 4.05132 18.8162L8.13246 17.4558C8.94914 17.1836 9.5 16.4193 9.5 15.5585V14.7733C8.39767 14.0723 7.60271 12.9176 7.39177 11.5465L7 9.0849L7 8.5" />
      <path d="M17 7.5V8.5L15.7139 9.01444C13.3298 9.96808 10.6702 9.96808 8.28609 9.01444L7 8.5V7.5L5.63221 5.43319C5.3641 4.96775 5.51899 4.33506 5.95927 4.10234L7.57148 3.51788C8.51933 3.17426 9.41543 2.70196 10.2346 2.11424L11.6728 1.0825C11.8803 0.972501 12.1185 0.972501 12.3269 1.0825L13.7658 2.11464C14.5847 2.70209 15.4805 3.17421 16.428 3.51774L18.0404 4.10234C18.4807 4.33506 18.6363 4.96775 18.3674 5.43319L17 7.5Z" />
    </Icon>
  );
}

/** Security camera (CCTV). */
export function Cctv(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.93185 9.07294L2 9.59058L3.2941 14.4202L5.22595 13.9026" />
      <path d="M21.6467 9.50267L20.3526 4.67304C20.0667 3.60611 18.97 2.97294 17.9031 3.25882L3.41422 7.14111L5.74359 15.8344L20.2325 11.9522C21.2994 11.6663 21.9326 10.5696 21.6467 9.50267Z" />
      <path d="M8.94289 11.3537C9.60973 11.1751 10.0055 10.4896 9.82678 9.82281C9.6481 9.15598 8.96268 8.76025 8.29585 8.93893C7.62901 9.1176 7.23329 9.80303 7.41196 10.4699C7.59064 11.1367 8.27606 11.5324 8.94289 11.3537Z" fill="currentColor" stroke="none" />
      <path d="M14.2203 17.7442L15 20H21" />
    </Icon>
  );
}

/** Solid play triangle. */
export function Play(props: IconProps) {
  return (
    <Icon {...props}>
      <path fillRule="evenodd" d="M5 21.7232L22.0156 12L5 2.27685L5 21.7232Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Train front (Overground). */
export function Train(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.5 21H18.5" strokeLinecap="butt" />
      <path d="M4 9H20" />
      <path d="M17.25 13.25C17.25 13.9404 16.6904 14.5 16 14.5C15.3096 14.5 14.75 13.9404 14.75 13.25C14.75 12.5596 15.3096 12 16 12C16.6904 12 17.25 12.5596 17.25 13.25Z" fill="currentColor" stroke="none" />
      <path d="M9.5 13.25C9.5 13.9404 8.94036 14.5 8.25 14.5C7.55964 14.5 7 13.9404 7 13.25C7 12.5596 7.55964 12 8.25 12C8.94036 12 9.5 12.5596 9.5 13.25Z" fill="currentColor" stroke="none" />
      <path d="M5 22.5L7 17H7.5" />
      <path d="M19 22.5L17 17H16.5" />
      <path d="M0.999995 9L1.00002 8" />
      <path d="M23 9L23 8" />
      <path d="M20 17V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4V17H20Z" strokeLinecap="butt" />
    </Icon>
  );
}

/** Bus front. */
export function Bus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 4H14" />
      <path d="M18 15H21" />
      <path d="M3 15H6" />
      <path d="M21 20V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V20C3 20.5523 3.44772 21 4 21H6C6.55228 21 7 20.5523 7 20V19H17V20C17 20.5523 17.4477 21 18 21H20C20.5523 21 21 20.5523 21 20Z" strokeLinecap="butt" />
      <path d="M3 11H21" />
    </Icon>
  );
}

/** Car front. */
export function Car(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 19V12.3541C22 11.5363 21.5021 10.8008 20.7428 10.4971L19.5 10L18.4276 6.4253C18.1738 5.57934 17.3952 5 16.5119 5H7.48806C6.60485 5 5.8262 5.57934 5.57241 6.4253L4.5 10L3.25722 10.4971C2.4979 10.8008 2 11.5363 2 12.3541V19C2 19.5523 2.44772 20 3 20H5C5.55228 20 6 19.5523 6 19V18H18V19C18 19.5523 18.4477 20 19 20H21C21.5523 20 22 19.5523 22 19Z" strokeLinecap="butt" />
      <path d="M23 8H22.99" />
      <path d="M1.00999 8H0.999995" />
      <path d="M7.5 13.75C7.5 14.4404 6.94036 15 6.25 15C5.55964 15 5 14.4404 5 13.75C5 13.0596 5.55964 12.5 6.25 12.5C6.94036 12.5 7.5 13.0596 7.5 13.75Z" fill="currentColor" stroke="none" />
      <path d="M19 13.75C19 14.4404 18.4404 15 17.75 15C17.0596 15 16.5 14.4404 16.5 13.75C16.5 13.0596 17.0596 12.5 17.75 12.5C18.4404 12.5 19 13.0596 19 13.75Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** London Underground roundel (24 × 20, filled). */
export function Roundel({ className = "", ...props }: IconProps) {
  return (
    <Icon viewBox="0 0 24 20" className={`h-5 w-6 ${className}`} {...props}>
      <path
        fill="currentColor"
        stroke="none"
        d="M20.7744 8L19.7992 8.22135L19.976 9H20.7744V8ZM23 8H24V7H23V8ZM23 12V13H24V12H23ZM20.7744 12V11H19.976L19.7992 11.7787L20.7744 12ZM3.22559 12L4.20078 11.7787L4.02404 11H3.22559V12ZM1 12H0V13H1V12ZM1 8V7H0V8H1ZM3.22559 8V9H4.02404L4.20078 8.22135L3.22559 8ZM7.41699 12V11H5.88866L6.50067 12.4004L7.41699 12ZM16.583 12L17.4993 12.4004L18.1113 11H16.583V12ZM7.41699 8L6.50067 7.59956L5.88866 9H7.41699V8ZM16.583 8V9H18.1113L17.4993 7.59956L16.583 8ZM12 1V2C15.8054 2 18.9906 4.65869 19.7992 8.22135L20.7744 8L21.7496 7.77865C20.7389 3.32592 16.7605 0 12 0V1ZM20.7744 8V9H23V8V7H20.7744V8ZM23 8H22V12H23H24V8H23ZM23 12V11H20.7744V12V13H23V12ZM20.7744 12L19.7992 11.7787C18.9906 15.3413 15.8054 18 12 18V19V20C16.7605 20 20.7389 16.6741 21.7496 12.2213L20.7744 12ZM12 19V18C8.19459 18 5.00943 15.3413 4.20078 11.7787L3.22559 12L2.25039 12.2213C3.26107 16.6741 7.23945 20 12 20V19ZM3.22559 12V11H1V12V13H3.22559V12ZM1 12H2V8H1H0V12H1ZM1 8V9H3.22559V8V7H1V8ZM3.22559 8L4.20078 8.22135C5.00943 4.65869 8.19459 2 12 2V1V0C7.23945 0 3.26107 3.32592 2.25039 7.77865L3.22559 8ZM7.41699 12L6.50067 12.4004C7.42559 14.5169 9.53792 16 12 16V15V14C10.3617 14 8.95166 13.0145 8.33331 11.5996L7.41699 12ZM12 15V16C14.4621 16 16.5744 14.5169 17.4993 12.4004L16.583 12L15.6667 11.5996C15.0483 13.0145 13.6383 14 12 14V15ZM16.583 12V11H7.41699V12V13H16.583V12ZM12 5V4C9.53792 4 7.42559 5.48307 6.50067 7.59956L7.41699 8L8.33331 8.40044C8.95166 6.98549 10.3617 6 12 6V5ZM7.41699 8V9H16.583V8V7H7.41699V8ZM16.583 8L17.4993 7.59956C16.5744 5.48307 14.4621 4 12 4V5V6C13.6383 6 15.0483 6.98549 15.6667 8.40044L16.583 8Z"
      />
    </Icon>
  );
}

// Brand marks: solid shapes on their own grids, so they use a plain filled <svg> rather than
// the outline Icon wrapper. Sized like the other icons (24px by default).
function BrandIcon({ viewBox, title, className = "", children }: { viewBox: string; title?: string; className?: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} className={`size-6 shrink-0 ${className}`}>
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export function YouTube(props: Pick<IconProps, "title" | "className">) {
  return (
    <BrandIcon viewBox="0 0 32 32" {...props}>
      <path d="M31.331,8.248c-.368-1.386-1.452-2.477-2.829-2.848-2.496-.673-12.502-.673-12.502-.673,0,0-10.007,0-12.502,.673-1.377,.37-2.461,1.462-2.829,2.848-.669,2.512-.669,7.752-.669,7.752,0,0,0,5.241,.669,7.752,.368,1.386,1.452,2.477,2.829,2.847,2.496,.673,12.502,.673,12.502,.673,0,0,10.007,0,12.502-.673,1.377-.37,2.461-1.462,2.829-2.847,.669-2.512,.669-7.752,.669-7.752,0,0,0-5.24-.669-7.752ZM12.727,20.758V11.242l8.364,4.758-8.364,4.758Z" />
    </BrandIcon>
  );
}

export function Facebook(props: Pick<IconProps, "title" | "className">) {
  return (
    <BrandIcon viewBox="0 0 32 32" {...props}>
      <path d="M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z" />
    </BrandIcon>
  );
}

export function Instagram(props: Pick<IconProps, "title" | "className">) {
  return (
    <BrandIcon viewBox="0 0 32 32" {...props}>
      <path d="M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0" />
    </BrandIcon>
  );
}

export function Twitter(props: Pick<IconProps, "title" | "className">) {
  return (
    <BrandIcon viewBox="0 0 24 24" {...props}>
      <path d="M24 4.3C23.1 4.7 22.2 5 21.2 5.1C22.2 4.5 23 3.5 23.4 2.4C22.4 3 21.4 3.4 20.3 3.6C19.4 2.6 18.1 2 16.7 2C14 2 11.8 4.2 11.8 6.9C11.8 7.3 11.8 7.7 11.9 8C7.7 7.8 4.1 5.8 1.7 2.8C1.2 3.6 1 4.4 1 5.3C1 7 1.9 8.5 3.2 9.4C2.4 9.4 1.6 9.2 1 8.8C1 8.8 1 8.8 1 8.9C1 11.3 2.7 13.3 4.9 13.7C4.5 13.8 4.1 13.9 3.6 13.9C3.3 13.9 3 13.9 2.7 13.8C3.3 15.8 5.1 17.2 7.3 17.2C5.6 18.5 3.5 19.3 1.2 19.3C0.8 19.3 0.4 19.3 0 19.2C2.2 20.6 4.8 21.4 7.5 21.4C16.6 21.4 21.5 13.9 21.5 7.4C21.5 7.2 21.5 7 21.5 6.8C22.5 6.1 23.3 5.2 24 4.3Z" />
    </BrandIcon>
  );
}

/** Solid envelope (email). TODO: placeholder drawn to match; swap for the design's icon. */
export function Mail(props: Pick<IconProps, "title" | "className">) {
  return (
    <BrandIcon viewBox="0 0 24 24" {...props}>
      <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v.4l-10 5.6L2 6.9v-.4Z" />
      <path d="M2 9.2l10 5.6 10-5.6v8.3a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5V9.2Z" />
    </BrandIcon>
  );
}

/** Opening quotation mark (filled), for pull quotes. */
export function QuoteMark({ className = "", title }: Pick<IconProps, "title" | "className">) {
  return (
    <BrandIcon viewBox="0 0 32 24" title={title} className={className}>
      <path d="M0 24V14.4C0 6.6 4.2 1.8 12.6 0l1.6 3.3C9.7 4.6 7.5 7.2 7.2 10.8H13V24H0Zm18 0V14.4C18 6.6 22.2 1.8 30.6 0l1.6 3.3c-4.5 1.3-6.7 3.9-7 7.5H31V24H18Z" />
    </BrandIcon>
  );
}

/** Cup under a cloud of steam (bar & kitchen). */
export function BarKitchen(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 12H22V15C22 16.6569 20.6569 18 19 18H18" strokeLinecap="butt" />
      <path d="M18 10.5V20C18 21.1046 17.1046 22 16 22H6C4.89543 22 4 21.1046 4 20L4 10.5" strokeLinecap="butt" />
      <path d="M11 1C13.9 1 16.2 3.2 16.5 6C18 6 19.1 7.3 19 8.8C18.9 10.1 17.7 11 16.4 11H12V15C12 16.1046 11.1046 17 9.99999 17C8.89542 17 7.99999 16.1046 7.99999 15V11H5.59999C4.29999 11 3.09999 10.1 2.99999 8.8C2.89999 7.3 3.99999 6 5.49999 6C5.79999 3.2 8.09999 1 11 1Z" />
    </Icon>
  );
}

/** Door with a key card (private offices). */
export function PrivateOffice(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 15.5V17" />
      <path d="M14 7L14 5C14 3.89543 13.1046 3 12 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L12 21C13.1046 21 14 20.1046 14 19L14 11" />
      <path d="M11 11L20 11C21.1046 11 22 10.1046 22 9C22 7.89543 21.1046 7 20 7L11 7C9.89543 7 9 7.89543 9 9C9 10.1046 9.89543 11 11 11Z" />
      <path d="M8 15C8 14.1716 8.67157 13.5 9.5 13.5C10.3284 13.5 11 14.1716 11 15C11 15.8284 10.3284 16.5 9.5 16.5C8.67157 16.5 8 15.8284 8 15Z" fill="currentColor" stroke="none" fillRule="evenodd" />
    </Icon>
  );
}

/** Desk (hot desking). */
export function Desk(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 20L3 12" />
      <path d="M21 12L21 20" />
      <path d="M17 12L17 17" />
      <path d="M7 12L7 17" />
      <path d="M19 4L5 4L2 8L2 12L22 12L22 8L19 4Z" />
      <path d="M2 8H22" strokeLinecap="butt" />
    </Icon>
  );
}

/** Fork and knife (kitchen / restaurant). */
export function Restaurant(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 22V2H19C16.7909 2 15 3.79086 15 6V15H19.5" />
      <path d="M7 2V22" />
      <path d="M3 2V7.5C3 8.88071 4.11929 10 5.5 10H8.5C9.88071 10 11 8.88071 11 7.5V2" />
    </Icon>
  );
}

/** Shopfront with a map pin (restaurants nearby). */
export function RestaurantsNearby(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14V19C4 20.1046 4.89543 21 6 21H12" />
      <path d="M9.5 21V15H11" />
      <path d="M21.874 7L19 3H5.00001L2.12601 7C2.57001 8.725 4.13601 10 6.00001 10C7.20201 10 8.26701 9.459 9.00001 8.62C9.73301 9.459 10.798 10 12 10C13.202 10 14.267 9.459 15 8.62C15.733 9.459 16.798 10 18 10C19.864 10 21.43 8.725 21.874 7Z" />
      <path d="M19 22.75C21.328 21.094 23 19.209 23 17C23 14.791 21.209 13 19 13C16.791 13 15 14.791 15 17C15 19.209 16.672 21.094 19 22.75Z" />
      <path d="M19 18C19.5523 18 20 17.5523 20 17C20 16.4477 19.5523 16 19 16C18.4477 16 18 16.4477 18 17C18 17.5523 18.4477 18 19 18Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Bowl of fruit (fruits & snacks). */
export function FruitBowl(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18.5 7H20.2693H19.9698" />
      <path d="M14 17L10 17" />
      <path d="M22 12H2V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V12Z" />
      <path d="M10.5 0V0.833333C10.5 1.27536 10.2366 1.69928 9.76777 2.01184C9.29893 2.32441 8.66304 2.5 8 2.5V1.66667C8 1.22464 8.26339 0.800716 8.73223 0.488155C9.20107 0.175595 9.83696 0 10.5 0Z" fill="currentColor" stroke="none" />
      <path d="M20.2311 8H20.1555C20.5185 4.75056 20.1436 2.09136 18.9683 1.77646C17.6138 1.4135 15.6227 4.27925 14.2556 8H13.4192C13.596 6.94247 13.4382 5.97043 12.9857 5.31846C12.4085 4.48647 11.4974 4 10.6411 4C9.76925 4 9.22118 4.44723 8.50001 4.44723C7.77885 4.44723 7.21079 4.00078 6.33892 4.00078C5.48264 4.00078 4.57159 4.48726 3.99434 5.31924C3.54191 5.97105 3.38413 6.94277 3.56072 8H3.50466" />
    </Icon>
  );
}

/** Padlock (lockers). */
export function Padlock(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 5C16 2.791 14.209 1 12 1C9.791 1 8 2.791 8 5V10" />
      <rect x="3" y="10" width="18" height="12" rx="2" />
      <line x1="12" y1="15" x2="12" y2="18" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </Icon>
  );
}

/** Sun behind a cloud (roof terrace). */
export function SunCloud(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 3V1" />
      <path d="M21 7L23 7" />
      <path d="M19.8284 4.1716L21.2426 2.75739" />
      <path d="M12.7574 2.75739L14.1716 4.1716L14.6199 3.78485C15.285 3.29171 16.1084 3.00003 17 3.00003C19.2091 3.00003 21 4.79089 21 7.00003C21 7.85088 20.7343 8.63969 20.2814 9.28803L19.8284 9.82845L21.2426 11.2427" />
      <path d="M21 17C21 19.0533 19.5 21 17 21H5C2.5 21 1 19.2091 1 17C1 15.2267 2.18182 13.7333 3.72727 13.36C3.90909 9.72 6.83732 7 10.4737 7C14.1101 7 17.0909 9.62667 17.3636 13.2667C19.3636 13.2667 21 14.9467 21 17Z" />
    </Icon>
  );
}

/** Table with seats either side, from above (meeting rooms). */
export function MeetingTable(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 3L7 3L7 21L17 21L17 3Z" />
      <circle cx="21.5" cy="5.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="5.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="21.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="21.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Microwave (work kitchen). */
export function Microwave(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" />
      <path d="M16 8H6V16H16V8Z" />
      <path d="M22 10H20" />
      <path d="M22 14H20" />
    </Icon>
  );
}

/** Tick. */
export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12.5L9.5 18L20 6.5" />
    </Icon>
  );
}

/** Padlock, closed and filled (secure payment). Drawn on an 18×18 grid. */
export function Lock({ className = "", title }: Pick<IconProps, "title" | "className">) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} className={`size-5 shrink-0 ${className}`}>
      {title && <title>{title}</title>}
      <path d="M12.25 9C11.836 9 11.5 8.664 11.5 8.25V5C11.5 3.622 10.378 2.5 9 2.5S6.5 3.622 6.5 5V8.25C6.5 8.664 6.164 9 5.75 9S5 8.664 5 8.25V5C5 2.794 6.794 1 9 1S13 2.794 13 5V8.25C13 8.664 12.664 9 12.25 9Z" />
      <path d="M12.75 7.5H5.25C3.733 7.5 2.5 8.733 2.5 10.25V14.25C2.5 15.767 3.733 17 5.25 17H12.75C14.267 17 15.5 15.767 15.5 14.25V10.25C15.5 8.733 14.267 7.5 12.75 7.5ZM9.75 12.75C9.75 13.164 9.414 13.5 9 13.5S8.25 13.164 8.25 12.75V11.75C8.25 11.336 8.586 11 9 11S9.75 11.336 9.75 11.75V12.75Z" />
    </svg>
  );
}

/** Question mark in a filled circle (help tooltips). */
export function Help({ className = "", title }: Pick<IconProps, "title" | "className">) {
  return (
    <svg viewBox="0 0 16 16" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} className={`size-4 shrink-0 ${className}`}>
      {title && <title>{title}</title>}
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M6 6.2C6 5 6.9 4.2 8 4.2C9.1 4.2 10 5 10 6C10 7.4 8 7.4 8 9" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="0.9" fill="white" />
    </svg>
  );
}

/* Large (32×32) icons, for feature lists such as the Working page's "How it works". */

/** Membership card (flexible memberships). */
export function Membership(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M22 4L27 4C28.6569 4 30 5.34314 30 7L30 25C30 26.6569 28.6569 28 27 28L5 28C3.34314 28 2 26.6569 2 25L2 7C2 5.34314 3.34315 3.99999 5 4L10 4" />
      <path d="M12 15C13.3807 15 14.5 13.8807 14.5 12.5C14.5 11.1193 13.3807 10 12 10C10.6193 10 9.5 11.1193 9.5 12.5C9.5 13.8807 10.6193 15 12 15Z" strokeLinecap="butt" />
      <path d="M12 18C9.23858 18 7 20.2386 7 23H17C17 20.2386 14.7614 18 12 18Z" strokeLinecap="butt" />
      <path d="M20 15H25" />
      <path d="M22 20H25" />
      <path d="M18 6V3C18 1.89543 17.1046 1 16 1C14.8954 1 14 1.89543 14 3V6H18Z" />
    </Icon>
  );
}

/** Presenter at a lectern (workshops and learning). */
export function Workshop(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M7 16.6538L8.00003 9.98941H8.50003H9.00003L10 16.6538L8.50003 18L7 16.6538Z" fill="currentColor" stroke="none" />
      <path d="M11.5 30H5.49998L4.40021 20L1.99997 18.75L2.98767 12.575C3.13169 11.6713 3.74615 10.925 4.57543 10.6175C6.03958 10.075 7.8024 10 8.49847 10H18.5749C19.362 10 20 10.638 20 11.4251C20 12.0613 19.5782 12.6205 18.9664 12.7953L13 14.5L11.5 30Z" />
      <path d="M28 17L28 7C28 5.34315 26.6569 4 25 4L17 4" />
      <path d="M17 21H30L29 25H17" />
      <path d="M24 29.5L21 25L21.3333 25.5" />
      <path d="M8.5 7C9.88071 7 11 5.88071 11 4.5C11 3.11929 9.88071 2 8.5 2C7.11929 2 6 3.11929 6 4.5C6 5.88071 7.11929 7 8.5 7Z" />
    </Icon>
  );
}

/** Handshake (business support). */
export function Handshake(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M5 7V21" strokeLinecap="butt" />
      <path d="M10 7.00003L1 7.00003L1 21.0545H5L13.1926 28.3832C14.1846 29.2706 15.712 29.1693 16.5782 28.1588V28.1588C17.3818 27.2212 17.3326 25.8241 16.4649 24.9455L15 23.462L18.1807 26.3488C19.177 27.2531 20.7233 27.1562 21.5989 26.1346V26.1346C22.3951 25.2058 22.3606 23.8254 21.5189 22.9375L19.5 20.8076L22.7354 23.844C23.7189 24.767 25.2575 24.7426 26.2112 23.7888V23.7888C27.1955 22.8046 27.1854 21.2057 26.1888 20.2339L18.5 12.7366L18.7702 13" />
      <path d="M20 11.5001L13.6415 16.2689C12.6996 16.9753 11.3816 16.8817 10.5491 16.0492V16.0492C9.67499 15.175 9.62124 13.7753 10.4258 12.8367L15.8493 6.50913C17.1536 4.98755 19.2403 4.39169 21.1513 4.99517L27.5 7.00003H31V21" />
      <path d="M27 7V15" />
    </Icon>
  );
}

/** Three connected people (connected community). */
export function Community(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M16 7C17.6569 7 19 5.65685 19 4C19 2.34315 17.6569 1 16 1C14.3431 1 13 2.34315 13 4C13 5.65685 14.3431 7 16 7Z" strokeLinecap="butt" />
      <path d="M20.9402 12.594C19.8577 11.0268 18.0488 10 16 10C13.9512 10 12.1423 11.0268 11.0598 12.594" />
      <path d="M8 22C9.65685 22 11 20.6569 11 19C11 17.3431 9.65685 16 8 16C6.34315 16 5 17.3431 5 19C5 20.6569 6.34315 22 8 22Z" strokeLinecap="butt" />
      <path d="M23.9171 22C25.5739 22 26.9171 20.6569 26.9171 19C26.9171 17.3431 25.5739 16 23.9171 16C22.2602 16 20.9171 17.3431 20.9171 19C20.9171 20.6569 22.2602 22 23.9171 22Z" strokeLinecap="butt" />
      <path d="M29.917 30C29.441 27.1623 26.973 25 24 25C21.027 25 18.559 27.1623 18.0829 30L19.5768 30.3787C22.4797 31.1146 25.5203 31.1146 28.4232 30.3787L29.917 30Z" strokeLinecap="butt" />
      <path d="M13.8341 30C13.358 27.1623 10.89 25 7.91704 25C4.94405 25 2.47608 27.1623 2 30L3.49387 30.3787C6.39674 31.1146 9.43734 31.1146 12.3402 30.3787L13.8341 30Z" strokeLinecap="butt" />
    </Icon>
  );
}

/** Calendar (events and activities). */
export function Calendar(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M2 12V7C2 5.343 3.343 4 5 4H27C28.657 4 30 5.343 30 7V12" strokeLinecap="butt" />
      <path d="M2 12H30V24.913C30 26.617 28.617 28 26.913 28H5.087C3.383 28 2 26.617 2 24.913V12Z" />
      <path d="M9 1V7" />
      <path d="M23 1V7" />
    </Icon>
  );
}

/** Lamp and sofa (inspiring spaces). */
export function Lounge(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M17 19L17 14.5C17 13.6716 17.6716 13 18.5 13L27.5 13C28.3284 13 29 13.6716 29 14.5L29 19" />
      <path d="M6.99992 14L6.99988 27" />
      <path d="M12.5613 12.6838L10 5L7 5L4 5L1.43874 12.6838C1.2229 13.3313 1.70487 14 2.38742 14L11.6126 14C12.2951 14 12.7771 13.3313 12.5613 12.6838Z" />
      <path d="M4 27H10" />
      <path d="M16.5 27L29.5 27C30.3284 27 31 26.3284 31 25.5L31 21C31 19.8954 30.1046 19 29 19C27.8954 19 27 19.8954 27 21L27 23L19 23L19 21C19 19.8954 18.1046 19 17 19C15.8954 19 15 19.8954 15 21L15 25.5C15 26.3284 15.6716 27 16.5 27Z" />
    </Icon>
  );
}

/** Lion's head (fearless). */
export function Lion(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M16 26L17.8293 24.1707C17.8923 24.1077 17.8477 24 17.7586 24H14.2414C14.1523 24 14.1077 24.1077 14.1707 24.1707L16 26Z" />
      <path d="M13.3043 17.978L10.909 16.1816C10.3694 16.4575 10 17.0188 10 17.6665C10 18.587 10.7462 19.3331 11.6667 19.3331C12.4807 19.3331 13.1584 18.7496 13.3043 17.978Z" fill="currentColor" stroke="none" fillRule="evenodd" />
      <path d="M18.6957 17.9778C18.8414 18.7496 19.5192 19.3333 20.3333 19.3333C21.2538 19.3333 22 18.5871 22 17.6667C22 17.0189 21.6304 16.4574 21.0906 16.1816L18.6957 17.9778Z" fill="currentColor" stroke="none" fillRule="evenodd" />
      <path d="M16 25.9999V30.4999" />
      <path d="M10.6667 8.00002L4 2.66669V12.6667L2 16L4.66667 17.3334L4 20.6667L6.66667 21.3334L10.8953 27.9112C11.9993 29.6286 13.9008 30.6667 15.9424 30.6667H16.0576C18.0992 30.6667 20.0007 29.6286 21.1047 27.9112L25.3333 21.3334L28 20.6667L27.3333 17.3334L30 16L28 12.6667V2.66669L21.3333 8.00002C21.3333 8.00002 18.9167 6.66669 16 6.66669C13.0833 6.66669 10.6667 8.00002 10.6667 8.00002Z" />
    </Icon>
  );
}

/** Weighing scales (balance). */
export function Scales(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M2 15.5H12" strokeLinecap="butt" />
      <path d="M20 15.5H30" strokeLinecap="butt" />
      <path d="M16 29V3" />
      <path d="M8 29H24" />
      <path d="M24.9496 5.11932L24.98 5.05859L20 15C20.08 18 22 20 25 20C28 20 30 18 30 15L24.98 5H16H7L2 15C2 18 4 20 7 20C10 20 11.92 18 12 15L7.02344 5.03125L7.05309 5.09064" />
    </Icon>
  );
}

/** Sprout from the ground (grow). */
export function Sprout(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M16 22.6667L16 10.7975" strokeLinecap="butt" />
      <path d="M16 12.1308C16 12.1308 16.6674 7.12665 20.0622 5.16666C23.457 3.20666 28.1244 5.13076 28.1244 5.13076C28.1244 5.13076 27.3964 10.1699 24.0622 12.0949C20.6674 14.0549 16 12.1308 16 12.1308Z" />
      <path d="M16 12.1308C16 12.1308 15.3326 7.12665 11.9378 5.16666C8.54301 3.20666 3.87564 5.13076 3.87564 5.13076C3.87564 5.13076 4.60363 10.1699 7.93782 12.0949C11.3326 14.0549 16 12.1308 16 12.1308Z" />
      <path d="M4 29C4 26.7909 5.79086 25 8 25C8.65554 25 9.27424 25.1577 9.82025 25.4372C10.6645 23.6051 12.5171 22.3333 14.6667 22.3333C17.6122 22.3333 20 25 20 28" />
      <path d="M28 29C28 26.7909 26.5 25 24 25" />
    </Icon>
  );
}

/** Three people side by side (community values). */
export function Crowd(props: IconProps) {
  return (
    <Icon large {...props}>
      <path d="M16 8C14.342 8 13 6.658 13 5C13 3.342 14.342 2 16 2C17.658 2 19 3.342 19 5C19 6.658 17.658 8 16 8Z" />
      <path d="M25 8C23.8947 8 23 7.10533 23 6C23 4.89467 23.8947 4 25 4C26.1053 4 27 4.89467 27 6C27 7.10533 26.1053 8 25 8Z" />
      <path d="M7 8C8.10533 8 9 7.10533 9 6C9 4.89467 8.10533 4 7 4C5.89467 4 5 4.89467 5 6C5 7.10533 5.89467 8 7 8Z" />
      <path d="M19 30H13L11.9 21L9.49976 19.75L10.4875 13.575C10.6303 12.6838 11.2171 11.94 12.0332 11.6337C12.9225 11.3 14.6025 11 16.0006 11C16.6967 11 18.4595 11.075 19.9237 11.6175C20.753 11.925 21.3674 12.6713 21.5114 13.575L22.4991 19.75L20.0989 21L19 30Z" />
      <path d="M26 11C26.4872 11 27.3388 11.0637 28.3637 11.5249C28.9442 11.7862 29.3743 12.4206 29.4751 13.1888L30.1665 18.9375L28.4864 20L27.5 28H25" />
      <path d="M6 11C5.51277 11 4.66117 11.0637 3.63632 11.5249C3.05585 11.7862 2.62574 12.4206 2.52494 13.1888L1.83354 18.9375L3.51363 20L4.5 28H7" />
    </Icon>
  );
}

/*
 * Card brand logos, in the brands' own colours. The source art is a 28×18 card on a 32×32
 * grid; the viewBox is cropped to the card. Size them by height, e.g. className="h-6".
 */
function CardLogo({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <svg viewBox="2 7 28 18" role="img" className={`aspect-[28/18] shrink-0 ${className}`}>
      <title>{title}</title>
      {children}
      {/* Shared edge and top highlight */}
      <path d="m27,7H5c-1.657,0-3,1.343-3,3v12c0,1.657,1.343,3,3,3h22c1.657,0,3-1.343,3-3v-12c0-1.657-1.343-3-3-3Zm2,15c0,1.103-.897,2-2,2H5c-1.103,0-2-.897-2-2v-12c0-1.103.897-2,2-2h22c1.103,0,2,.897,2,2v12Z" opacity=".15" />
      <path d="m27,8H5c-1.105,0-2,.895-2,2v1c0-1.105.895-2,2-2h22c1.105,0,2,.895,2,2v-1c0-1.105-.895-2-2-2Z" fill="#fff" opacity=".2" />
    </svg>
  );
}

export function VisaLogo({ className }: { className?: string }) {
  return (
    <CardLogo title="Visa" className={className}>
      <rect x="2" y="7" width="28" height="18" rx="3" fill="#1434cb" />
      <path d="m13.392,12.624l-2.838,6.77h-1.851l-1.397-5.403c-.085-.332-.158-.454-.416-.595-.421-.229-1.117-.443-1.728-.576l.041-.196h2.98c.38,0,.721.253.808.69l.738,3.918,1.822-4.608h1.84Z" fill="#fff" />
      <path d="m20.646,17.183c.008-1.787-2.47-1.886-2.453-2.684.005-.243.237-.501.743-.567.251-.032.943-.058,1.727.303l.307-1.436c-.421-.152-.964-.299-1.638-.299-1.732,0-2.95.92-2.959,2.238-.011.975.87,1.518,1.533,1.843.683.332.912.545.909.841-.005.454-.545.655-1.047.663-.881.014-1.392-.238-1.799-.428l-.318,1.484c.41.188,1.165.351,1.947.359,1.841,0,3.044-.909,3.05-2.317" fill="#fff" />
      <path d="m25.423,12.624h-1.494c-.337,0-.62.195-.746.496l-2.628,6.274h1.839l.365-1.011h2.247l.212,1.011h1.62l-1.415-6.77Zm-2.16,4.372l.922-2.542.53,2.542h-1.452Z" fill="#fff" />
      <path d="M15.894 12.624L14.446 19.394 12.695 19.394 14.143 12.624 15.894 12.624z" fill="#fff" />
    </CardLogo>
  );
}

export function MastercardLogo({ className }: { className?: string }) {
  return (
    <CardLogo title="Mastercard" className={className}>
      <rect x="2" y="7" width="28" height="18" rx="3" fill="#141413" />
      <path d="M13.597 11.677H18.407V20.32H13.597z" fill="#ff5f00" />
      <path d="m13.902,15.999c0-1.68.779-3.283,2.092-4.322-2.382-1.878-5.849-1.466-7.727.932-1.863,2.382-1.451,5.833.947,7.712,2,1.573,4.795,1.573,6.795,0-1.329-1.038-2.107-2.642-2.107-4.322Z" fill="#eb001b" />
      <path d="m24.897,15.999c0,3.039-2.459,5.497-5.497,5.497-1.237,0-2.428-.412-3.39-1.176,2.382-1.878,2.795-5.329.916-7.727-.275-.336-.58-.657-.916-.916,2.382-1.878,5.849-1.466,7.712.932.764.962,1.176,2.153,1.176,3.39Z" fill="#f79e1b" />
    </CardLogo>
  );
}

export function AmexLogo({ className }: { className?: string }) {
  return (
    <CardLogo title="American Express" className={className}>
      <rect x="2" y="7" width="28" height="18" rx="3" fill="#0f70ce" />
      <path d="m27.026,9l-.719,1.965-.708-1.965h-3.885v2.582l-1.136-2.582h-3.119l-3.259,7.409h2.637v6.591h8.097l1.316-1.458,1.322,1.458h2.244c.112-.314.184-.647.184-1v-1.041l-1.58-1.698,1.58-1.655v-7.606c0-.353-.072-.686-.184-1h-2.79Z" fill="#fff" />
      <path d="m17.679,14.433h2.61l.502,1.148h1.78l-2.531-5.754h-2.039l-2.531,5.754h1.734l.477-1.148Zm1.307-3.135l.775,1.844h-1.535l.761-1.844Z" fill="#0f70ce" />
      <path d="M22.542 9.827L25.018 9.827 26.302 13.39 27.604 9.827 30 9.827 30 15.581 28.45 15.581 28.45 11.603 26.977 15.581 25.608 15.581 24.124 11.631 24.124 15.581 22.542 15.581 22.542 9.827z" fill="#0f70ce" />
      <path d="M19.24 20.82L19.24 19.944 22.484 19.944 22.484 18.624 19.24 18.624 19.24 17.748 22.565 17.748 22.565 16.409 17.664 16.409 17.664 22.173 22.565 22.173 22.565 20.82 19.24 20.82z" fill="#0f70ce" />
      <path d="M24.638 16.409L26.271 18.234 27.968 16.409 30 16.409 27.283 19.254 30 22.173 27.939 22.173 26.249 20.309 24.567 22.173 22.537 22.173 25.272 19.275 22.537 16.409 24.638 16.409z" fill="#0f70ce" />
    </CardLogo>
  );
}
