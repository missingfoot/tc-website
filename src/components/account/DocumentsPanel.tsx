"use client";

import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import BackLink from "@/components/ui/BackLink";
import { Bin, Check, Clock } from "@/components/icons";
import { ACCEPTED_TYPES, MAX_FILE_BYTES, documentTypes, type DocumentSlot } from "@/content/documents";
import { documentStatus, requestedDocuments, requiredDocuments, submitDocuments, useAccount, type DocumentKind, type DocumentRecord, type DocumentStatus } from "@/lib/account";
import { useTick } from "@/hooks/useTick";
import { pressable } from "@/lib/styles";
import AccountCard from "./AccountCard";
import { RenewalNextUp } from "./RenewalPanel";
import SuccessCard from "./SuccessCard";

const statusText: Record<DocumentStatus, string> = {
  needed: "Upload documents",
  review: "Being checked",
  approved: "Approved",
};

/** 234567 → "229 KB" */
const formatBytes = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

/** What's been picked for each slot, per document, until it's sent. */
type PickedFiles = Partial<Record<DocumentKind, Record<string, Picked>>>;

const requiredSlots = (kind: DocumentKind) => documentTypes[kind].groups.flatMap((g) => g.slots.map((s) => s.id));

/**
 * Renewal: upload your documents. Each document (ID, and a visa and residence permit card if they
 * need one) is a numbered section showing its file slots, or what was sent and where it's up to. One button sends every
 * document that's ready.
 */
export default function DocumentsPanel() {
  const account = useAccount()?.account;
  const kinds = account ? requestedDocuments(account) : [];
  const statuses = kinds.map((k) => documentStatus(account?.documents?.[k]));
  // Re-checks while something's under review, so it flips to approved by itself
  useTick(statuses.includes("review"));
  const [picked, setPicked] = useState<PickedFiles>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Documents already sent that they've chosen to add more to
  const [adding, setAdding] = useState<DocumentKind[]>([]);
  const [uploading, setUploading] = useState(false);
  if (!account) return null;

  const status = (kind: DocumentKind) => statuses[kinds.indexOf(kind)];
  const inForm = (kind: DocumentKind) => status(kind) === "needed" || adding.includes(kind);
  const files = (kind: DocumentKind) => picked[kind] ?? {};
  // A new document needs its required files; adding to a sent one needs at least one
  const ready = (kind: DocumentKind) => (status(kind) === "needed" ? requiredSlots(kind).every((id) => files(kind)[id]) : Object.keys(files(kind)).length > 0);
  const formKinds = kinds.filter(inForm);
  // Once every required document is sent, the page leads with a thank-you and what's next
  const allSent = requiredDocuments(account).every((k) => status(k) !== "needed");
  const checking = kinds.some((k) => status(k) === "review");
  const readyKinds = formKinds.filter(ready);
  // Still to finish: started ones, and required ones (an untouched optional one can just wait)
  const unfinished = formKinds.filter((k) => !ready(k) && (!documentTypes[k].optional || Object.keys(files(k)).length > 0));

  const pick = (kind: DocumentKind, slot: string) => async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const key = `${kind}-${slot}`;
    const problem = !ACCEPTED_TYPES.includes(file.type) ? "That file type isn’t supported. Use JPEG, PNG or PDF." : file.size > MAX_FILE_BYTES ? "That file’s over 10MB." : "";
    setErrors((prev) => ({ ...prev, [key]: problem }));
    if (problem) return;
    const preview = await thumbnail(file).catch(() => undefined);
    setPicked((prev) => ({
      ...prev,
      [kind]: {
        ...prev[kind],
        [slot]: { name: file.name, size: file.size, preview },
      },
    }));
  };

  const remove = (kind: DocumentKind, slot: string) => () =>
    setPicked((prev) => ({
      ...prev,
      [kind]: Object.fromEntries(Object.entries(prev[kind] ?? {}).filter(([id]) => id !== slot)),
    }));

  const stopAdding = (kind: DocumentKind) => {
    setAdding((prev) => prev.filter((k) => k !== kind));
    setPicked((prev) => ({ ...prev, [kind]: {} }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (readyKinds.length === 0 || uploading) return;
    setUploading(true);
    // DEMO: stands in for the upload to secure storage
    setTimeout(() => {
      for (const kind of readyKinds)
        submitDocuments(
          kind,
          Object.entries(files(kind)).map(([slot, f]) => ({ slot, ...f })),
        );
      setPicked((prev) => Object.fromEntries(Object.entries(prev).filter(([kind]) => !readyKinds.includes(kind as DocumentKind))));
      setAdding((prev) => prev.filter((k) => !readyKinds.includes(k)));
      setUploading(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 1500);
  };

  // Under the title: the status, or how far through picking files they are
  const subtitle = (kind: DocumentKind) => {
    if (!inForm(kind)) return statusText[status(kind)];
    const count = Object.keys(files(kind)).length;
    if (ready(kind)) return "Ready to submit";
    if (count === 0) return status(kind) !== "needed" ? "Add more files" : documentTypes[kind].optional ? "Optional, you can send it later" : statusText.needed;
    return `${count} of ${requiredSlots(kind).length} files added`;
  };

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/renewal">Back to your renewal</BackLink>
      {allSent && (
        <>
          {checking ? (
            <SuccessCard heading="Thanks for your documents">We’re checking them now and will let you know if we need anything else.</SuccessCard>
          ) : (
            <SuccessCard heading="Documents checked">All checked, thank you.</SuccessCard>
          )}
          {account.membership?.renewal.requested && <RenewalNextUp account={account} m={account.membership} here="documents" />}
        </>
      )}
      <form onSubmit={submit}>
        <AccountCard
          heading={allSent ? "Your documents" : "Upload your documents"}
          intro={
            allSent
              ? "What you’ve sent us. We keep them safe and only use them to check your right to rent."
              : "To renew your membership, we need up-to-date copies of these. We keep them safe and only use them to check your right to rent."
          }
        >
          <ul className={`-mx-6 divide-y divide-ink/10 border-y border-ink/10 lg:-mx-8 ${formKinds.length ? "" : "-mb-6 border-b-0 lg:-mb-8"}`}>
            {kinds.map((kind, i) => (
              <li key={kind}>
                <DocumentRow kind={kind} badge={<StatusBadge status={status(kind)} number={i + 1} ready={inForm(kind) && ready(kind)} />} subtitle={subtitle(kind)}>
                  {status(kind) === "needed" ? (
                    <UploadFields kind={kind} picked={files(kind)} errors={errors} disabled={uploading} onPick={pick} onRemove={remove} />
                  ) : (
                    // Already sent: what's there, then more files to add alongside it
                    <div className="flex flex-col items-start gap-6">
                      <SentFiles record={account.documents?.[kind]} />
                      {adding.includes(kind) ? (
                        <>
                          <div className="w-full">
                            <UploadFields kind={kind} picked={files(kind)} errors={errors} disabled={uploading} onPick={pick} onRemove={remove} />
                          </div>
                          <button
                            type="button"
                            onClick={() => stopAdding(kind)}
                            disabled={uploading}
                            className="text-sm font-medium text-ink underline underline-offset-4 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => setAdding((prev) => [...prev, kind])} className="w-full justify-center lg:w-auto">
                          Upload more documents
                        </Button>
                      )}
                    </div>
                  )}
                </DocumentRow>
              </li>
            ))}
          </ul>
          {formKinds.length > 0 && (
            <div className="flex flex-col items-start gap-3 pt-6 lg:items-center lg:pt-8">
              <button
                type="submit"
                disabled={readyKinds.length === 0 || uploading}
                className={`inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-base font-bold transition lg:w-auto lg:min-w-64 ${
                  uploading ? "bg-sage/20 text-ink" : readyKinds.length ? `bg-ink text-white hover:bg-ink/85 ${pressable}` : "cursor-not-allowed bg-ink/10 text-stone"
                }`}
              >
                {uploading ? "Uploading…" : readyKinds.length > 1 ? `Submit ${readyKinds.length} documents` : "Submit documents"}
              </button>
              {!uploading && (readyKinds.length === 0 || unfinished.length > 0) && (
                <p className="text-sm text-stone">
                  {readyKinds.length === 0 ? "Add the files above to submit." : `${unfinished.map((k) => documentTypes[k].title).join(" and ")} can be sent later.`}
                </p>
              )}
            </div>
          )}
        </AccountCard>
      </form>
    </div>
  );
}

/** The section's number while files are still to add, a check once they're all in, then where the check's up to. */
function StatusBadge({ status, number, ready = false }: { status: DocumentStatus; number?: number; ready?: boolean }) {
  const base = "flex size-8 shrink-0 items-center justify-center rounded-full";
  if (ready) {
    return (
      <span className={`${base} bg-ink text-white`}>
        <Check className="size-4" />
      </span>
    );
  }
  if (status === "needed") return <span className={`${base} border border-ink/20 text-sm font-bold text-ink tabular-nums`}>{number}</span>;
  const Icon = status === "review" ? Clock : Check;
  return (
    <span className={`${base} ${status === "review" ? "bg-cream-dark text-ink" : "bg-sage text-white"}`}>
      <Icon className="size-4" />
    </span>
  );
}

function DocumentRow({ kind, badge, subtitle, children }: { kind: DocumentKind; badge: ReactNode; subtitle: string; children: ReactNode }) {
  return (
    <section className="px-6 py-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex items-center gap-4">
        {badge}
        <div className="min-w-0">
          <h3 className="font-bold text-ink">{documentTypes[kind].title}</h3>
          <p className="text-sm text-stone">{subtitle}</p>
        </div>
      </div>
      {/* Lines up with the title, after the badge */}
      <div className="sm:pl-12">{children}</div>
    </section>
  );
}

/** Every file sent for a document, across uploads. */
function SentFiles({ record }: { record?: DocumentRecord }) {
  const files = record?.files ?? [];
  return (
    <div className="w-full rounded-xl bg-cream p-5">
      <p className="font-medium text-ink">
        You uploaded {files.length} {files.length === 1 ? "file" : "files"}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {files.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-sage" />
            <span className="min-w-0 truncate text-ink">{f.name}</span>
            <span className="shrink-0 text-stone">{formatBytes(f.size)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Picked = { name: string; size: number; preview?: string };

/** A small JPEG thumbnail of an image (PDFs get none), so the demo can show and store it cheaply. */
async function thumbnail(file: File): Promise<string | undefined> {
  if (!file.type.startsWith("image/")) return undefined;
  const bitmap = await createImageBitmap(file);
  const width = 160;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.round((bitmap.height / bitmap.width) * width);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

/** One document's file slots, grouped with what to photograph. */
function UploadFields({
  kind,
  picked,
  errors,
  disabled,
  onPick,
  onRemove,
}: {
  kind: DocumentKind;
  picked: Record<string, Picked>;
  errors: Record<string, string>;
  disabled: boolean;
  onPick: (kind: DocumentKind, slot: string) => (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (kind: DocumentKind, slot: string) => () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {documentTypes[kind].groups.map((group, i) => (
        <div key={group.instruction} className={i > 0 ? "border-t border-ink/10 pt-8" : ""}>
          <p className="text-base leading-relaxed text-ink">{group.instruction}</p>
          <div className="mt-4 flex flex-col gap-3">
            {group.slots.map((slot) => (
              <UploadSlot
                key={slot.id}
                slot={slot}
                picked={picked[slot.id]}
                error={errors[`${kind}-${slot.id}`]}
                disabled={disabled}
                onPick={onPick(kind, slot.id)}
                onRemove={onRemove(kind, slot.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function UploadSlot({
  slot,
  picked,
  error,
  disabled,
  onPick,
  onRemove,
}: {
  slot: DocumentSlot;
  picked?: Picked;
  error?: string;
  disabled: boolean;
  onPick: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const inputId = useId();
  return (
    <div>
      <div
        className={`flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center ${picked ? "border border-ink/15 bg-white" : "border border-dashed border-ink/25 bg-cream/40"}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {picked?.preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local data URL thumbnail, nothing for next/image to optimise
            <img src={picked.preview} alt="" className="h-14 w-20 shrink-0 rounded-md object-cover shadow-sm" />
          ) : picked ? (
            <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-cream text-sm font-bold text-stone">PDF</span>
          ) : (
            <DocumentPicture picture={slot.picture} />
          )}
          <div className="min-w-0">
            <p className="font-medium text-ink">{slot.label}</p>
            <p className="truncate text-sm text-stone">{picked ? `${picked.name} · ${formatBytes(picked.size)}` : "JPEG, PNG or PDF, up to 10MB"}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <input id={inputId} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={onPick} disabled={disabled} className="peer sr-only" />
          <label
            htmlFor={inputId}
            className={`inline-flex h-12 shrink-0 cursor-pointer items-center justify-center rounded-full px-6 text-base font-bold peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${pressable} ${
              picked ? "border border-ink/15 bg-white text-ink hover:bg-cream" : "bg-ink text-white hover:bg-ink/85"
            }`}
          >
            {picked ? "Replace" : "Select file"}
            <span className="sr-only">: {slot.label}</span>
          </label>
          {picked && (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              aria-label={`Remove ${picked.name}`}
              className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50 ${pressable}`}
            >
              <Bin />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** A simple drawing of the document to photograph. */
function DocumentPicture({ picture }: { picture: DocumentSlot["picture"] }) {
  return (
    <svg viewBox="0 0 80 56" aria-hidden="true" className="h-14 w-20 shrink-0 text-ink/30" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="78" height="54" rx="4" fill="white" />
      {picture === "card-back" ? (
        <>
          <rect x="1" y="10" width="78" height="9" fill="currentColor" stroke="none" opacity="0.5" />
          <path d="M10 32H70M10 40H56" />
        </>
      ) : (
        <>
          <circle cx="20" cy="22" r="6" />
          <path d="M11 40C11 34.5 15 31 20 31C25 31 29 34.5 29 40" />
          <path d={picture === "passport" ? "M38 16H70M38 24H64M38 32H70M38 40H58" : "M38 18H58M38 26H70M38 34H66M8 8H16"} />
        </>
      )}
    </svg>
  );
}
