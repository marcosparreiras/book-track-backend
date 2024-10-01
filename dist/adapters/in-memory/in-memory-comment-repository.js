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

// src/adapters/in-memory/in-memory-comment-repository.ts
var in_memory_comment_repository_exports = {};
__export(in_memory_comment_repository_exports, {
  InMemoryCommentRepository: () => InMemoryCommentRepository
});
module.exports = __toCommonJS(in_memory_comment_repository_exports);
var InMemoryCommentRepository = class {
  constructor() {
    this.items = [];
  }
  getByUserIdAndBookId(userId, bookId) {
    return __async(this, null, function* () {
      const comment = this.items.find(
        (item) => item.getBookId() === bookId && item.getUserId() === userId
      );
      return comment != null ? comment : null;
    });
  }
  getManyByBookId(bookId) {
    return __async(this, null, function* () {
      const comments = this.items.filter((item) => item.getBookId() === bookId);
      return comments;
    });
  }
  getById(commentId) {
    return __async(this, null, function* () {
      const comment = this.items.find((item) => item.getId() === commentId);
      return comment != null ? comment : null;
    });
  }
  insert(comment) {
    return __async(this, null, function* () {
      this.items.push(comment);
    });
  }
  delete(comment) {
    return __async(this, null, function* () {
      const index = this.items.findIndex(
        (item) => item.getId() === comment.getId()
      );
      this.items.splice(index, 1);
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCommentRepository
});
