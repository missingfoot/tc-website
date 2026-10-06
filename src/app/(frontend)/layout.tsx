import type { Metadata } from "next";
import NavigationTracker from "@/components/layout/NavigationTracker";
import { circular } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  // For absolute social-preview image links (e.g. blog covers). Netlify sets URL to the site's address.
  metadataBase: new URL(process.env.URL ?? "http://localhost:3000"),
  title: { default: "The Collective", template: "%s | The Collective" },
  description: "A new way to live, work and play",
  // A portfolio remake of The Collective's site: keep it out of search results (see robots.ts)
  robots: { index: false, follow: false },
};

/** The site's root layout (Payload's admin, in the (payload) group, has its own). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${circular.variable} h-full antialiased`}>
      <head>
        {/* Photos start hidden and fade in once loaded (see Photo); without JavaScript, just show them */}
        <noscript>
          <style>{"[data-photo] { opacity: 1 !important; }"}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Header, <main> and footer come from the route group's layout: (site) or (checkout) */}
        <NavigationTracker />
        {children}
      </body>
    </html>
  );
}
