"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/adapters/token.ts
var token_exports = {};
__export(token_exports, {
  JwtToken: () => JwtToken
});
module.exports = __toCommonJS(token_exports);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/domain/exceptions/domain-exception.ts
var DomainException = class extends Error {
  getMessage() {
    return this.message;
  }
  getStatus() {
    return this.status;
  }
  constructor(message, status) {
    super(message);
    this.status = status != null ? status : 400;
  }
};

// src/adapters/token.ts
var JwtToken = class {
  constructor(secret) {
    this.secret = secret;
  }
  sign(payload) {
    const token = import_jsonwebtoken.default.sign(payload, this.secret, { expiresIn: 60 * 60 * 24 });
    return token;
  }
  verify(token) {
    try {
      const payload = import_jsonwebtoken.default.verify(token, this.secret);
      const payloadIsInvalid = typeof payload === "string" || typeof payload.userId !== "string";
      if (payloadIsInvalid) {
        throw new Error();
      }
      return { userId: payload.userId };
    } catch (e) {
      throw new DomainException("Invalid token", 403);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JwtToken
});
