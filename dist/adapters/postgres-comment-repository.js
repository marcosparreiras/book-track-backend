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

// src/adapters/postgres-comment-repository.ts
var postgres_comment_repository_exports = {};
__export(postgres_comment_repository_exports, {
  PostgresCommentRepository: () => PostgresCommentRepository
});
module.exports = __toCommonJS(postgres_comment_repository_exports);

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

// src/adapters/postgres-comment-repository.ts
var PostgresCommentRepository = class {
  toDomain(data) {
    return Comment.laod({
      bookId: data.book_id,
      userId: data.user_id,
      content: data.content,
      id: data.id,
      rate: data.rate
    });
  }
  getByUserIdAndBookId(userId, bookId) {
    return __async(this, null, function* () {
      const queryResult = yield this.connection.query(
        `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE user_id = $1 AND book_id = $2
      `,
        [userId, bookId]
      );
      if (queryResult.length === 0) {
        return null;
      }
      return this.toDomain(queryResult[0]);
    });
  }
  getManyByBookId(bookId) {
    return __async(this, null, function* () {
      const queryResult = yield this.connection.query(
        `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE book_id = $1
      `,
        [bookId]
      );
      return queryResult.map(this.toDomain);
    });
  }
  getById(commentId) {
    return __async(this, null, function* () {
      const queryResult = yield this.connection.query(
        `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE id = $1
      `,
        [commentId]
      );
      if (queryResult.length === 0) {
        return null;
      }
      return this.toDomain(queryResult[0]);
    });
  }
  insert(comment) {
    return __async(this, null, function* () {
      yield this.connection.query(
        `INSERT INTO comments(id, user_id, book_id, content, rate)
      VALUES($1, $2, $3, $4, $5)`,
        [
          comment.getId(),
          comment.getUserId(),
          comment.getBookId(),
          comment.getContent(),
          comment.getRate()
        ]
      );
    });
  }
  delete(comment) {
    return __async(this, null, function* () {
      yield this.connection.query(`DELETE FROM comments WHERE id = $1`, [
        comment.getId()
      ]);
    });
  }
};
__decorateClass([
  inject("dbConnetion")
], PostgresCommentRepository.prototype, "connection", 2);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostgresCommentRepository
});
