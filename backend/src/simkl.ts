import axios from "axios";

import { SimklHistoryResponse } from "@/types";
import { getConfig } from "./lib/config";
import { SimklMediaType } from "./lib/mediaTypes";

const SIMKL_API = "https://api.simkl.com";

async function simklApiGetRequest(url: string, token?: string) {
  try {
    return await axios.get(`${SIMKL_API}/${url}`, {
      headers: {
        "simkl-api-key": getConfig().simkl.clientId,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  } catch (error: any) {
    console.error("SIMKL API ERROR", url);

    if (error.response) console.error(error.response.data);
    if (error.message) console.error(error.message);
    return null;
  }
}

async function simklApiPostRequest(url: string, data: any, token?: string) {
  try {
    return await axios.post(`${SIMKL_API}/${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        "simkl-api-key": getConfig().simkl.clientId,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  } catch (error: any) {
    console.error("SIMKL API ERROR", url);

    if (error.response) console.error(error.response.data);
    if (error.message) console.error(error.message);
    return null;
  }
}

export async function getSimklAccessToken(
  code: string,
): Promise<string | null> {
  const result = await simklApiPostRequest("oauth/token", {
    grant_type: "authorization_code",
    code,
    client_id: getConfig().simkl.clientId,
    client_secret: getConfig().simkl.clientSecret,
    redirect_uri: "http://localhost:5173",
  });

  if (!result) return null;

  return result.data.access_token;
}

export async function getSimklUserWatchList(
  token: string,
  type: SimklMediaType,
  status: "watching" | "plantowatch" | "hold" | "completed" | "dropped",
): Promise<SimklHistoryResponse | null> {
  const result = await simklApiGetRequest(
    `sync/all-items/${type}/${status}`,
    token,
  );

  if (!result) return null;

  return result.data;
}

export async function getSimklUsername(token: string) {
  const result = await simklApiGetRequest("users/settings", token);

  if (!result || !result.data.user) return null;

  return result.data.user.name;
}
