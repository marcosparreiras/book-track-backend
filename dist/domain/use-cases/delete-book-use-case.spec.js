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

// src/domain/use-cases/delete-book-use-case.spec.ts
describe("DeleteBookUseCase", () => {
  let sut;
  let bookRepository;
  let userRespotiroy;
  beforeEach(() => {
    sut = new DeleteBookUseCase();
    bookRepository = new InMemoryBookRepository();
    userRespotiroy = new InMemoryUserRepository();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRepository);
    registry.register("userRepository", userRespotiroy);
  });
  it("Should be able to delete a book with admin credentials", () => __async(exports, null, function* () {
    const admin = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456"
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      }
    });
    const book = Book.create({
      author: "Janny Zeff",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title"
    });
    userRespotiroy.items.push(admin);
    bookRepository.items.push(book);
    const input = {
      bookId: book.getId(),
      userId: admin.getId()
    };
    yield sut.execute(input);
    expect(bookRepository.items).toHaveLength(0);
  }));
  it("Should not be able to delete an unexistent book even with admin credentials", () => __async(exports, null, function* () {
    const admin = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456"
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      }
    });
    userRespotiroy.items.push(admin);
    const input = {
      bookId: "UNEXISTENT-BOOK-ID",
      userId: admin.getId()
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BookNotFoundException
    );
  }));
  it("Should not be able to delete a book with a normal user credential", () => __async(exports, null, function* () {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456"
    });
    const book = Book.create({
      author: "Janny Zeff",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title"
    });
    userRespotiroy.items.push(user);
    bookRepository.items.push(book);
    const input = {
      bookId: book.getId(),
      userId: user.getId()
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      NotAuthorizedException
    );
    expect(bookRepository.items).toHaveLength(1);
  }));
});
