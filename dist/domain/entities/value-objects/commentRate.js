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

// src/domain/entities/value-objects/commentRate.ts
var commentRate_exports = {};
__export(commentRate_exports, {
  CommentRate: () => CommentRate
});
module.exports = __toCommonJS(commentRate_exports);

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

// src/domain/exceptions/invalid-rate-exception.ts
var InvalidRateException = class extends DomainException {
  constructor(rate) {
    super(`Invalid rate (${rate})`);
  }
};

// src/domain/entities/value-objects/commentRate.ts
var CommentRate = class {
  toNumber() {
    return this.value;
  }
  constructor(value) {
    const isValid = value >= 0 && value <= 5 && Number.isInteger(value);
    if (!isValid) {
      throw new InvalidRateException(value);
    }
    this.value = value;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CommentRate
});
