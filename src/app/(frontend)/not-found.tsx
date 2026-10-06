import NotFoundPage from "@/components/layout/NotFoundPage";

export const metadata = { title: "Page not found" };

/** 404 for notFound() inside the site (e.g. a page slug that isn't in Payload). */
export default function NotFound() {
  return <NotFoundPage />;
}
