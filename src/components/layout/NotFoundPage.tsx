import Nav from "@/components/layout/Nav";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

/**
 * The 404 page's content (used by the site's not-found and the global 404), as on the old site:
 * a raccoon washing away its candy floss loops full screen behind the message. Its still first
 * frame shows while the video loads, and in its place for people who prefer reduced motion. WebM
 * first (1MB); the MP4 is for older iPhones, which can't play WebM.
 */
export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-black text-white">
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/raccoon-poster.jpg"
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      >
        <source src="/videos/raccoon.webm" type="video/webm" />
        <source src="/videos/raccoon.mp4" type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element -- a still of the video, not a photo to optimise */}
      <img src="/videos/raccoon-poster.jpg" alt="" className="absolute inset-0 hidden size-full object-cover motion-reduce:block" />
      {/* Black washes where the text sits: up from the bottom on phones, around the centre on desktop */}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 lg:bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.65),rgb(0_0_0/0.15)_70%)]" />

      {/* The full site nav (fixed, transparent over the video), so people can carry on from here */}
      <Nav />
      <Container className="relative flex flex-1 flex-col items-start justify-end pt-24 pb-16 text-left lg:items-center lg:justify-center lg:pb-24 lg:text-center">
        <p className="text-lg font-bold text-white/80">404</p>
        <h1 className="mt-2 text-5xl font-bold leading-heading tracking-tight lg:text-7xl">Page not found</h1>
        <p className="mt-4 text-lg font-medium leading-snug lg:mt-6 lg:text-xl">Something has gone missing.</p>
        <Button href="/" variant="white" arrow className="mt-8 w-full justify-center lg:w-auto">
          Back to the homepage
        </Button>
      </Container>
    </main>
  );
}
