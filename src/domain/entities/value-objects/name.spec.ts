import { InvalidNameException } from "../../exceptions/invalid-name-exception";
import { Name } from "./name";

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
