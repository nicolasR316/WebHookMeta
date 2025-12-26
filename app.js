const express = require("express");
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// ✅ Render health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Simple homepage so you can open the URL in a browser and see "it's alive"
app.get("/", (req, res) => {
  res.status(200).send("WebHookMeta is live 🚀 Use /webhook for Meta verification.");
});

// ✅ Meta webhook verification (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ✅ Meta webhook events (POST)
app.post("/webhook", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// IMPORTANT: Render expects you to listen on PORT. No need to hardcode 0.0.0.0 here.
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
