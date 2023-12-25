import { Express } from "express";

export default function registerConfigureRoute(app: Express) {
	const handleFunc = (_req: any, res: any) => {
		res.redirect(process.env.FRONTEND_URL!);
	};

	app.get("/:config/configure", handleFunc);
	app.get("/configure", handleFunc);
}
