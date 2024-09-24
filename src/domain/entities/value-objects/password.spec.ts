import { Password } from "./password";

describe("Password - Value-Object", () => {
  it("Should be able to create an password from a plain text", () => {
    const plainText = "mypassword";
    const password = Password.createFromPlainText(plainText);
    expect(password.getHash()).toEqual(expect.any(String));
    expect(password.getHash()).not.toEqual(plainText);
    expect(password.compare(plainText)).toEqual(true);
  });

  it("Should be able to laod an password", () => {
    const passwordToLoad = "some-password";
    const password = Password.load(passwordToLoad);
    expect(password.getHash()).toEqual(passwordToLoad);
  });
});
