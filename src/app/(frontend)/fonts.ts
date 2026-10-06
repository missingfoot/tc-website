import localFont from "next/font/local";

// Circular Std, self-hosted. Weights match the Figma: Book 450, Medium 500, Bold 700, Black 900.
// Shared by the site's layout and the global 404 (which has to set up its own <html>).
export const circular = localFont({
  variable: "--font-circular",
  src: [
    { path: "./fonts/CircularStd-Book.woff2", weight: "450", style: "normal" },
    { path: "./fonts/CircularStd-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CircularStd-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/CircularStd-Black.woff2", weight: "900", style: "normal" },
  ],
});
