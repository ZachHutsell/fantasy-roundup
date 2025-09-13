import sqlite3 from "sqlite3";
import constants from "../constants.js";

function getDbPromise() {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(constants.DB_PATH, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(db);
    });
  });
}

function getAllPromise(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getCloseDbPromise(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        return reject(err);
      }
      // console.log("connection closed");
      resolve();
    });
  });
}

function getRunPromise(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this);
    });
  });
}

export { getDbPromise, getAllPromise, getCloseDbPromise, getRunPromise };
