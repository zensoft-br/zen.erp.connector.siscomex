import "dotenv/config";
import fetch from "node-fetch";
import { HttpError } from "./HttpError.js";

const SISCOMEX_URL = process.env.SISCOMEX_URL;

export async function fetchProduto(auth, cnpj, codigo, versao) {
  const response = await fetch(`${SISCOMEX_URL}/catp/api/ext/produto/${cnpj}/${codigo}/${versao}`, {
    headers: {
      ...auth,
    },
  });
  if (!response.ok) {
    throw new HttpError(response.status, await response.text());
  }
  const json = await response.json();
  return json;
}
