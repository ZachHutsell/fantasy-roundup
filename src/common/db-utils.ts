import sqlite3, {type Database, type RunResult } from "sqlite3";
import constants from "./constants.js";

function getDbPromise(): Promise<Database> {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(constants.DB_PATH, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(db);
    });
  });
}

function getAllPromise(db: Database, sql: string, params: object | any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: any, rows: any[]) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getCloseDbPromise(db: Database): Promise<void> {
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

function getRunPromise(db: Database, sql: string, params = []): Promise<RunResult> {
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
