import Balancer from "react-wrap-balancer";
import GenerateLink from "@/components/GenerateLink/GenerateLink";
import LinkBtn from "./components/LinkBtn/LinkBtn";
import SimklAuth from "@/components/SimklAuth/SimklAuth";
import styles from "@/App.module.scss";
import useAppStore from "@/lib/appStore";
import { SelectCatalogs } from "./components/SelectCatalogs/SelectCatalogs";

export default function App() {
  const simklCode = useAppStore((state) => state.code);
  const installLink = useAppStore((state) => state.installLink);

  return (
    <div className={styles["app"]}>
      <div
        className={`${styles["content"]} ${
          simklCode && !installLink ? styles["content--expanded"] : ""
        }`}
      >
        <div className={styles["logos"]}>
          <img src="/stremio-logo.svg" alt="Stremio Logo" />
          <p>+</p>
          <img src="/simkl-logo.webp" alt="Simkl Logo" />
        </div>
        <h1 className={styles["title"]}>Stremio Simkl Watchlists</h1>
        <h2 className={styles["version"]}>v0.2.3</h2>

        <h2 className={styles["description"]}>
          <Balancer>
            Unofficial Stremio addon to display your Simkl Watchlists in Stremio
          </Balancer>
        </h2>

        {simklCode && !installLink && <SelectCatalogs />}

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
