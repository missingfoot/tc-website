"use client";

import { useState, type ComponentProps } from "react";
import Button from "./Button";
import VideoModal from "./VideoModal";
import { Play } from "@/components/icons";

type VideoButtonProps = {
  label: string;
  /** .mp4 URL or a YouTube/Vimeo link. */
  video: string;
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
};

/** A pill button with a play icon that opens the video lightbox. */
export default function VideoButton({ label, video, variant = "light", className = "" }: VideoButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} className={className}>
        <Play className="shrink-0" />
        {label}
      </Button>
      <VideoModal video={open ? video : null} title={label} onClose={() => setOpen(false)} />
    </>
  );
}
