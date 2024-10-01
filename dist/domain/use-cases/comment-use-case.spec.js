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

// src/adapters/in-memory/in-memory-book-repository.ts
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

// src/adapters/in-memory/in-memory-user-repository.ts
var InMemoryUserRepository = class {
  constructor() {
    this.items = [];
  }
  getById(id) {
    return __async(this, null, function* () {
      const user = this.items.find((item) => item.getId() === id);
      return user != null ? user : null;
    });
  }
  getByEmail(email) {
    return __async(this, null, function* () {
      const user = this.items.find((item) => item.getEmail() === email);
      return user != null ? user : null;
    });
  }
  insert(user) {
    return __async(this, null, function* () {
      this.items.push(user);
    });
  }
  update(user) {
    return __async(this, null, function* () {
      const userIndex = this.items.findIndex(
        (item) => item.getId() === user.getId()
      );
      this.items[userIndex] = user;
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

// src/domain/use-cases/comment-use-case.spec.ts
describe("CommentUseCase", () => {
  let sut;
  let commentRepository;
  let userRepository;
  let bookRepository;
  beforeEach(() => {
    sut = new CommentUseCase();
    commentRepository = new InMemoryCommentRepository();
    userRepository = new InMemoryUserRepository();
    bookRepository = new InMemoryBookRepository();
    const registry = Registry.getInstance();
    registry.register("commentRepository", commentRepository);
    registry.register("userRepository", userRepository);
    registry.register("bookRepository", bookRepository);
  });
  it("Should be able to create a user comment on a book", () => __async(exports, null, function* () {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456"
    });
    const book = Book.create({
      author: "Janny Frank",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title"
    });
    userRepository.items.push(user);
    bookRepository.items.push(book);
    const input = {
      userId: user.getId(),
      bookId: book.getId(),
      content: "Some comment",
      rate: 4
    };
    const output = yield sut.execute(input);
    expect(output.commentId).toEqual(expect.any(String));
    expect(commentRepository.items).toHaveLength(1);
    const commentOnRepository = commentRepository.items.find(
      (item) => item.getId() === output.commentId
    );
    expect(commentOnRepository == null ? void 0 : commentOnRepository.getContent()).toEqual(input.content);
    expect(commentOnRepository == null ? void 0 : commentOnRepository.getRate()).toEqual(input.rate);
    expect(commentOnRepository == null ? void 0 : commentOnRepository.getUserId()).toEqual(input.userId);
    expect(commentOnRepository == null ? void 0 : commentOnRepository.getBookId()).toEqual(input.bookId);
  }));
  it("Should not be able to create more than one user comment on a book", () => __async(exports, null, function* () {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456"
    });
    const book = Book.create({
      author: "Janny Frank",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title"
    });
    const comment = Comment.create({
      userId: user.getId(),
      bookId: book.getId(),
      content: "Some fake comment!!",
      rate: 2
    });
    userRepository.items.push(user);
    bookRepository.items.push(book);
    commentRepository.items.push(comment);
    const input = {
      userId: user.getId(),
      bookId: book.getId(),
      content: "Some comment",
      rate: 4
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserMaximumCommentOnBookExceededException
    );
  }));
  it("Should not be able to create an unexistent user comment on a book", () => __async(exports, null, function* () {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456"
    });
    userRepository.items.push(user);
    const input = {
      userId: user.getId(),
      bookId: "UNEXISTENT-BOOK-ID",
      content: "Some comment",
      rate: 4
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BookNotFoundException
    );
  }));
  it("Should not be able to create an user comment on an unexistent book", () => __async(exports, null, function* () {
    const book = Book.create({
      author: "Janny Frank",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title"
    });
    bookRepository.items.push(book);
    const input = {
      userId: "UNEXISTENT-USER-ID",
      bookId: book.getId(),
      content: "Some comment",
      rate: 4
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserNotFoundException
    );
  }));
});
