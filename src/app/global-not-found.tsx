import type { Metadata } from "next";
import NotFoundPage from "@/components/layout/NotFoundPage";
import { circular } from "./(frontend)/fonts";
import "./(frontend)/globals.css";

export const metadata: Metadata = { title: "Page not found | The Collective", robots: { index: false, follow: false } };

/**
 * 404 for URLs that match no route at all. The app has two root layouts (the site's and Payload's
 * admin), so this has to set up its own document, fonts and styles.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${circular.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NotFoundPage />
      </body>
    </html>
  );
}
