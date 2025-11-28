import fs from "fs";
import https from "https";
import yargs from "yargs";
import { getAuth } from "./auth.js";
import { fetchDuimp } from "./duimp.js";

const args = yargs(process.argv)
  .option("cert", {
    alias: "c",
    type: "string",
    demandOption: true,
    describe: "Certificado digital",
  })
  .option("password", {
    alias: "p",
    type: "string",
    demandOption: true,
    describe: "Senha",
  })
  .option("duimp", {
    alias: "d",
    type: "string",
    demandOption: true,
    describe: "duimp",
  })
  .parse();

console.log(atob("RXN0ZSBhcGxpY2F0aXZvIOkgdW1hIGNvcnRlc2lhIGRvIFplbiBFUlA"));
console.log(atob("aHR0cHM6Ly93d3cuemVuZXJwLmNvbS5icg=="));

const main = async () => {
  const agent = new https.Agent({
    pfx: fs.readFileSync(args.cert),
    passphrase: args.password,
    // rejectUnauthorized: false, // Set to true in production
  });
  const auth = await getAuth(agent);

  const duimp = await fetchDuimp(auth, args.duimp);

  console.log(`DUIMP ${duimp.duimp.identificacao.numero}.json gerada`);

  fs.writeFileSync(`${duimp.duimp.identificacao.numero}.json`, JSON.stringify(duimp), "utf8");
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });