import type { DocumentKind } from "@/lib/account";

/** One file to upload, drawn as a little picture of the document. */
export type DocumentSlot = { id: string; label: string; picture: "passport" | "card-front" | "card-back" };

/** A group of files with what to photograph. */
export type DocumentGroup = { instruction: string; slots: DocumentSlot[] };

/** Each document's files. `optional` documents can be sent later and don't hold up the renewal. */
export const documentTypes: Record<DocumentKind, { title: string; groups: DocumentGroup[]; optional?: boolean }> = {
  id: {
    title: "Proof of ID",
    groups: [
      {
        instruction: "Please upload a clear photo of the photo page of your passport, making sure it’s in date.",
        slots: [{ id: "passport", label: "Photo page of your passport", picture: "passport" }],
      },
    ],
  },
  visa: {
    title: "Visa",
    groups: [
      {
        instruction: "Please upload a clear photo of the visa page in your passport, making sure the visa is valid.",
        slots: [{ id: "visa-page", label: "Visa page in your passport", picture: "passport" }],
      },
    ],
  },
  brp: {
    title: "Residence permit card",
    optional: true,
    groups: [
      {
        instruction: "Please upload a clear photo of both sides of your biometric residence permit card. If you don’t have it yet, you can send it to us later.",
        slots: [
          { id: "brp-front", label: "Front of your ID card", picture: "card-front" },
          { id: "brp-back", label: "Back of your ID card", picture: "card-back" },
        ],
      },
    ],
  },
};

/** Accepted file types and size, as the file picker and the check before sending see them. */
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
