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

// src/http/controllers/delete-book-controller.ts
var delete_book_controller_exports = {};
__export(delete_book_controller_exports, {
  deleteBookController: () => deleteBookController
});
module.exports = __toCommonJS(delete_book_controller_exports);
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

// src/domain/exceptions/book-not-found-exception.ts
var BookNotFoundException = class extends DomainException {
  constructor(book) {
    super(`Book not found (${book})`);
  }
};

// src/domain/exceptions/not-authorized-exception.ts
var NotAuthorizedException = class extends DomainException {
  constructor() {
    super("Not authorized", 403);
  }
};

// src/domain/use-cases/delete-book-use-case.ts
var DeleteBookUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getById(input.userId);
      if (user === null || !user.isAdmin()) {
        throw new NotAuthorizedException();
      }
      const book = yield this.bookRepository.getById(input.bookId);
      if (book === null) {
        throw new BookNotFoundException(input.bookId);
      }
      yield this.bookRepository.delete(book);
      return;
    });
  }
};
__decorateClass([
  inject("bookRepository")
], DeleteBookUseCase.prototype, "bookRepository", 2);
__decorateClass([
  inject("userRepository")
], DeleteBookUseCase.prototype, "userRepository", 2);

// src/http/controllers/delete-book-controller.ts
function deleteBookController(request, response, next) {
  return __async(this, null, function* () {
    const requestParamsSchema = import_zod.z.object({
      bookId: import_zod.z.string()
    });
    try {
      const userId = request.userId;
      if (!userId) throw new Error();
      const { bookId } = requestParamsSchema.parse(request.params);
      const deleteBookUseCase = new DeleteBookUseCase();
      yield deleteBookUseCase.execute({ bookId, userId });
      return response.status(204).json();
    } catch (error) {
      next(error);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteBookController
});
