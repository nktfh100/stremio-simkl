import { useEffect } from "react";

import { setSimklAuthCode } from "@/lib/appStore";

import LinkBtn from "../LinkBtn/LinkBtn";

const clientId = import.meta.env.VITE_SIMKL_CLIENT_ID;
const redirectUrl = import.meta.env.VITE_SIMKL_REDIRECT_URL;

export default function SimklAuth() {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const codeParam = urlParams.get("code");

		if (codeParam) {
			setSimklAuthCode(codeParam);
		}
	}, []);

	const authLink = `https://simkl.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}`;

	return <LinkBtn href={authLink}>Login with Simkl</LinkBtn>;
}
