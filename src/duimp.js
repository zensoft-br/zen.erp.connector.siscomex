import "dotenv/config";
import fetch from "node-fetch";
import { HttpError } from "./HttpError.js";
import { fetchProduto } from "./produto.js";

const SISCOMEX_URL = process.env.SISCOMEX_URL;

export async function fetchDuimp(auth, numero) {
  let versao;
  {
    const response = await fetch(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/versoes`, {
      headers: {
        ...auth,
      },
    });
    if (!response.ok) {
      throw new HttpError(response.status, await response.text());
    }
    const json = await response.json();
    versao = json.versao;
  }

  let duimp;
  {
    const response = await fetch(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/${versao}`, {
      headers: auth,
    });
    if (!response.ok) {
      throw new HttpError(response.status, await response.text());
    }
    duimp = await response.json();
  }

  let itens;
  {
    const response = await fetch(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/${versao}/itens`, {
      headers: auth,
    });
    if (!response.ok) {
      throw new HttpError(response.status, await response.text());
    }

    itens = await response.json();
  }

  for (const item of itens) {
    item.produto = {
      ...item.produto,
      ...await fetchProduto(auth, duimp.identificacao.importador.ni.substring(0, 8), item.produto.codigo, item.produto.versao),
    }
  }

  return {
    duimp,
    itens,
  }
}
