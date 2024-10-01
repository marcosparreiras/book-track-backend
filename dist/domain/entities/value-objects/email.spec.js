"use strict";

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

// src/domain/entities/value-objects/email.spec.ts
describe("Email - Value-Object", () => {
  it.each(["johndoe@example.com", "mary@doe.br", "jeff@gmail.com"])(
    "Should be able to create an email with a valid format (%s)",
    (value) => {
      const email = new Email(value);
      expect(email.toString()).toEqual(value);
    }
  );
  it.each(["johndoe.com", "john@doe", "johndoeacom"])(
    "Should not be able to create an email with invalid format (%s)",
    (value) => {
      expect(() => new Email(value)).toThrow(InvalidEmailException);
    }
  );
});
