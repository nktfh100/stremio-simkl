import { slugify } from "@/utils";
import {
  CatalogType,
  allCatalogs,
  catalogExtra,
  catalogsData,
} from "@shared/catalogs";

export default function generateManifest(
  user: string,
  selectedCatalogs: CatalogType[] | undefined,
  configured: boolean = true,
) {
  let description = `Unofficial addon to display your Simkl Watchlists in Stremio, by @nktfh100`;

  if (!user) {
    user = "unknown";
  }

  if (configured) {
    description += ` (SIMKL user - ${user})`;
  }

  let id = "com.nktfh100.stremiosimkl";

  if (configured) {
    id += "." + slugify(user);
  }
  const catalogs = (selectedCatalogs || allCatalogs)
    .filter((catalog) => !!catalogsData[catalog])
    .map((catalog) => ({
      ...catalogsData[catalog],
      extra: catalogExtra(catalog),
    }));

  return {
    id,
    version: "0.3.0",
    name: "Simkl Watchlists",
    description,
    logo: "https://eu.simkl.in/img_favicon/v2/favicon-192x192.png",
    catalogs,
    resources: ["catalog"],
    types: ["movie", "series", "anime"],
    behaviorHints: {
      configurable: !configured,
      configurationRequired: !configured,
    },
  };
}
