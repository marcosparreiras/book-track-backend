"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/http/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_express = __toESM(require("express"));
var import_multer = __toESM(require("multer"));

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

// src/http/middlewares/error-handler.ts
var import_zod = require("zod");
function errorHandlerMiddleware(error, _request, response, _next) {
  if (error instanceof DomainException) {
    return response.status(error.getStatus()).json({ message: error.getMessage() });
  }
  if (error instanceof import_zod.ZodError) {
    return response.status(400).send({ message: error.format() });
  }
  return response.status(500).json({ message: "Internal server error" });
}

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

// src/domain/exceptions/user-already-exists-exception.ts
var UserAlreadyExistsException = class extends DomainException {
  constructor(email) {
    super(`User with email (${email}) already exists`);
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

// src/domain/use-cases/register-user-use-case.ts
var RegisterUserUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const userExists = yield this.userRepository.getByEmail(input.email);
      if (userExists !== null) {
        throw new UserAlreadyExistsException(input.email);
      }
      const user = User.create({
        name: input.name,
        email: input.email,
        password: input.password
      });
      yield this.userRepository.insert(user);
      return { userId: user.getId() };
    });
  }
};
__decorateClass([
  inject("userRepository")
], RegisterUserUseCase.prototype, "userRepository", 2);

// src/http/controllers/register-user-controller.ts
var import_zod2 = require("zod");
function registerUserController(request, response, next) {
  return __async(this, null, function* () {
    const requestBodySchema = import_zod2.z.object({
      name: import_zod2.z.string(),
      email: import_zod2.z.string(),
      password: import_zod2.z.string()
    });
    try {
      const { name, email, password } = requestBodySchema.parse(request.body);
      const registerUserUseCase = new RegisterUserUseCase();
      const { userId } = yield registerUserUseCase.execute({
        name,
        email,
        password
      });
      return response.status(201).send({ userId });
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controllers/authenticate-user-controller.ts
var import_zod3 = require("zod");

// src/domain/exceptions/invalid-credentials-exception.ts
var InvalidCredentialsException = class extends DomainException {
  constructor() {
    super("Invalid credentials", 401);
  }
};

// src/domain/use-cases/authenticate-user-use-case.ts
var AuthenticateUserUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getByEmail(input.email);
      if (user === null) {
        throw new InvalidCredentialsException();
      }
      const isPasswordValid = user.verifyPassword(input.password);
      if (!isPasswordValid) {
        throw new InvalidCredentialsException();
      }
      return { userId: user.getId() };
    });
  }
};
__decorateClass([
  inject("userRepository")
], AuthenticateUserUseCase.prototype, "userRepository", 2);

// src/http/controllers/authenticate-user-controller.ts
function authenticateUserController(request, response, next) {
  return __async(this, null, function* () {
    const requestBodySchema = import_zod3.z.object({
      email: import_zod3.z.string(),
      password: import_zod3.z.string()
    });
    try {
      const { email, password } = requestBodySchema.parse(request.body);
      const authenticateUserUseCase = new AuthenticateUserUseCase();
      const { userId } = yield authenticateUserUseCase.execute({
        email,
        password
      });
      const token = Registry.getInstance().inject("token").sign({ userId });
      return response.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  });
}

// src/domain/exceptions/user-not-found-exception.ts
var UserNotFoundException = class extends DomainException {
  constructor(id) {
    super(`User not found (${id})`, 404);
  }
};

// src/domain/use-cases/get-user-use-case.ts
var GetUserUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getById(input.userId);
      if (user === null) {
        throw new UserNotFoundException(input.userId);
      }
      return {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        isAdmin: user.isAdmin(),
        avatarUrl: user.getAvatarUrl()
      };
    });
  }
};
__decorateClass([
  inject("userRepository")
], GetUserUseCase.prototype, "userRepository", 2);

// src/http/controllers/get-user-controller.ts
function getUserController(request, response, next) {
  return __async(this, null, function* () {
    try {
      const userId = request.userId;
      if (!userId) throw new Error();
      const getUserUseCase = new GetUserUseCase();
      const userDTO = yield getUserUseCase.execute({ userId });
      return response.status(200).json(userDTO);
    } catch (error) {
      next(error);
    }
  });
}

// src/http/middlewares/token-authentication.ts
var import_zod4 = require("zod");
function tokenAuthenticationMiddleware(request, _response, next) {
  const requestHeadersSchema = import_zod4.z.object({
    authorization: import_zod4.z.string()
  });
  try {
    const { authorization } = requestHeadersSchema.parse(request.headers);
    const token = authorization.split(" ")[1];
    const { userId } = Registry.getInstance().inject("token").verify(token);
    request.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
}

// src/domain/exceptions/invalid-avatar-mimetype.ts
var InvalidAvatarMimetypeException = class extends DomainException {
  constructor(mimetype) {
    super(
      `Invalid avatar mimetype (${mimetype}), the supported are (jpeg|jpg|png|webp)`
    );
  }
};

// src/domain/use-cases/update-user-avatar-use-case.ts
var UpdateUserAvatarUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const isMimetypeValid = /^image\/(jpeg|jpg|png|webp)$/.test(input.mimetype);
      if (!isMimetypeValid) {
        throw new InvalidAvatarMimetypeException(input.mimetype);
      }
      const user = yield this.userRepository.getById(input.userId);
      if (user === null) {
        throw new UserNotFoundException(input.userId);
      }
      const avatarUrl = yield this.bucket.uploadImage(
        input.avatar,
        input.mimetype,
        user.getId()
      );
      user.setAvatarUrl(avatarUrl);
      yield this.userRepository.update(user);
      return;
    });
  }
};
__decorateClass([
  inject("bucket")
], UpdateUserAvatarUseCase.prototype, "bucket", 2);
__decorateClass([
  inject("userRepository")
], UpdateUserAvatarUseCase.prototype, "userRepository", 2);

// src/http/controllers/update-user-avatar-controller.ts
function updateUserAvatarController(request, response, next) {
  return __async(this, null, function* () {
    try {
      const userId = request.userId;
      const file = request.file;
      if (!userId || !file) throw new Error();
      const updateUserAvatarUseCase = new UpdateUserAvatarUseCase();
      yield updateUserAvatarUseCase.execute({
        userId,
        avatar: file.buffer,
        mimetype: file.mimetype
      });
      return response.status(204).json();
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controllers/register-book-controller.ts
var import_zod5 = require("zod");

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

// src/domain/exceptions/not-authorized-exception.ts
var NotAuthorizedException = class extends DomainException {
  constructor() {
    super("Not authorized", 403);
  }
};

// src/domain/use-cases/register-book-use-case.ts
var RegisterBookUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const user = yield this.userRepository.getById(input.userId);
      if (user === null || !user.isAdmin()) {
        throw new NotAuthorizedException();
      }
      const isMimetypeValid = /^image\/(jpeg|jpg|png|webp)$/.test(input.mimetype);
      if (!isMimetypeValid) {
        throw new InvalidAvatarMimetypeException(input.mimetype);
      }
      const book = Book.create({
        title: input.title,
        description: input.description,
        author: input.author,
        publishedAt: input.publishedAt
      });
      const imageUrl = yield this.bucket.uploadImage(
        input.image,
        input.mimetype,
        book.getId()
      );
      book.setImageUrl(imageUrl);
      yield this.bookRepository.insert(book);
      return {
        bookId: book.getId()
      };
    });
  }
};
__decorateClass([
  inject("bookRepository")
], RegisterBookUseCase.prototype, "bookRepository", 2);
__decorateClass([
  inject("userRepository")
], RegisterBookUseCase.prototype, "userRepository", 2);
__decorateClass([
  inject("bucket")
], RegisterBookUseCase.prototype, "bucket", 2);

// src/http/controllers/register-book-controller.ts
function registerBookController(request, response, next) {
  return __async(this, null, function* () {
    const requestBodySchema = import_zod5.z.object({
      title: import_zod5.z.string(),
      author: import_zod5.z.string(),
      description: import_zod5.z.string(),
      publishedAt: import_zod5.z.string()
    });
    try {
      const userId = request.userId;
      const file = request.file;
      if (!userId || !file) throw Error();
      const { title, author, description, publishedAt } = requestBodySchema.parse(
        request.body
      );
      const registerBookUseCase = new RegisterBookUseCase();
      const output = yield registerBookUseCase.execute({
        userId,
        author,
        description,
        publishedAt,
        title,
        image: file.buffer,
        mimetype: file.mimetype
      });
      return response.status(201).json({ bookId: output.bookId });
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controllers/update-book-controller.ts
var import_zod6 = require("zod");

// src/domain/exceptions/book-not-found-exception.ts
var BookNotFoundException = class extends DomainException {
  constructor(book) {
    super(`Book not found (${book})`);
  }
};

// src/domain/use-cases/update-book-use-case.ts
var UpdateBookUseCase = class {
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
      book.setTitle(input.title);
      book.setAuthor(input.author);
      book.setDescription(input.description);
      book.setPublishedAt(input.publishedAt);
      yield this.bookRepository.update(book);
      return;
    });
  }
};
__decorateClass([
  inject("bookRepository")
], UpdateBookUseCase.prototype, "bookRepository", 2);
__decorateClass([
  inject("userRepository")
], UpdateBookUseCase.prototype, "userRepository", 2);

// src/http/controllers/update-book-controller.ts
function updateBookController(request, response, next) {
  return __async(this, null, function* () {
    const requestBodySchema = import_zod6.z.object({
      title: import_zod6.z.string(),
      author: import_zod6.z.string(),
      description: import_zod6.z.string(),
      publishedAt: import_zod6.z.string()
    });
    const requestParamsSchema = import_zod6.z.object({
      bookId: import_zod6.z.string()
    });
    try {
      const userId = request.userId;
      if (!userId) throw Error();
      const { title, author, description, publishedAt } = requestBodySchema.parse(
        request.body
      );
      const { bookId } = requestParamsSchema.parse(request.params);
      const updateBookUseCase = new UpdateBookUseCase();
      yield updateBookUseCase.execute({
        author,
        bookId,
        description,
        publishedAt,
        title,
        userId
      });
      return response.status(204).json();
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controllers/delete-book-controller.ts
var import_zod7 = require("zod");

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
    const requestParamsSchema = import_zod7.z.object({
      bookId: import_zod7.z.string()
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

// src/http/controllers/create-comment-controller.ts
var import_zod8 = require("zod");

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

// src/domain/exceptions/user-maximum-comment-on-book-exceeded-exception.ts
var UserMaximumCommentOnBookExceededException = class extends DomainException {
  constructor(user, book) {
    super(`User (${user}) maximum comment on book (${book}) exceed`);
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
    const requestParamsSchema = import_zod8.z.object({
      bookId: import_zod8.z.string()
    });
    const requestBodySchema = import_zod8.z.object({
      content: import_zod8.z.string(),
      rate: import_zod8.z.coerce.number()
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

// src/domain/exceptions/comment-not-found-exception.ts
var CommentNotFoundException = class extends DomainException {
  constructor(comment) {
    super(`Comment not foud (${comment})`);
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

// src/http/controllers/delete-comment-controller.ts
var import_zod9 = require("zod");
function deleteCommentController(request, response, next) {
  return __async(this, null, function* () {
    const requestParamsSchema = import_zod9.z.object({
      commentId: import_zod9.z.string()
    });
    try {
      const userId = request.userId;
      if (!userId) throw new Error();
      const { commentId } = requestParamsSchema.parse(request.params);
      const deleteCommentUseCase = new DeleteCommentUseCase();
      yield deleteCommentUseCase.execute({ commentId, userId });
      return response.status(204).json();
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controllers/get-book-controller.ts
var import_zod10 = require("zod");

// src/domain/use-cases/get-book-use-case.ts
var GetBookUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const book = yield this.bookRepository.getById(input.bookId);
      if (book === null) {
        throw new BookNotFoundException(input.bookId);
      }
      const comments = yield this.commentRepository.getManyByBookId(input.bookId);
      return {
        book: {
          id: book.getId(),
          title: book.getTitle(),
          author: book.getAuthor(),
          description: book.getDescription(),
          publishedAt: book.getPublishedAt(),
          imageUrl: book.getImageUrl(),
          comments: yield this.enrichCommentsWithUserData(comments)
        }
      };
    });
  }
  enrichCommentsWithUserData(comments) {
    return __async(this, null, function* () {
      return Promise.all(
        comments.map((comment) => __async(this, null, function* () {
          var _a, _b;
          const user = yield this.userRepository.getById(comment.getUserId());
          return {
            id: comment.getId(),
            content: comment.getContent(),
            rate: comment.getRate(),
            userName: (_a = user == null ? void 0 : user.getName()) != null ? _a : null,
            userAvatar: (_b = user == null ? void 0 : user.getAvatarUrl()) != null ? _b : null
          };
        }))
      );
    });
  }
};
__decorateClass([
  inject("bookRepository")
], GetBookUseCase.prototype, "bookRepository", 2);
__decorateClass([
  inject("commentRepository")
], GetBookUseCase.prototype, "commentRepository", 2);
__decorateClass([
  inject("userRepository")
], GetBookUseCase.prototype, "userRepository", 2);

// src/http/controllers/get-book-controller.ts
function getBookController(request, response, next) {
  return __async(this, null, function* () {
    const requestParamsSchema = import_zod10.z.object({
      bookId: import_zod10.z.string()
    });
    try {
      const { bookId } = requestParamsSchema.parse(request.params);
      const getBookUseCase = new GetBookUseCase();
      const output = yield getBookUseCase.execute({ bookId });
      return response.status(200).json({ book: output.book });
    } catch (error) {
      next(error);
    }
  });
}

// src/http/controllers/get-books-controller.ts
var import_zod11 = require("zod");

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

// src/http/controllers/get-books-controller.ts
function getBooksController(request, response, next) {
  return __async(this, null, function* () {
    const requestQuerySchema = import_zod11.z.object({
      page: import_zod11.z.coerce.number().default(1),
      pageSize: import_zod11.z.coerce.number().default(10),
      title: import_zod11.z.string().optional()
    });
    try {
      const { page, pageSize, title } = requestQuerySchema.parse(request.query);
      const getBooksUseCase = new GetBooksUseCase();
      const output = yield getBooksUseCase.execute({ page, pageSize, title });
      return response.status(200).json({
        page,
        pageSize,
        books: output.books
      });
    } catch (error) {
      next(error);
    }
  });
}

// src/http/app.ts
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.post("/users", registerUserController);
app.post("/session", authenticateUserController);
app.get("/me", tokenAuthenticationMiddleware, getUserController);
app.patch(
  "/me/avatar",
  tokenAuthenticationMiddleware,
  (0, import_multer.default)().single("avatar"),
  updateUserAvatarController
);
app.post(
  "/book",
  tokenAuthenticationMiddleware,
  (0, import_multer.default)().single("bookImage"),
  registerBookController
);
app.get("/book", getBooksController);
app.get("/book/:bookId", getBookController);
app.put("/book/:bookId", tokenAuthenticationMiddleware, updateBookController);
app.delete(
  "/book/:bookId",
  tokenAuthenticationMiddleware,
  deleteBookController
);
app.post(
  "/book/:bookId/comment",
  tokenAuthenticationMiddleware,
  createCommentController
);
app.delete(
  "/comment/:commentId",
  tokenAuthenticationMiddleware,
  deleteCommentController
);
app.use(errorHandlerMiddleware);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
