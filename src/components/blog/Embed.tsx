/** A video or music player in a blog post: `<Embed src="https://www.youtube.com/embed/…" title="…" />`. */
export default function Embed({ src, title }: { src: string; title: string }) {
  const host = new URL(src).hostname;
  // Players keep their own shape: Spotify playlists and SoundCloud are fixed heights, videos are 16:9
  const shape = host.includes("spotify") ? "h-88" : host.includes("soundcloud") ? "h-100" : "aspect-video";
  return (
    <div className="overflow-hidden rounded-2xl bg-ink/5">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={`block w-full ${shape}`}
      />
    </div>
  );
}
