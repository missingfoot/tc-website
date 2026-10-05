import type { Metadata } from "next";
import localFont from "next/font/local";
import NavigationTracker from "@/components/layout/NavigationTracker";
import "./globals.css";

// Circular Std, self-hosted. Weights match the Figma: Book 450, Medium 500, Bold 700, Black 900.
const circular = localFont({
  variable: "--font-circular",
  src: [
    { path: "./fonts/CircularStd-Book.woff2", weight: "450", style: "normal" },
    { path: "./fonts/CircularStd-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CircularStd-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/CircularStd-Black.woff2", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: { default: "The Collective", template: "%s | The Collective" },
  description: "A new way to live, work and play",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
