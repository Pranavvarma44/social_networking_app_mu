import express from "express";
import health from "./api/health.js";

const app = express();

app.get("/health", (req, res) => health(req, res));

app.listen(4000, () => {
  console.log("Local dev server running on http://localhost:4000");
});