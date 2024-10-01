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

// src/adapters/in-memory/in-memory-book-repository.ts
var in_memory_book_repository_exports = {};
__export(in_memory_book_repository_exports, {
  InMemoryBookRepository: () => InMemoryBookRepository
});
module.exports = __toCommonJS(in_memory_book_repository_exports);
var InMemoryBookRepository = class {
  constructor() {
    this.items = [];
  }
  getMany(settings) {
    return __async(this, null, function* () {
      const { title } = settings.filter;
      const { page, pageSize } = settings.pageSettings;
      let books = this.items;
      if (title) {
        books = books.filter(
          (item) => item.getTitle().toLowerCase().includes(title.toLowerCase())
        );
      }
      books = books.slice(pageSize * (page - 1), page * pageSize);
      return books;
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      const book = this.items.find((item) => item.getId() === id);
      return book != null ? book : null;
    });
  }
  delete(book) {
    return __async(this, null, function* () {
      const index = this.items.findIndex((item) => item.getId() === book.getId());
      this.items.splice(index, 1);
    });
  }
  insert(book) {
    return __async(this, null, function* () {
      this.items.push(book);
    });
  }
  update(book) {
    return __async(this, null, function* () {
      const index = this.items.findIndex((item) => item.getId() === book.getId());
      this.items[index] = book;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryBookRepository
});
