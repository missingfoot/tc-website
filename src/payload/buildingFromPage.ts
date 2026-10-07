// Splits a building's hand-made co-living page (as Old Oak's was, in Pages) into its co-living's
// own content (Locations: its photo, intro, gallery, what's included, directions intro), the
// building's address and ways to get there, and the co-living template's sections, where its name
// becomes {name} so other buildings can share them. Used by the migration that made buildings,
// and by the seed for a new database.

type Block = { blockType: string } & Record<string, unknown>;
type Value = unknown;

/** A copy without its rows' ids, so its arrays can be saved somewhere new. */
function withoutIds<T extends Value>(value: T): T {
  if (Array.isArray(value)) return value.map(withoutIds) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "id").map(([key, item]) => [key, withoutIds(item)])) as T;
  return value;
}

/** A copy with the building's name in its text as {name}. */
function nameAsVariable<T extends Value>(value: T, name: string): T {
  if (typeof value === "string") return value.split(name).join("{name}") as T;
  if (Array.isArray(value)) return value.map((item) => nameAsVariable(item, name)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, nameAsVariable(item, name)])) as T;
  return value;
}

/** The address a Google Maps embed shows (its ?q=). */
const addressOf = (mapEmbedUrl: unknown) => (typeof mapEmbedUrl === "string" ? (new URL(mapEmbedUrl).searchParams.get("q") ?? undefined) : undefined);

export function buildingFromPage(layout: Block[], name: string) {
  const place: Record<string, Value> = {};
  const gettingThere: { address?: string; travelModes?: Value } = {};
  const template: Block[] = [];
  for (const block of withoutIds(layout)) {
    const b = block as Block & Record<string, never>;
    switch (block.blockType) {
      case "hero":
        Object.assign(place, { area: b.eyebrow, image: b.image });
        template.push({ blockType: "locationHero", subtitle: b.subtitle, enquiryButton: (b.button as { opens?: string } | undefined)?.opens === "enquiry" });
        break;
      case "intro":
        place.intro = b.body;
        template.push({ blockType: "locationTextIntro", heading: b.heading, enquiryButton: b.buttons === "enquiry" });
        break;
      case "gallery":
        place.gallery = b.photos;
        template.push({ blockType: "locationGallery", heading: b.heading, intro: b.intro, tour: b.tour });
        break;
      case "roomCards":
        template.push({ blockType: "locationRooms", heading: b.heading, intro: b.intro, ctaLabel: b.ctaLabel });
        break;
      case "featureGroups":
        place.included = b.groups;
        template.push({ blockType: "locationIncluded", heading: b.heading, intro: b.intro, standard: [] });
        break;
      case "directions":
        place.directionsIntro = b.intro;
        Object.assign(gettingThere, { travelModes: b.travelModes, address: addressOf(b.mapEmbedUrl) });
        template.push({ blockType: "locationDirections", heading: b.heading });
        break;
      default:
        template.push(block);
    }
  }
  return { place, gettingThere, layout: nameAsVariable(template, name) };
}
