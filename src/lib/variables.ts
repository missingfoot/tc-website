// Variables in text: an editor writes "Rooms start from {lowest-price} per week." and the current
// value goes in when the page is built, so prices typed into words never go out of date. Values
// come from the real prices (lib/payload.ts → getVariables) and the Variables global.

/** Variable names and their current values, e.g. "lowest-price:room:ensuite" → "£245". */
export type Variables = Map<string, string>;

const VARIABLE = /\{([a-z0-9][a-z0-9:-]*)\}/g;

/**
 * The variables that mean the place the text belongs to (a room or location, or the one a
 * template is showing): `{lowest-price}`, its lowest price, and `{name}`, its name.
 */
export type OwnVariables = { "lowest-price"?: string; name?: string };
const ownNames = new Set<string>(["lowest-price", "name"]);

/** Text with its {variables} filled in. An unknown variable stays as written, so a typo shows on the page. */
export function fillText(text: string, variables: Variables, own?: OwnVariables) {
  return text.replace(VARIABLE, (written, name: string) =>
    ownNames.has(name) ? (own?.[name as keyof OwnVariables] ?? written) : (variables.get(name) ?? written),
  );
}

/** A document (page, location, room, template) with the variables in all of its text filled in. */
export function fillVariables<T>(value: T, variables: Variables, own?: OwnVariables): T {
  if (typeof value === "string") return fillText(value, variables, own) as T;
  if (Array.isArray(value)) return value.map((item) => fillVariables(item, variables, own)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillVariables(item, variables, own)])) as T;
  return value;
}
