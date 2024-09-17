import { InvalidEmailException } from "../exceptions/invalid-email-exception";
import { InvalidNameException } from "../exceptions/invalid-name-exception";
import { User } from "./user";

describe("User - Entity", () => {
  it("Should be able to create a user", () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };
    const user = User.create(input);
    expect(user.getId()).toEqual(expect.any(String));
    expect(user.getName()).toEqual(input.name);
    expect(user.getEmail()).toEqual(input.email);
  });

  it.each(["johndoe.com", "john@doe", "johndoeacom"])(
    "Should not be able to create a user with an invalid email (%s)",
    (email) => {
      const input = {
        email,
        name: "John Doe",
        password: "123456",
      };
      expect(() => User.create(input)).toThrow(InvalidEmailException);
    }
  );

  it.each(["012maria", "lu", "123456"])(
    "Should not be able to create a user with a name containing numbers or less than 3 characters (%s)",
    (name) => {
      const input = {
        name,
        email: "johndoe@example.com",
        password: "123456",
      };
      expect(() => User.create(input)).toThrow(InvalidNameException);
    }
  );

  it.each([
    { password: "123456", passwordVerification: "123456", result: true },
    { password: "123456", passwordVerification: "654321", result: false },
  ])("Should be able to verify a password", (data) => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: data.password,
    };
    const user = User.create(input);
    expect(user.verifyPassword(data.passwordVerification)).toEqual(data.result);
  });
});
