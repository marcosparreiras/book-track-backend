import { InvalidEmailException } from "../../exceptions/invalid-email-exception";
import { Email } from "./email";

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
