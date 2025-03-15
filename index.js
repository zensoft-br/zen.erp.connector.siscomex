import fetch from "node-fetch";
import { getAuth } from "./src/auth.js";
import { writeFile } from 'fs/promises';
import { fetchDuimp } from "./src/duimp.js";

const auth = await getAuth();

const SISCOMEX_URL = process.env.SISCOMEX_URL;

// const response = await fetch("https://val.portalunico.siscomex.gov.br/duimp-api/api/ext/duimp/24BR00000195823/1", {
//   headers: auth,
// });

const json = await fetchDuimp(auth, "24BR00000195823");
console.log(JSON.stringify(json));

// const response = await fetch("https://val.portalunico.siscomex.gov.br/cadatributos/api/ext/atributo-ncm/download/json", {
//   headers: {
//     ...auth,
//   },
// });
// if (!response.ok)
//   throw new Error(await response.text());

// const buffer = Buffer.from(await response.arrayBuffer());
// await writeFile("filePath", buffer);

