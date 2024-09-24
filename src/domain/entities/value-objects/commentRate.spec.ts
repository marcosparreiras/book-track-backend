import { InvalidRateException } from "../../exceptions/invalid-rate-exception";
import { CommentRate } from "./commentRate";

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
