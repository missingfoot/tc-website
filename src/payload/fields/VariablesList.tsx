"use client";

import { useConfig } from "@payloadcms/ui";
import { useEffect, useState } from "react";

type VariableInfo = { name: string; value: string; about: string };

/**
 * The Variables page's list of every variable text can use, with its current value (from
 * /api/site-variables), plus {lowest-price}, which depends on where it's written.
 */
export function VariablesList() {
  const { config } = useConfig();
  const [list, setList] = useState<VariableInfo[]>();

  useEffect(() => {
    let current = true;
    fetch(`${config.serverURL}${config.routes.api}/site-variables`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((variables) => current && setList(variables))
      .catch(() => current && setList([]));
    return () => {
      current = false;
    };
  }, [config.serverURL, config.routes.api]);

  const rows = [{ name: "lowest-price", value: "where it's written", about: "The lowest price of the room or location it's written in (or, in a template, of the place shown). Use this one there; the named ones below are for other pages" }, ...(list ?? [])];
  const cell = { padding: "8px 12px", borderBottom: "1px solid var(--theme-elevation-100)", textAlign: "left" } as const;

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ margin: "0 0 4px" }}>All variables</h3>
      <p style={{ margin: "0 0 12px", color: "var(--theme-elevation-500)" }}>
        Copy one into any text, braces included. Values update by themselves: the prices come from Locations, Rooms and Pricing rules. Save to see new ones of your own here.
      </p>
      {list === undefined ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={cell}>Write</th>
              <th style={cell}>Currently</th>
              <th style={cell}>What it is</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.name}>
                <td style={cell}>
                  <code style={{ userSelect: "all" }}>{`{${v.name}}`}</code>
                </td>
                <td style={cell}>{v.value}</td>
                <td style={{ ...cell, color: "var(--theme-elevation-500)" }}>{v.about}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
