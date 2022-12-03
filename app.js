import * as dotenv from "dotenv";
dotenv.default.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
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

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "favicon.ico")));

app.use("/login", loginRouter);

app.get("/logout", authenticate, (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});