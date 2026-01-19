import "dotenv/config";
import fetch from "node-fetch";
import { HttpError } from "./HttpError.js";

const SISCOMEX_URL = process.env.SISCOMEX_URL || "https://portalunico.siscomex.gov.br";

export async function getAuth(agent) {
  const response = await fetch(`${SISCOMEX_URL}/portal/api/autenticar`, {
    method: "POST",
    headers: {
      "Role-Type": "IMPEXP",
    },
    agent,
  });
  if (!response.ok) {
    throw await HttpError.fromResponse(response);
  }

  return {
    "authorization": response.headers.get("set-token"),
    "x-csrf-token": response.headers.get("x-csrf-token"),
  };
}
