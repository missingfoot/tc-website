import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Centres content at the 1440px design width with the standard page gutters. */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-6 md:px-12 xl:px-[190px] ${className}`}>
      {children}
    </div>
  );
}
