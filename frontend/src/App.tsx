import Balancer from "react-wrap-balancer";

import styles from "@/App.module.scss";
import GenerateLink from "@/components/GenerateLink/GenerateLink";
import SimklAuth from "@/components/SimklAuth/SimklAuth";
import useAppStore from "@/lib/appStore";

import LinkBtn from "./components/LinkBtn/LinkBtn";

export default function App() {
	const simklCode = useAppStore((state) => state.code);
	const installLink = useAppStore((state) => state.installLink);

	return (
		<div className={styles["app"]}>
			<div className={styles["content"]}>
				<div className={styles["logos"]}>
					<img src="/stremio-logo.svg" alt="Stremio Logo" />
					<p>+</p>
					<img src="/simkl-logo.webp" alt="Simkl Logo" />
				</div>
				<h1 className={styles["title"]}>Stremio Simkl Watchlists</h1>
				<h2 className={styles["version"]}>v0.1.3</h2>

				<h2 className={styles["description"]}>
					<Balancer>
						Unofficial Stremio addon to display your Simkl
						Watchlists in Stremio
					</Balancer>
				</h2>

				<div className={styles["button-container"]}>
					{!simklCode && <SimklAuth />}

					{simklCode && !installLink ? <GenerateLink /> : null}

					{simklCode && installLink ? (
						<LinkBtn href={installLink} colorsReversed={true}>
							Install
						</LinkBtn>
					) : null}
				</div>
			</div>
		</div>
	);
}
