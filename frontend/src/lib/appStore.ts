import { create } from "zustand";

import { AppStoreState } from "@/lib/types";
import { CatalogType } from "@shared/catalogs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useAppStore = create<AppStoreState>()((_set) => ({
  code: undefined,
  installLink: undefined,
  selectedCatalogs: [
    CatalogType.MOVIE_PLAN_TO_WATCH,
    CatalogType.SERIES_WATCHING,
    CatalogType.SERIES_PLAN_TO_WATCH,
  ],
}));

export const setSimklAuthCode = (code: string | undefined) =>
  useAppStore.setState({ code });

export const setInstallLink = (installLink: string | undefined) =>
  useAppStore.setState({ installLink });

export const setSelectedCatalogs = (selectedCatalogs: CatalogType[]) =>
  useAppStore.setState({ selectedCatalogs });

export default useAppStore;
