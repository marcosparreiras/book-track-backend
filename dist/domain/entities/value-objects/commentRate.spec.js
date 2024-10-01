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

// src/domain/entities/value-objects/commentRate.spec.ts
describe("CommentRate - Value-Object", () => {
  it.each([1, 2, 3, 4, 5])(
    "Should be able to create an comment-rate with a valid rate number",
    (value) => {
      const rate = new CommentRate(value);
      expect(rate.toNumber()).toEqual(value);
    }
  );
  it.each([-1, -100, -0.4, 0.3, 1.5, 4.3, 5.1, 6, 7, 29])(
    "Should not be able to create an email with invalid format (%s)",
    (value) => {
      expect(() => new CommentRate(value)).toThrow(InvalidRateException);
    }
  );
});
