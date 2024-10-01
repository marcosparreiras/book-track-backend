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

// src/adapters/in-memory/in-memory-bucket.ts
var InMemoryBucket = class {
  constructor() {
    this.images = {};
  }
  uploadImage(file, mimetype, key) {
    return __async(this, null, function* () {
      this.images[key] = { file, mimetype };
      return `http://fake-domain/images/${key}`;
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

// src/domain/exceptions/invalid-avatar-mimetype.ts
var InvalidAvatarMimetypeException = class extends DomainException {
  constructor(mimetype) {
    super(
      `Invalid avatar mimetype (${mimetype}), the supported are (jpeg|jpg|png|webp)`
    );
  }
};

// src/domain/exceptions/user-not-found-exception.ts
var UserNotFoundException = class extends DomainException {
  constructor(id) {
    super(`User not found (${id})`, 404);
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

// src/domain/use-cases/update-user-avatar-use-case.spec.ts
describe("UpdateUserAvatarUseCase", () => {
  let sut;
  let userRepository;
  let bucket;
  beforeEach(() => {
    sut = new UpdateUserAvatarUseCase();
    userRepository = new InMemoryUserRepository();
    bucket = new InMemoryBucket();
    Registry.getInstance().register("userRepository", userRepository);
    Registry.getInstance().register("bucket", bucket);
  });
  it.each(["png", "jpg", "jpeg", "webp"])(
    "Should be able to update user avatar",
    (imageFormat) => __async(exports, null, function* () {
      const user = User.create({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456"
      });
      userRepository.items.push(user);
      const input = {
        userId: user.getId(),
        avatar: Buffer.from("Fake avatar image"),
        mimetype: "image/" + imageFormat
      };
      yield sut.execute(input);
      expect(user.getAvatarUrl()).toEqual(expect.any(String));
    })
  );
  it("Should not be able to update an avatar to an invalid mimetype", () => __async(exports, null, function* () {
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });
    userRepository.items.push(user);
    const input = {
      userId: user.getId(),
      avatar: Buffer.from("Fake avatar image"),
      mimetype: "image/gif"
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidAvatarMimetypeException
    );
  }));
  it("Should not be able to update an avatar of unexistent user", () => __async(exports, null, function* () {
    const input = {
      userId: "unexistent-id",
      avatar: Buffer.from("Fake avatar image"),
      mimetype: "image/png"
    };
    yield expect(sut.execute(input)).rejects.toBeInstanceOf(
      UserNotFoundException
    );
  }));
});
