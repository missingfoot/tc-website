import type { Metadata } from "next";
import localFont from "next/font/local";
import Nav from "@/components/layout/Nav";
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
  title: "TC",
  description: "A new way to live",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${circular.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
