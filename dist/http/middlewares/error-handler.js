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

// src/http/middlewares/error-handler.ts
var error_handler_exports = {};
__export(error_handler_exports, {
  errorHandlerMiddleware: () => errorHandlerMiddleware
});
module.exports = __toCommonJS(error_handler_exports);

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

// src/http/middlewares/error-handler.ts
var import_zod = require("zod");
function errorHandlerMiddleware(error, _request, response, _next) {
  if (error instanceof DomainException) {
    return response.status(error.getStatus()).json({ message: error.getMessage() });
  }
  if (error instanceof import_zod.ZodError) {
    return response.status(400).send({ message: error.format() });
  }
  return response.status(500).json({ message: "Internal server error" });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorHandlerMiddleware
});
