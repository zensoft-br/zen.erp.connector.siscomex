import express from "express";
import https from "https";
import multer from "multer";
import path from "path";
import { getAuth } from "./auth.js";
import { fetchDuimp } from "./duimp.js";
import { HttpError } from "./HttpError.js";

const publicDir =
  process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join(process.cwd(), "public")
    : path.join(process.cwd(), "src", "public");

const app = express();

// storage in memory for uploaded files
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  return res.redirect("/public/index.html");
});

app.get("/status", async (req, res) => {
  return res.json({
    service: true,
  });
});

app.use("/public", express.static(path.join(publicDir)));

app.post('/duimp/download', upload.single('certificate'), async (req, res) => {
  try {
    // validation
    if (!req.file) {
      return res.status(400).json({ error: 'Certificate file is required' });
    }

    // agent
    const agent = new https.Agent({
      pfx: req.file.buffer, // The actual file bytes from memory
      passphrase: req.body.password,
      rejectUnauthorized: true // Set to false only if the target has self-signed certs (e.g. dev environments)
    });

    // authentication
    const auth = await getAuth(agent);

    // fetch DUIMP data
    const duimp = await fetchDuimp(auth, req.body.duimp);

    // respond with DUIMP data
    return res.json(duimp);
  } catch (error) {
    console.error('Error calling external API:', error.message);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json(error.body);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
});

export default app;

