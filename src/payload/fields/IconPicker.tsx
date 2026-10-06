"use client";

import { FieldDescription, FieldLabel, useField } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";
import { useState } from "react";
import * as icons from "@/components/icons";

type IconName = keyof typeof icons;

const tile = (selected: boolean) => ({
  display: "grid",
  placeItems: "center",
  aspectRatio: "1",
  padding: 8,
  borderRadius: 6,
  cursor: "pointer",
  color: "var(--theme-text)",
  background: selected ? "var(--theme-elevation-150)" : "var(--theme-elevation-50)",
  border: `2px solid ${selected ? "var(--theme-text)" : "transparent"}`,
});

/** "TapeMeasure" as "tapemeasure tape measure", so a search matches the name or a word in it. */
const searchText = (name: string) => `${name} ${name.replace(/([a-z0-9])([A-Z])/g, "$1 $2")}`.toLowerCase();

/**
 * The Checklist icon field as a grid of the icons themselves, instead of a list of their names.
 * Same select field underneath: it stores the icon's name. A search box filters them by name. The
 * admin doesn't load the site's Tailwind, so icons are sized here with inline styles.
 */
export const IconPicker: SelectFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string | null>({ path });
  const names = (field.options ?? []).map((option) => (typeof option === "string" ? option : option.value)) as IconName[];
  const iconSize = { width: 28, height: 28 };
  const [query, setQuery] = useState("");
  const shown = names.filter((name) => searchText(name).includes(query.trim().toLowerCase()));

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <FieldLabel label={field.label} path={path} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${names.length} icons`}
        aria-label="Search icons"
        style={{ width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--theme-elevation-150)", background: "var(--theme-input-bg)", color: "var(--theme-text)" }}
      />
      <div role="radiogroup" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))", gap: 6, marginTop: 8 }}>
        <button type="button" role="radio" aria-checked={!value} title="No icon" disabled={readOnly} onClick={() => setValue(null)} style={tile(!value)}>
          <span style={{ fontSize: 12 }}>None</span>
        </button>
        {shown.map((name) => {
          const Icon = icons[name];
          return (
            <button key={name} type="button" role="radio" aria-checked={value === name} title={name} disabled={readOnly} onClick={() => setValue(name)} style={tile(value === name)}>
              <Icon style={iconSize} title={name} />
            </button>
          );
        })}
      </div>
      {shown.length === 0 && <p style={{ margin: "8px 0 0" }}>No icons match “{query}”.</p>}
      <p style={{ margin: "8px 0 0" }}>Selected: {value ?? "no icon"}</p>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  );
};
