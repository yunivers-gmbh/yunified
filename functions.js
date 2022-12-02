import { db } from "./db.js";

function isLoggedIn(token) {
  return new Promise(function (resolve, reject) {
    if (!token) {
      reject();
      return;
    }
    db.serialize(() => {
      db.get(`SELECT * FROM tokens WHERE token = ?`, token, (err, row) => {
        if (err) {
          reject();
          return;
        }
        if (row && row.validUntil > Date.now()) {
          resolve();
        } else {
          reject();
        }
      });
    });
  });
}

export { isLoggedIn };
