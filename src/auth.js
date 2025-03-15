import "dotenv/config";
import fs from "fs";
import https from "https";
import fetch from "node-fetch";

const SISCOMEX_URL = process.env.SISCOMEX_URL;

export async function getAuth() {
  const agent = new https.Agent({
    pfx: fs.readFileSync("./src/samson.pfx"),
    passphrase: "samson2024",
    rejectUnauthorized: false, // Set to true in production
  });

  const response = await fetch(`${SISCOMEX_URL}/portal/api/autenticar`, {
    method: "POST",
    headers: {
      "Role-Type": "IMPEXP",
    },
    agent,
  });

  if (!response.ok) {
    throw new Error(`Erro ao obter token: ${await response.text()}`);
  }

  return {
    "authorization": response.headers.get("set-token"),
    "x-csrf-token": response.headers.get("x-csrf-token"),
  };
}
