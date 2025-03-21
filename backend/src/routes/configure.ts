import { getConfig } from "@/lib/config";
import { Express } from "express";

export default function registerConfigureRoute(app: Express) {
  const handleFunc = (_req: any, res: any) => {
    res.redirect(getConfig().frontendUrl);
  };

  app.get("/:config/configure", handleFunc);
  app.get("/configure", handleFunc);
}
