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

// src/domain/entities/value-objects/name.spec.ts
describe("Name - Value-Object", () => {
  it.each(["John Doe", "John", "Albert Greg Helipson"])(
    "Should be able to create a name with a valid format",
    (value) => {
      const name = new Name(value);
      expect(name.toString()).toEqual(value);
    }
  );
  it.each(["012maria", "lu", "123456"])(
    "Should not be able to create a name containing numbers or less than 3 characters (%s)",
    (value) => {
      expect(() => new Name(value)).toThrow(InvalidNameException);
    }
  );
});
