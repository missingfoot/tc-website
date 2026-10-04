import type { ReactNode, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Accessible name. Without one the icon is hidden from screen readers (decorative). */
  title?: string;
};

/**
 * Shared wrapper for the icon set: 24×24 grid, 2px square-capped stroke, coloured by
 * `currentColor`. Defaults to 24px; resize with a size class, e.g. className="size-4".
 */
function Icon({ title, className = "", children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={`size-6 shrink-0 ${className}`}
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
