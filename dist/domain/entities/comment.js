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

// src/domain/entities/comment.ts
var comment_exports = {};
__export(comment_exports, {
  Comment: () => Comment
});
module.exports = __toCommonJS(comment_exports);

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

// src/domain/entities/value-objects/uuid.ts
var import_node_crypto = require("crypto");
var UUID = class _UUID {
  toString() {
    return this.value;
  }
  constructor(value) {
    this.value = value;
  }
  static generate() {
    const id = (0, import_node_crypto.randomUUID)();
    return new _UUID(id);
  }
  static laod(value) {
    return new _UUID(value);
  }
};

// src/domain/entities/comment.ts
var Comment = class _Comment {
  getId() {
    return this.id.toString();
  }
  getUserId() {
    return this.userId.toString();
  }
  getBookId() {
    return this.bookId.toString();
  }
  getContent() {
    return this.content;
  }
  getRate() {
    return this.rate.toNumber();
  }
  constructor(id, userId, bookId, content, rate) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.content = content;
    this.rate = rate;
  }
  static create(input) {
    const id = UUID.generate();
    const userId = UUID.laod(input.userId);
    const bookId = UUID.laod(input.bookId);
    const rate = new CommentRate(input.rate);
    return new _Comment(id, userId, bookId, input.content, rate);
  }
  static laod(input) {
    const id = UUID.laod(input.id);
    const bookId = UUID.laod(input.bookId);
    const userId = UUID.laod(input.userId);
    const rate = new CommentRate(input.rate);
    return new _Comment(id, userId, bookId, input.content, rate);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Comment
});
