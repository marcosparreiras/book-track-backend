"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/adapters/postgres-connection.ts
var postgres_connection_exports = {};
__export(postgres_connection_exports, {
  PgConnection: () => PgConnection
});
module.exports = __toCommonJS(postgres_connection_exports);
var import_pg = require("pg");
var PgConnection = class {
  constructor(connectionString) {
    const url = new URL(connectionString);
    this.pool = new import_pg.Pool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      port: parseInt(url.port)
    });
  }
  query(sql, params) {
    return __async(this, null, function* () {
      const client = yield this.pool.connect();
      try {
        const queryResult = yield client.query(sql, params);
        return queryResult.rows;
      } finally {
        client.release();
      }
    });
  }
  close() {
    return __async(this, null, function* () {
      yield this.pool.end();
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgConnection
});
