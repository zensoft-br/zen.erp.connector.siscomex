import fs from "fs";
import https from "https";
import { getAuth } from "../src/auth.js";
import { fetchDuimp } from "../src/duimp.js";
import { fetchProduto } from "../src/produto.js";

const agent = new https.Agent({
  pfx: fs.readFileSync("./tmp/samson.pfx"),
  passphrase: process.env.PFX_PASSWORD,
  // rejectUnauthorized: false, // Set to true in production
});

const auth = await getAuth(agent);

const json = await fetchDuimp(auth, "24BR00000195823");
console.log(JSON.stringify(json));

// const produto = await fetchProduto(auth, "26766610", "38", "2");
// console.log(JSON.stringify(produto));
