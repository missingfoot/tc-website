import type { Product } from "@/components/sections/ProductShowcase";

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
