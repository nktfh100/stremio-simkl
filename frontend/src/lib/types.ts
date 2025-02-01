import { CatalogType } from "shared/catalogs";

export interface AppStoreState {
  code: string | undefined;
  installLink: string | undefined;
  selectedCatalogs: CatalogType[];
}
