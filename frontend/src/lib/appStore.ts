import { create } from "zustand";

import { AppStoreState } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useAppStore = create<AppStoreState>()((_set) => ({
	code: undefined,
	installLink: undefined,
}));

export const setSimklAuthCode = (code: string | undefined) =>
	useAppStore.setState({ code });

export const setInstallLink = (installLink: string | undefined) =>
	useAppStore.setState({ installLink });

export default useAppStore;
