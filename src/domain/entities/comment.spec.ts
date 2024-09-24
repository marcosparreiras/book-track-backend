import { InvalidRateException } from "../exceptions/invalid-rate-exception";
import { Comment } from "./comment";

describe("Comment - Entity", () => {
  it("Should be able to create a comment", async () => {
    const input = {
      userId: "SOME-USER-ID",
      bookId: "SOME-BOOK-ID",
      content: "Some fake comment content",
      rate: 4,
    };
    const comment = Comment.create(input);
    expect(comment.getId()).toEqual(expect.any(String));
    expect(comment.getUserId()).toEqual(input.userId);
    expect(comment.getBookId()).toEqual(input.bookId);
    expect(comment.getContent()).toEqual(input.content);
    expect(comment.getRate()).toEqual(input.rate);
  });

  it.each([4.2, 4.5, 1.7, 6, 6.8, -1, -0.5, 100])(
    "Should not be able to create a comment with invalid rate",
    (rateValue) => {
      const input = {
        rate: rateValue,
        userId: "SOME-USER-ID",
        bookId: "SOME-BOOK-ID",
        content: "Some fake comment content",
      };
      expect(() => Comment.create(input)).toThrow(InvalidRateException);
    }
  );
});
