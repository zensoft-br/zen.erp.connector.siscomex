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

  let itens = [];
  const BATCH_SIZE = 100;
  for (let i = 1; i <= duimp.itens.length; i += BATCH_SIZE) {
    const url = new URL(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/${versao}/itens`);
    url.searchParams.append('inicial', i);
    url.searchParams.append('tamanho', BATCH_SIZE);

    const response = await fetch(url.toString(), {
      headers: auth,
    });
    if (!response.ok) {
      throw new HttpError(response.status, await response.text());
    }
    
    const batch = await response.json();
    itens.push(...batch);
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
