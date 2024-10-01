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

// src/http/controllers/create-comment-controller.ts
var create_comment_controller_exports = {};
__export(create_comment_controller_exports, {
  createCommentController: () => createCommentController
});
module.exports = __toCommonJS(create_comment_controller_exports);
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

// src/domain/exceptions/book-not-found-exception.ts
var BookNotFoundException = class extends DomainException {
  constructor(book) {
    super(`Book not found (${book})`);
  }
};

// src/domain/exceptions/user-maximum-comment-on-book-exceeded-exception.ts
var UserMaximumCommentOnBookExceededException = class extends DomainException {
  constructor(user, book) {
    super(`User (${user}) maximum comment on book (${book}) exceed`);
  }
};

// src/domain/exceptions/user-not-found-exception.ts
var UserNotFoundException = class extends DomainException {
  constructor(id) {
    super(`User not found (${id})`, 404);
  }
};

// src/domain/use-cases/comment-use-case.ts
var CommentUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const [user, book] = yield Promise.all([
        this.userRepository.getById(input.userId),
        this.bookRepository.getById(input.bookId)
      ]);
      if (book === null) {
        throw new BookNotFoundException(input.bookId);
      }
      if (user === null) {
        throw new UserNotFoundException(input.userId);
      }
      const isUserUnableToComment = yield this.commentRepository.getByUserIdAndBookId(
        input.userId,
        input.bookId
      );
      if (isUserUnableToComment) {
        throw new UserMaximumCommentOnBookExceededException(
          input.userId,
          input.bookId
        );
      }
      const comment = Comment.create({
        userId: input.userId,
        bookId: input.bookId,
        content: input.content,
        rate: input.rate
      });
      yield this.commentRepository.insert(comment);
      return {
        commentId: comment.getId()
      };
    });
  }
};
__decorateClass([
  inject("commentRepository")
], CommentUseCase.prototype, "commentRepository", 2);
__decorateClass([
  inject("userRepository")
], CommentUseCase.prototype, "userRepository", 2);
__decorateClass([
  inject("bookRepository")
], CommentUseCase.prototype, "bookRepository", 2);

// src/http/controllers/create-comment-controller.ts
function createCommentController(request, response, next) {
  return __async(this, null, function* () {
    const requestParamsSchema = import_zod.z.object({
      bookId: import_zod.z.string()
    });
    const requestBodySchema = import_zod.z.object({
      content: import_zod.z.string(),
      rate: import_zod.z.coerce.number()
    });
    try {
      const userId = request.userId;
      if (!userId) throw new Error();
      const { bookId } = requestParamsSchema.parse(request.params);
      const { content, rate } = requestBodySchema.parse(request.body);
      const commentUseCase = new CommentUseCase();
      const output = yield commentUseCase.execute({
        bookId,
        content,
        rate,
        userId
      });
      return response.status(201).json({ commentId: output.commentId });
    } catch (error) {
      next(error);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCommentController
});
