"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/domain/exceptions/invalid-email-exception.ts
var InvalidEmailException = class extends DomainException {
  constructor(email) {
    super(`Invalid email (${email})`);
  }
};

// src/domain/entities/value-objects/email.ts
var Email = class {
  toString() {
    return this.value;
  }
  constructor(value) {
    const isValid = /.*@.*\..*/.test(value);
    if (!isValid) {
      throw new InvalidEmailException(value);
    }
    this.value = value;
  }
};

// src/domain/entities/value-objects/password.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var Password = class _Password {
  getHash() {
    return this.hash;
  }
  compare(plainText) {
    return import_bcryptjs.default.compareSync(plainText, this.hash);
  }
  constructor(hash) {
    this.hash = hash;
  }
  static createFromPlainText(plainText) {
    const hash = import_bcryptjs.default.hashSync(plainText, 8);
    return new _Password(hash);
  }
  static load(hash) {
    return new _Password(hash);
  }
};

// src/domain/entities/user.ts
var User = class _User {
  getId() {
    return this.id.toString();
  }
  getName() {
    return this.name.toString();
  }
  getEmail() {
    return this.email.toString();
  }
  getPasswordHash() {
    return this.password.getHash();
  }
  getAvatarUrl() {
    return this.avatarUrl;
  }
  setAvatarUrl(url) {
    this.avatarUrl = url;
  }
  isAdmin() {
    return this._isAdmin;
  }
  verifyPassword(password) {
    return this.password.compare(password);
  }
  constructor(id, name, email, password, avatarUrl, isAdmin) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatarUrl = avatarUrl;
    this._isAdmin = isAdmin;
  }
  static create(input) {
    const id = UUID.generate();
    const name = new Name(input.name);
    const email = new Email(input.email);
    const password = Password.createFromPlainText(input.password);
    const avatarUrl = null;
    const isAdmin = false;
    return new _User(id, name, email, password, avatarUrl, isAdmin);
  }
  static load(input) {
    const id = UUID.laod(input.id);
    const name = new Name(input.name);
    const email = new Email(input.email);
    const password = Password.load(input.password);
    return new _User(id, name, email, password, input.avatarUrl, input.isAdmin);
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

// src/adapters/postgres-connection.ts
var import_pg = require("pg");
var PgConnection = class {
  constructor(connectionString) {
    const url = new URL(connectionString);
    this.pool = new import_pg.Pool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      port: parseInt(url.port)
    });
  }
  query(sql, params) {
    return __async(this, null, function* () {
      const client = yield this.pool.connect();
      try {
        const queryResult = yield client.query(sql, params);
        return queryResult.rows;
      } finally {
        client.release();
      }
    });
  }
  close() {
    return __async(this, null, function* () {
      yield this.pool.end();
    });
  }
};

// src/adapters/postgres-comment-repository.spec.ts
describe("ProstgresCommentRepository", () => {
  const commentRepository = new PostgresCommentRepository();
  const connectionString = "postgres://admin:admin@localhost:5432/booktrack";
  const dbConnection = new PgConnection(connectionString);
  const registry = Registry.getInstance();
  registry.register("dbConnetion", dbConnection);
  let bookId;
  let userId;
  beforeAll(() => __async(exports, null, function* () {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title"
    });
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    yield dbConnection.query(
      `
      INSERT INTO books(id, title, author, description, image_url, published_at)
      VALUES($1, $2, $3, $4, $5, $6)`,
      [
        book.getId(),
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt()
      ]
    );
    yield dbConnection.query(
      `
      INSERT INTO users(id, name, email, password, avatar_url, is_admin) 
      VALUES($1, $2, $3, $4, $5, $6)`,
      [
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getPasswordHash(),
        user.getAvatarUrl(),
        user.isAdmin()
      ]
    );
    bookId = book.getId();
    userId = user.getId();
  }));
  beforeEach(() => __async(exports, null, function* () {
    yield dbConnection.query("DELETE FROM comments");
  }));
  afterAll(() => __async(exports, null, function* () {
    yield dbConnection.query("DELETE FROM comments");
    yield dbConnection.query("DELETE FROM users");
    yield dbConnection.query("DELETE FROM books");
    yield dbConnection.close();
  }));
  it("Should be able to get comments by user and book id", () => __async(exports, null, function* () {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4
    });
    yield dbConnection.query(
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
    const result = yield commentRepository.getByUserIdAndBookId(userId, bookId);
    expect(result == null ? void 0 : result.getId()).toEqual(comment.getId());
    expect(result == null ? void 0 : result.getUserId()).toEqual(comment.getUserId());
    expect(result == null ? void 0 : result.getBookId()).toEqual(comment.getBookId());
    expect(result == null ? void 0 : result.getContent()).toEqual(comment.getContent());
    expect(result == null ? void 0 : result.getRate()).toEqual(comment.getRate());
  }));
  it("Should be able to get all comments by book id", () => __async(exports, null, function* () {
    const comments = [
      {
        bookId,
        userId,
        content: "some comment",
        rate: 4
      },
      {
        bookId,
        userId,
        content: "another comment",
        rate: 2
      },
      {
        bookId,
        userId,
        content: "last comment",
        rate: 5
      }
    ].map((data) => Comment.create(data));
    for (let comment of comments) {
      yield dbConnection.query(
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
    }
    const result = yield commentRepository.getManyByBookId(bookId);
    expect(result).toHaveLength(3);
  }));
  it("Should be able to get a comment by it's id", () => __async(exports, null, function* () {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4
    });
    yield dbConnection.query(
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
    const result = yield commentRepository.getById(comment.getId());
    expect(result == null ? void 0 : result.getId()).toEqual(comment.getId());
    expect(result == null ? void 0 : result.getUserId()).toEqual(comment.getUserId());
    expect(result == null ? void 0 : result.getBookId()).toEqual(comment.getBookId());
    expect(result == null ? void 0 : result.getContent()).toEqual(comment.getContent());
    expect(result == null ? void 0 : result.getRate()).toEqual(comment.getRate());
  }));
  it("Should be able to insert a new comment", () => __async(exports, null, function* () {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4
    });
    yield commentRepository.insert(comment);
    const queryResult = yield dbConnection.query(
      `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE id = $1
      `,
      [comment.getId()]
    );
    expect(queryResult[0].id).toEqual(comment.getId());
    expect(queryResult[0].user_id).toEqual(comment.getUserId());
    expect(queryResult[0].book_id).toEqual(comment.getBookId());
    expect(queryResult[0].content).toEqual(comment.getContent());
    expect(queryResult[0].rate).toEqual(comment.getRate());
  }));
  it("Should be able to delete a comment", () => __async(exports, null, function* () {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4
    });
    yield dbConnection.query(
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
    yield commentRepository.delete(comment);
    const queryResult = yield dbConnection.query(
      `
      SELECT id FROM comments WHERE id = $1
      `,
      [comment.getId()]
    );
    expect(queryResult).toHaveLength(0);
  }));
});
