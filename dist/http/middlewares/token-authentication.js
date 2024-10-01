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

// src/http/middlewares/token-authentication.ts
var token_authentication_exports = {};
__export(token_authentication_exports, {
  tokenAuthenticationMiddleware: () => tokenAuthenticationMiddleware
});
module.exports = __toCommonJS(token_authentication_exports);
var import_zod = require("zod");

// src/domain/bondaries/registry.ts
var Registry = class _Registry {
  constructor() {
    this.container = {};
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _Registry();
    }
    return this.instance;
  }
  register(key, value) {
    this.container[key] = value;
  }
  inject(key) {
    return this.container[key];
  }
};

// src/http/middlewares/token-authentication.ts
function tokenAuthenticationMiddleware(request, _response, next) {
  const requestHeadersSchema = import_zod.z.object({
    authorization: import_zod.z.string()
  });
  try {
    const { authorization } = requestHeadersSchema.parse(request.headers);
    const token = authorization.split(" ")[1];
    const { userId } = Registry.getInstance().inject("token").verify(token);
    request.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tokenAuthenticationMiddleware
});
