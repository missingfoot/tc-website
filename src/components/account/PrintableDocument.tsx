"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { Download } from "@/components/icons";
import { LogoMark } from "@/components/layout/Logo";

/** The building's address: the postal address without the room line. */
export const buildingAddress = (postalAddress: string[]) => postalAddress.filter((line) => !/^room\b/i.test(line));

/**
 * A letter, statement or receipt drawn as a sheet of paper on The Collective's letterhead, with a
 * button to print it or save it as a PDF (the browser's print dialog does both). Only the sheet
 * prints (see `.print-document` in globals.css). TODO: with a backend, generate signed PDFs instead.
 */
export default function PrintableDocument({ from, outdated = false, children }: { from: string[]; outdated?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Faded while the options above have changed and it hasn't been remade yet */}
      <article
        aria-busy={outdated}
        className={`print-document rounded-2xl bg-white p-6 text-sm leading-relaxed text-ink shadow-sm transition-opacity sm:p-10 lg:p-14 ${outdated ? "opacity-40" : ""}`}
      >
        <header className="flex flex-col gap-6 border-b border-ink/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <LogoMark className="h-7" />
          <address className="text-stone not-italic sm:text-right">
            {from.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </header>
        <div className="pt-8">{children}</div>
      </article>
      {!outdated && (
        <Button variant="dark" onClick={() => window.print()} className="w-full justify-center lg:w-auto lg:self-start">
          <Download />
          Print or save as PDF
        </Button>
      )}
    </div>
  );
}
