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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
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

// src/domain/use-cases/get-books-use-case.ts
var get_books_use_case_exports = {};
__export(get_books_use_case_exports, {
  GetBooksUseCase: () => GetBooksUseCase
});
module.exports = __toCommonJS(get_books_use_case_exports);

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
function inject(key) {
  return function(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return Registry.getInstance().inject(key);
      }
    });
  };
}

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

// src/domain/exceptions/invalid-page-parameters-exception.ts
var InvalidPageParametersException = class extends DomainException {
  constructor() {
    super("Invalid page parameters");
  }
};

// src/domain/use-cases/get-books-use-case.ts
var GetBooksUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const isPageSizeValid = input.pageSize > 0;
      const isPageValid = input.page > 0;
      if (!isPageSizeValid || !isPageValid) {
        throw new InvalidPageParametersException();
      }
      const books = yield this.bookRepository.getMany({
        pageSettings: {
          pageSize: input.pageSize,
          page: input.page
        },
        filter: {
          title: input.title
        }
      });
      return {
        books: books.map((book) => ({
          author: book.getAuthor(),
          description: book.getDescription(),
          id: book.getId(),
          imageUrl: book.getImageUrl(),
          publishedAt: book.getPublishedAt(),
          title: book.getTitle()
        }))
      };
    });
  }
};
__decorateClass([
  inject("bookRepository")
], GetBooksUseCase.prototype, "bookRepository", 2);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetBooksUseCase
});
