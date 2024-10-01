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

// src/domain/entities/book.ts
var book_exports = {};
__export(book_exports, {
  Book: () => Book
});
module.exports = __toCommonJS(book_exports);

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

// src/domain/exceptions/invalid-name-exception.ts
var InvalidNameException = class extends DomainException {
  constructor(name) {
    super(`Invalid name (${name})`);
  }
};

// src/domain/entities/value-objects/name.ts
var Name = class {
  toString() {
    return this.value;
  }
  constructor(value) {
    const isInvalid = /.*\d.*/.test(value) || value.length < 3;
    if (isInvalid) {
      throw new InvalidNameException(value);
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

// src/domain/entities/book.ts
var Book = class _Book {
  getId() {
    return this.id.toString();
  }
  getTitle() {
    return this.title;
  }
  setTitle(title) {
    this.title = title;
  }
  getAuthor() {
    return this.author.toString();
  }
  setAuthor(author) {
    this.author = new Name(author);
  }
  getDescription() {
    return this.description;
  }
  setDescription(description) {
    this.description = description;
  }
  getPublishedAt() {
    return this.publishedAt;
  }
  setPublishedAt(publisehdAt) {
    this.publishedAt = new Date(publisehdAt);
  }
  getImageUrl() {
    return this.imageUrl;
  }
  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
  }
  constructor(id, title, author, description, publishedAt, imageUrl) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.publishedAt = publishedAt;
    this.imageUrl = imageUrl;
  }
  static create(input) {
    const id = UUID.generate();
    const publishedAt = new Date(input.publishedAt);
    const author = new Name(input.author);
    return new _Book(
      id,
      input.title,
      author,
      input.description,
      publishedAt,
      null
    );
  }
  static load(input) {
    const id = UUID.laod(input.id);
    const author = new Name(input.author);
    return new _Book(
      id,
      input.title,
      author,
      input.description,
      input.publishedAt,
      input.imageUrl
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Book
});
