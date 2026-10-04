"use client";

import { useEffect, useRef } from "react";
import { Close } from "@/components/icons";

type VideoModalProps = {
  /** An .mp4 URL, or a YouTube/Vimeo link. Null closes the modal. */
  video: string | null;
  title: string;
  onClose: () => void;
};

/** Turns a YouTube/Vimeo watch link into its embed URL; null for direct video files. */
function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return null;
}

/** Full-screen video player in a native <dialog> (Escape and the backdrop close it). */
export default function VideoModal({ video, title, onClose }: VideoModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (video !== null && !dialog.open) dialog.showModal();
    if (video === null && dialog.open) dialog.close();
  }, [video]);

  const embed = video ? embedUrl(video) : null;

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(64rem,calc(100%-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-ink/80"
    >
      <button type="button" onClick={onClose} aria-label="Close video" className="absolute -top-12 right-0 flex size-10 items-center justify-center text-white">
        <Close />
      </button>
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        {video === "" && <p className="flex size-full items-center justify-center text-white">Video coming soon</p>}
        {video &&
          (embed ? (
            <iframe src={embed} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="size-full" />
          ) : (
            <video src={video} controls autoPlay playsInline className="size-full" />
          ))}
      </div>
    </dialog>
  );
}
