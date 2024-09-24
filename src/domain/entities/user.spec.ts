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
    expect(user.getAvatarUrl()).toEqual(null);
    expect(user.isAdmin()).toEqual(false);
    expect(user.getPasswordHash()).toEqual(expect.any(String));
  });

  it("Should be able to set avatar url", () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };
    const user = User.create(input);
    const avatarUrl = "http://some-fake-avatar-url/path";
    user.setAvatarUrl(avatarUrl);
    expect(user.getAvatarUrl()).toEqual(avatarUrl);
  });

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
