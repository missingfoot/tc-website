import type { CircleImage } from "@/lib/types";

const img = "/images/foundation";
type Bubbles = { main: CircleImage; top: CircleImage; bottom: CircleImage };

export const acceleratorBubbles: Bubbles = {
  main: { src: `${img}/accelerator-workshop.jpg`, alt: "Accelerator teams mapping out ideas around a table" },
  top: { src: `${img}/accelerator-founder.jpg`, alt: "A founder laughing during a conversation" },
  bottom: { src: `${img}/accelerator-cohort.jpg`, alt: "The accelerator cohort together outside The Collective Old Oak" },
};

export const moonshotsBubbles: Bubbles = {
  main: { src: `${img}/02-ideas-workshop.jpg`, alt: "Collectivists working through ideas" },
  top: { src: `${img}/01-morning-coffee.jpg`, alt: "A morning coffee stand for the neighbourhood" },
  bottom: { src: `${img}/03-sparklers.jpg`, alt: "Celebrating together" },
};
