"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/adapters/in-memory/in-memory-book-repository.ts
var InMemoryBookRepository = class {
  constructor() {
    this.items = [];
  }
  getMany(settings) {
    return __async(this, null, function* () {
      const { title } = settings.filter;
      const { page, pageSize } = settings.pageSettings;
      let books = this.items;
      if (title) {
        books = books.filter(
          (item) => item.getTitle().toLowerCase().includes(title.toLowerCase())
        );
      }
      books = books.slice(pageSize * (page - 1), page * pageSize);
      return books;
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      const book = this.items.find((item) => item.getId() === id);
      return book != null ? book : null;
    });
  }
  delete(book) {
    return __async(this, null, function* () {
      const index = this.items.findIndex((item) => item.getId() === book.getId());
      this.items.splice(index, 1);
    });
  }
  insert(book) {
    return __async(this, null, function* () {
      this.items.push(book);
    });
  }
  update(book) {
    return __async(this, null, function* () {
      const index = this.items.findIndex((item) => item.getId() === book.getId());
      this.items[index] = book;
    });
  }
};

// src/domain/bondaries/registry.ts
var Registry = class _Registry {
  constructor() {
    this.container = {};
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _Registry();
    }
    return this.instance;
  }
  register(key, value) {
    this.container[key] = value;
  }
  inject(key) {
    return this.container[key];
  }
};
function inject(key) {
  return function(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return Registry.getInstance().inject(key);
      }
    });
  };
}

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

// src/domain/entities/value-objects/uuid.ts
var import_node_crypto = require("crypto");
var UUID = class _UUID {
  toString() {
    return this.value;
  }
  constructor(value) {
    this.value = value;
  }
  static generate() {
    const id = (0, import_node_crypto.randomUUID)();
    return new _UUID(id);
  }
  static laod(value) {
    return new _UUID(value);
  }
};

// src/domain/entities/book.ts
var Book = class _Book {
  getId() {
    return this.id.toString();
  }
  getTitle() {
    return this.title;
  }
  setTitle(title) {
    this.title = title;
  }
  getAuthor() {
    return this.author.toString();
  }
  setAuthor(author) {
    this.author = new Name(author);
  }
  getDescription() {
    return this.description;
  }
  setDescription(description) {
    this.description = description;
  }
  getPublishedAt() {
    return this.publishedAt;
  }
  setPublishedAt(publisehdAt) {
    this.publishedAt = new Date(publisehdAt);
  }
  getImageUrl() {
    return this.imageUrl;
  }
  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
  }
  constructor(id, title, author, description, publishedAt, imageUrl) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.publishedAt = publishedAt;
    this.imageUrl = imageUrl;
  }
  static create(input) {
    const id = UUID.generate();
    const publishedAt = new Date(input.publishedAt);
    const author = new Name(input.author);
    return new _Book(
      id,
      input.title,
      author,
      input.description,
      publishedAt,
      null
    );
  }
  static load(input) {
    const id = UUID.laod(input.id);
    const author = new Name(input.author);
    return new _Book(
      id,
      input.title,
      author,
      input.description,
      input.publishedAt,
      input.imageUrl
    );
  }
};

// src/domain/exceptions/invalid-page-parameters-exception.ts
var InvalidPageParametersException = class extends DomainException {
  constructor() {
    super("Invalid page parameters");
  }
};

// src/domain/use-cases/get-books-use-case.ts
var GetBooksUseCase = class {
  constructor() {
  }
  execute(input) {
    return __async(this, null, function* () {
      const isPageSizeValid = input.pageSize > 0;
      const isPageValid = input.page > 0;
      if (!isPageSizeValid || !isPageValid) {
        throw new InvalidPageParametersException();
      }
      const books = yield this.bookRepository.getMany({
        pageSettings: {
          pageSize: input.pageSize,
          page: input.page
        },
        filter: {
          title: input.title
        }
      });
      return {
        books: books.map((book) => ({
          author: book.getAuthor(),
          description: book.getDescription(),
          id: book.getId(),
          imageUrl: book.getImageUrl(),
          publishedAt: book.getPublishedAt(),
          title: book.getTitle()
        }))
      };
    });
  }
};
__decorateClass([
  inject("bookRepository")
], GetBooksUseCase.prototype, "bookRepository", 2);

// src/domain/use-cases/get-books-use-case.spec.ts
describe("GetBooksUseCase", () => {
  let sut;
  let bookRepository;
  beforeEach(() => {
    sut = new GetBooksUseCase();
    bookRepository = new InMemoryBookRepository();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRepository);
  });
  it("Should be able to get books by page and set the page size", () => __async(exports, null, function* () {
    const books = [
      {
        title: "Book 00",
        author: "Author AA",
        description: "Description 00",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 01",
        author: "Author AA",
        description: "Description 01",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 02",
        author: "Author BB",
        description: "Description 02",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 03",
        author: "Author BB",
        description: "Description 03",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 04",
        author: "Author CC",
        description: "Description 04",
        publishedAt: "2020-01-01"
      }
    ].map((data) => Book.create(data));
    bookRepository.items.push(...books);
    const page01 = yield sut.execute({ pageSize: 3, page: 1 });
    const page02 = yield sut.execute({ pageSize: 3, page: 2 });
    expect(page01.books).toHaveLength(3);
    expect(page02.books).toHaveLength(2);
    expect(page01.books[0]).toBeInstanceOf(Book);
  }));
  it.only("Should be able to search books by title", () => __async(exports, null, function* () {
    const books = [
      {
        title: "Book a00 ",
        author: "Author AA",
        description: "Description 00",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book a01",
        author: "Author AA",
        description: "Description 01",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 02",
        author: "Author BB",
        description: "Description 02",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 03",
        author: "Author BB",
        description: "Description 03",
        publishedAt: "2020-01-01"
      },
      {
        title: "Book 04",
        author: "Author CC",
        description: "Description 04",
        publishedAt: "2020-01-01"
      }
    ].map((data) => Book.create(data));
    bookRepository.items.push(...books);
    const search01 = yield sut.execute({
      pageSize: books.length,
      page: 1,
      title: "boo"
    });
    const search02 = yield sut.execute({
      pageSize: books.length,
      page: 1,
      title: "A0"
    });
    expect(search01.books).toHaveLength(books.length);
    expect(search02.books).toHaveLength(2);
    expect(search02.books[0].title).toContain("a0");
    expect(search01.books[0]).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        description: expect.any(String),
        id: expect.any(String),
        imageUrl: null,
        publishedAt: expect.any(Date),
        title: expect.any(String)
      })
    );
  }));
  it("Should not be able to set a page size less then 1", () => __async(exports, null, function* () {
    const input = {
      pageSize: 0,
      page: 1
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidPageParametersException
    );
  }));
  it("Should not be able to searh for pages less then 1", () => __async(exports, null, function* () {
    const input = {
      pageSize: 4,
      page: 0
    };
    yield expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidPageParametersException
    );
  }));
});
