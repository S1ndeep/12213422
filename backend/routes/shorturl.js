const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

const store = {}; 

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateCode() {
  return uuidv4().slice(0, 5);
}

router.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }

  const code = shortcode && /^[a-zA-Z0-9]{1,20}$/.test(shortcode)
    ? shortcode
    : generateCode();

  if (store[code]) {
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const createdAt = dayjs();
  const expiry = createdAt.add(validity || 30, "minute");

  store[code] = {
    url,
    createdAt: createdAt.toISOString(),
    expiry: expiry.toISOString(),
    clicks: [],
  };

  res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    expiry: expiry.toISOString(),
  });
});

router.get("/shorturls/:code", (req, res) => {
  const code = req.params.code;
  const data = store[code];

  if (!data) return res.status(404).json({ error: "Shortcode not found" });

  res.json({
    shortcode: code,
    originalUrl: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clickCount: data.clicks.length,
    clicks: data.clicks,
  });
});

router.get("/:code", (req, res) => {
  const code = req.params.code;
  const data = store[code];

  if (!data) return res.status(404).json({ error: "Shortcode not found" });

  const now = dayjs();
  if (now.isAfter(dayjs(data.expiry))) {
    return res.status(410).json({ error: "Link has expired" });
  }

  data.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.get("Referrer") || "direct",
    location: req.ip,
  });

  res.redirect(data.url);
});

module.exports = router;
