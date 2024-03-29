import { randomUUID as uuidv4 } from "node:crypto";
import express from "express";
import { db } from "../db.js";
import { isLoggedIn } from "../functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  isLoggedIn(req.cookies.token)
    .then(() => {
      res.redirect("/");
    })
    .catch(() => {
      res.render("login", {
        error: false,
        redirect: req.query.red,
      });
    });
});

router.post("/", (req, res) => {
  if (req.body.password === process.env.PASSWORD) {
    let token = uuidv4();
    let cookieDuration = 1000 * 60 * 60 * 24 * 5;
    let timeout = Date.now() + cookieDuration;
    db.serialize(() => {
      db.run(
        `INSERT INTO tokens (token, validUntil) VALUES("${token}", "${timeout}")`
      );
    });
    res.cookie("token", token, {
      maxAge: cookieDuration,
      httpOnly: true,
      domain: process.env.COOKIE_DOMAIN,
    });
    console.log(req.body.redirect);
    res.redirect(req.body.redirect ? req.body.redirect : "/");
  } else {
    res.render("login", { error: true, redirect: req.body.redirect });
  }
});

router.post("/auth", (req, res) => {
  isLoggedIn(req.body.token)
    .then(() => {
      res.json({ success: true });
    })
    .catch(() => {
      res.json({ success: false });
    });
});

export { router as loginRouter };
