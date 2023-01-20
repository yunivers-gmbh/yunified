import * as dotenv from "dotenv";
dotenv.default.config();
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";

import { authenticate } from "./middleware/auth.js";

import { loginRouter } from "./routes/login.js";

//makes __dirname usable in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, false);
        return;
      }
      const url = new URL(origin);
      const validOrigin =
        url.hostname === "localhost" ||
        url.hostname === "yunivers-ug.github.io" ||
        url.hostname.endsWith(".yunivers.de");
      cb(null, validOrigin);
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use(
  express.static("public", {
    index: false,
  })
);

app.use("/login", loginRouter);

app.get("/logout", authenticate, (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});
