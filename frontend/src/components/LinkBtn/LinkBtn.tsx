import styles from "./LinkBtn.module.scss";

export default function LinkBtn({
	href,
	children,
	onClick,
	colorsReversed,
}: {
	href?: string;
	onClick?: () => void;
	children: React.ReactNode;
	colorsReversed?: boolean;
}) {
	const className = `${styles["link-btn"]} ${
		colorsReversed ? styles["link-btn--reversed"] : ""
	}`;
	if (href) {
		return (
			<a href={href} className={className}>
				{children}
			</a>
		);
	}

	return (
		<button onClick={onClick} className={className}>
			{children}
		</button>
	);
}
