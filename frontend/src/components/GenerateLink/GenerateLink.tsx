import { useState } from "react";

import useAppStore, { setInstallLink, setSimklAuthCode } from "@/lib/appStore";
import { removeUrlParam } from "@/lib/utils";
import { Ring } from "@uiball/loaders";

import LinkBtn from "../LinkBtn/LinkBtn";

export default function GenerateLink() {
	const simklCode = useAppStore((state) => state.code);
	const installLink = useAppStore((state) => state.installLink);
	const [isLinkLoading, setIsLinkLoading] = useState(false);

	const handleGenLinkBtn = async () => {
		if (installLink || isLinkLoading) {
			return;
		}

		try {
			setIsLinkLoading(true);
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/gen-link`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						code: simklCode,
					}),
				}
			);
			const data = await response.json();

			setIsLinkLoading(false);

			if (data.error || !data.link) {
				alert(
					data.error
						? "Error: " + data.error
						: "Unknown error generating install link"
				);
				console.error(data.error);
				setSimklAuthCode(undefined);
				removeUrlParam("code");
				return;
			}

			setInstallLink(data.link);
		} catch (err) {
			console.error(err);
			setIsLinkLoading(false);
			alert("Could not reach backend server, please try again later.");
		}
	};

	return (
		<LinkBtn onClick={handleGenLinkBtn}>
			{isLinkLoading ? (
				<span
					style={{
						display: "flex", // For some reason the loader has extra height without this
					}}
				>
					<Ring color="white" size={26} />
				</span>
			) : (
				"Generate Install Link"
			)}
		</LinkBtn>
	);
}
