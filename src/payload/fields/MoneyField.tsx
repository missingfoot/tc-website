"use client";

import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui";
import type { NumberFieldClientComponent } from "payload";
import { useState } from "react";

const toPounds = (pence: number | null | undefined) => (pence == null ? "" : String(pence / 100));

/**
 * An amount of money, typed in pounds ("150" or "1061.67") and stored as whole pence (15000), so
 * prices add up exactly and match what payment providers expect.
 */
export const MoneyField: NumberFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError } = useField<number | null>({ path });
  const [text, setText] = useState(toPounds(value));
  const [seen, setSeen] = useState(value);

  // Follow the stored value when it changes from elsewhere (e.g. the form resets), keeping what's
  // being typed ("150." is still 15000)
  if (value !== seen) {
    setSeen(value);
    if (Math.round(Number(text) * 100) !== value) setText(toPounds(value));
  }

  return (
    <div className="field-type text" style={{ flex: 1, marginBottom: 24 }}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldError path={path} showError={showError} />
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--theme-elevation-500)" }}>£</span>
        <input
          type="text"
          inputMode="decimal"
          value={text}
          disabled={readOnly}
          placeholder="0"
          style={{ paddingLeft: 26 }}
          onChange={(e) => {
            const typed = e.target.value.replace(/[^\d.]/g, "");
            setText(typed);
            setValue(typed === "" ? null : Math.round(Number(typed) * 100));
          }}
        />
      </div>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  );
};
