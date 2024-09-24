import { Book } from "./book";

describe("Book - Entity", () => {
  it("Should be able to create a book", () => {
    const input = {
      author: "John Doe",
      description: "Some fake book description",
      publishedAt: "2020-01-03",
      title: "Some fake book title",
    };
    const book = Book.create(input);
    expect(book.getId()).toEqual(expect.any(String));
    expect(book.getDescription()).toEqual(input.description);
    expect(book.getAuthor()).toEqual(input.author);
    expect(book.getPublishedAt().toISOString()).toEqual(
      new Date(input.publishedAt).toISOString()
    );
    expect(book.getTitle()).toEqual(input.title);
    expect(book.getImageUrl()).toEqual(null);
  });

  it("Should be able to set a image url", () => {
    const input = {
      author: "John Doe",
      description: "Some fake book description",
      publishedAt: "2020-01-03",
      title: "Some fake book title",
    };
    const book = Book.create(input);
    const imageUrl = "http://some-url/some-path";
    book.setImageUrl(imageUrl);
    expect(book.getImageUrl()).toEqual(imageUrl);
  });
});
