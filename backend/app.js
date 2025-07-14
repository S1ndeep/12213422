const express = require("express");
const cors = require("cors");
const shortRoutes = require("./routes/shorturl");
const logger = require('../LoggingMiddleware/backendlogger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger); 

app.use("/", shortRoutes);

app.get('/', async (req, res) => {
    await Log("backend", "info", "app", "Root route hit");
    res.send("Backend OK");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
