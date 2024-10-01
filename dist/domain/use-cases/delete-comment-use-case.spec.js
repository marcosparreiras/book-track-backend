"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// src/adapters/in-memory/in-memory-comment-repository.ts
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

// src/domain/exceptions/comment-not-found-exception.ts
var CommentNotFoundException = class extends DomainException {
  constructor(comment) {
    super(`Comment not foud (${comment})`);
  }
};

// src/domain/exceptions/not-authorized-exception.ts
var NotAuthorizedException = class extends DomainException {
  constructor() {
    super("Not authorized", 403);
  }
};

// src/domain/use-cases/delete-comment-use-case.ts
var DeleteCommentUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const comment = yield this.commentRepository.getById(input.commentId);
      if (comment === null) {
        throw new CommentNotFoundException(input.commentId);
      }
      if (comment.getUserId() !== input.userId) {
        throw new NotAuthorizedException();
      }
      yield this.commentRepository.delete(comment);
      return;
    });
  }
};
__decorateClass([
  inject("commentRepository")
], DeleteCommentUseCase.prototype, "commentRepository", 2);

// src/domain/use-cases/delete-comment-use-case.spec.ts
describe("DeleteCommentUseCase", () => {
  let sut;
  let commentRepository;
  beforeEach(() => {
    sut = new DeleteCommentUseCase();
    commentRepository = new InMemoryCommentRepository();
    const registry = Registry.getInstance();
    registry.register("commentRepository", commentRepository);
  });
  it("Should be able to delete a user comment with a user credentials", () => __async(exports, null, function* () {
    const comment = Comment.create({
      bookId: "BOOK-ID",
      userId: "USER-ID",
      content: "Some fake content",
      rate: 4
    });
    commentRepository.items.push(comment);
    const input = {
      userId: comment.getUserId(),
      commentId: comment.getId()
    };
    yield sut.execute(input);
    expect(commentRepository.items).toHaveLength(0);
  }));
  it("Should not be able to delete another user comment with a user credentials", () => __async(exports, null, function* () {
    const comment = Comment.create({
      bookId: "BOOK-ID",
      userId: "USER-ID",
      content: "Some fake content",
      rate: 4
    });
    commentRepository.items.push(comment);
    const input = {
      userId: "ANOTHER-USER-ID",
      commentId: comment.getId()
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      NotAuthorizedException
    );
    expect(commentRepository.items).toHaveLength(1);
  }));
  it("Should not be able to delete an unexistent comment", () => __async(exports, null, function* () {
    const input = {
      userId: "USER-ID",
      commentId: "COMMENT-ID"
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      CommentNotFoundException
    );
  }));
});
