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

// src/http/controllers/authenticate-user-controller.ts
var authenticate_user_controller_exports = {};
__export(authenticate_user_controller_exports, {
  authenticateUserController: () => authenticateUserController
});
module.exports = __toCommonJS(authenticate_user_controller_exports);
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
    const requestBodySchema = import_zod.z.object({
      email: import_zod.z.string(),
      password: import_zod.z.string()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateUserController
});
