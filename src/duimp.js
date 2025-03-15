import "dotenv/config";
import fetch from "node-fetch";

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
      throw new Error(`HTTP Error! Status: ${await response.text()}`);
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
      throw new Error(`HTTP Error! Status: ${await response.text()}`);
    }
    duimp = await response.json();
  }

  let itens;
  {
    const response = await fetch(`${SISCOMEX_URL}/duimp-api/api/ext/duimp/${numero}/${versao}/itens`, {
      headers: auth,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${await response.text()}`);
    }

    itens = await response.json();
  }

  return {
    duimp,
    itens,
  }
}

async function fetchDuimpItens() {
}
