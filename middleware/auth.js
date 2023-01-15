import { isLoggedIn } from "../functions.js";

const authenticate = function (req, res, next) {
  isLoggedIn(req.cookies.token)
    .then(() => {
      next();
    })
    .catch(() => {
      res.redirect(`/login?red=${req.originalUrl}`);
    });
};

export { authenticate };
