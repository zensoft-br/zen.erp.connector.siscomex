import "dotenv/config";
import fetch from "node-fetch";
import { HttpError } from "./HttpError.js";
import { fetchProduto } from "./produto.js";

const SISCOMEX_URL = process.env.SISCOMEX_URL || "https://portalunico.siscomex.gov.br";

export async function fetchDuimp(auth, numero) {
  // fetch latest version number
  let versao;
  {
    const response = await fetch(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/versoes`, {
      headers: {
        ...auth,
      },
    });
    if (!response.ok) {
      throw await HttpError.fromResponse(response);
    }
    const json = await response.json();
    versao = json.versao;
  }

  // fetch duimp data
  let duimp;
  {
    const response = await fetch(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/${versao}`, {
      headers: auth,
    });
    if (!response.ok) {
      throw await HttpError.fromResponse(response);
    }
    duimp = await response.json();
  }

  // load items in batches of 100
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
      throw await HttpError.fromResponse(response);
    }

    const batch = await response.json();
    itens.push(...batch);
  }

  // fetch product details for each item
  for (const item of itens) {
    item.produto = {
      ...item.produto,
      ...await fetchProduto(auth, duimp.identificacao.importador.ni.substring(0, 8), item.produto.codigo, item.produto.versao),
    }
  }

  // merge item data back into duimp
  for (const item of duimp.itens) {
    Object.assign(item, itens.find(e => e.identificacao.numeroItem === item.indice));
  }

  return {
    duimp,
    // TODO remove this in future versions
    itens,
  }
}
