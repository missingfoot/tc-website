"use client";

import { FieldDescription, FieldError, FieldLabel, ReactSelect, useConfig, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { useEffect, useState } from "react";

type Link = { label: string; value: string };
type Group = { label: string; options: Link[] };

// The site's pages, fetched once however many link fields a page has
let siteLinks: Promise<Group[]> | undefined;

/** What the link points at: one of /api/site-links' groups, or an address typed in. */
const ADDRESS = "Address";

const choice = (selected: boolean) => ({
  padding: "4px 12px",
  borderRadius: 999,
  cursor: "pointer",
  fontSize: 13,
  lineHeight: "20px",
  color: "var(--theme-text)",
  border: `1px solid ${selected ? "var(--theme-text)" : "var(--theme-elevation-150)"}`,
  background: selected ? "var(--theme-elevation-100)" : "transparent",
});

/**
 * A link field, by what it points at: a page, a location, a room or another page (each a short
 * dropdown, from /api/site-links), or an address typed in (another site, mailto:… or a #section).
 * Same text field underneath: it stores the address.
 */
export const LinkPicker: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError } = useField<string | null>({ path });
  const { config } = useConfig();
  const [groups, setGroups] = useState<Group[]>();
  const [kind, setKind] = useState<string>();

  useEffect(() => {
    siteLinks ??= fetch(`${config.serverURL}${config.routes.api}/site-links`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
    let current = true;
    siteLinks.then((links) => current && setGroups(links));
    return () => {
      current = false;
    };
  }, [config.serverURL, config.routes.api]);

  // Until a choice is made, it's whichever group the saved address is in (else a typed address)
  const groupOf = (address?: string | null) => groups?.find((group) => group.options.some((link) => link.value === address))?.label;
  const current = kind ?? (value ? (groupOf(value) ?? ADDRESS) : (groups?.[0]?.label ?? ADDRESS));
  const group = groups?.find((g) => g.label === current);
  const selected = group?.options.find((link) => link.value === value);

  if (!groups) return null;
  return (
    <div className="field-type" style={{ marginBottom: 24, flex: 1 }}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldError path={path} showError={showError} />
      <div role="radiogroup" aria-label="Links to" style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "4px 0 8px" }}>
        {[...groups.map((g) => g.label), ADDRESS].map((label) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={label === current}
            disabled={readOnly}
            onClick={() => {
              setKind(label);
              // A page from another group doesn't belong to this one
              if (label !== ADDRESS && groupOf(value) !== label) setValue(null);
            }}
            style={choice(label === current)}
          >
            {label}
          </button>
        ))}
      </div>
      {current === ADDRESS ? (
        // Payload's text-field class styles the box like its other text fields
        <div className="field-type text" style={{ margin: 0 }}>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => setValue(e.target.value || null)}
            disabled={readOnly}
            placeholder="https://…, mailto:… or #section"
          />
        </div>
      ) : (
        <ReactSelect
          value={selected}
          options={group?.options ?? []}
          onChange={(option) => setValue((option as Link | undefined)?.value || null)}
          isClearable
          disabled={readOnly}
          showError={showError}
          placeholder="Choose…"
        />
      )}
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  );
};
