import type { Product } from "@/components/sections/ProductShowcase";
import type { ResearchFigure } from "@/components/sections/ResearchSection";

const img = "/images/labs";

export const acquire: Product = {
  name: "Acquire",
  summary: "Data-driven land acquisition platform.",
  features: [
    "Track real estate market activity globally to identify opportunities",
    "Integrate with operational and financial data",
    "Track deal flow internally and externally",
    "Automate workflows",
    "Relationship management",
    "Advanced land-use feasibility modelling",
  ],
  screenshot: { src: `${img}/acquire-map.jpg`, alt: "Acquire’s map of London sites, filtered by status and priority", width: 1362, height: 850, corners: "small" },
};

export const colab: Product = {
  name: "Colab",
  summary: "Property management system, designed and built uniquely for co-living.",
  features: [
    "API-driven for extensibility",
    "Third-party integrations",
    "Intelligent room allocation",
    "Real-time occupancy and reporting",
    "Dynamic room pricing",
  ],
  screenshot: { src: `${img}/colab-occupancy.jpg`, alt: "Colab’s occupancy chart and room bookings timeline", width: 1362, height: 850, corners: "small" },
};

export const mobileApp: Product = {
  name: "Mobile App",
  summary: "The members’ co-living companion.",
  features: [
    "Manage your membership",
    "Real-time member support",
    "Location-based services, powered by smart sensors",
    "Data collection to optimise spatial design and customer experience",
    "Unlock the network effect by creating meaningful social connections",
    "Hack your co-living environment",
    "Personalised spaces through smart home technology",
  ],
  screenshot: { src: `${img}/mobile-app-home.jpg`, alt: "The app’s home screen with announcements and upcoming events", width: 658, height: 1412 },
};

// Research & development write-up, with two of the studies: a simulation of how people flow
// through the lobby and larger rooms, and cameras that count who uses each room and how often.
export const research: {
  heading: string;
  rows: { heading: string; paragraphs: string[]; figure: ResearchFigure }[];
} = {
  heading: "Research & Development",
  rows: [
    {
      heading: "Room activity metrics",
      paragraphs: [
        "In our shared rooms, cameras streamed video to a server running our Python scripts and an object detection model: a neural network that boxes every person, chair and plant in the frame and scores how confident it is in each match.",
        "Counting the people it found, frame by frame, measured the footfall in every room: how often it was used, and when. Over time, that showed which spaces were in demand and which sat quiet, so we could shape them around residents.",
      ],
      figure: {
        src: `${img}/room-activity-camera.jpg`,
        alt: "Ceiling camera view of the 4th floor garden room during a yoga session, with each person, chair and plant boxed and labelled by the detection software",
      },
    },
    {
      heading: "People mapping",
      paragraphs: [
        "We study how people actually use our buildings, so that every space we design works for the community living and working in it.",
        "In the lobby and our larger rooms, we mapped how people move through the space with an agent-based simulation: virtual people, each choosing between seating, the bar and the views. Their paths showed where people cross and gather, and how a layout really gets used.",
      ],
      figure: {
        src: `${img}/people-flow-map.jpg`,
        alt: "3D model of a lobby with people moving between seating, the bar and viewpoints, their paths traced in glowing blue, and each person’s choices logged down the side",
      },
    },
  ],
};
