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

// src/adapters/postgres-book-repository.ts
var PostgresBookRepository = class {
  toDomain(data) {
    return Book.load({
      author: data.author,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      publishedAt: data.published_at,
      title: data.title
    });
  }
  getMany(settings) {
    return __async(this, null, function* () {
      let queryResults;
      const { title } = settings.filter;
      const { page, pageSize } = settings.pageSettings;
      if (title) {
        queryResults = yield this.connection.query(
          `SELECT id, title, author, description, image_url, published_at 
         FROM books 
         WHERE title ILIKE '%' || $1 || '%' 
         LIMIT $2 OFFSET $3`,
          [title, pageSize, pageSize * (page - 1)]
        );
      } else {
        queryResults = yield this.connection.query(
          `SELECT id, title, author, description, image_url, published_at
         FROM books
         LIMIT $1 OFFSET $2`,
          [pageSize, pageSize * (page - 1)]
        );
        console.log(queryResults);
      }
      return queryResults.map(this.toDomain);
    });
  }
  getById(id) {
    return __async(this, null, function* () {
      const queryResult = yield this.connection.query(
        "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
        [id]
      );
      if (queryResult.length === 0) {
        return null;
      }
      return this.toDomain(queryResult[0]);
    });
  }
  insert(book) {
    return __async(this, null, function* () {
      yield this.connection.query(
        `INSERT INTO
       books(id, title, author, description, image_url, published_at)
       VALUES($1, $2, $3, $4, $5, $6)`,
        [
          book.getId(),
          book.getTitle(),
          book.getAuthor(),
          book.getDescription(),
          book.getImageUrl(),
          book.getPublishedAt()
        ]
      );
    });
  }
  delete(book) {
    return __async(this, null, function* () {
      yield this.connection.query("DELETE FROM books WHERE id = $1", [
        book.getId()
      ]);
    });
  }
  update(book) {
    return __async(this, null, function* () {
      yield this.connection.query(
        `UPDATE books
       SET title = $1, author = $2, description = $3, image_url = $4, published_at = $5
       WHERE id = $6`,
        [
          book.getTitle(),
          book.getAuthor(),
          book.getDescription(),
          book.getImageUrl(),
          book.getPublishedAt(),
          book.getId()
        ]
      );
    });
  }
};
__decorateClass([
  inject("dbConnection")
], PostgresBookRepository.prototype, "connection", 2);

// src/adapters/postgres-connection.ts
var import_pg = require("pg");
var PgConnection = class {
  constructor(connectionString) {
    const url = new URL(connectionString);
    this.pool = new import_pg.Pool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      port: parseInt(url.port)
    });
  }
  query(sql, params) {
    return __async(this, null, function* () {
      const client = yield this.pool.connect();
      try {
        const queryResult = yield client.query(sql, params);
        return queryResult.rows;
      } finally {
        client.release();
      }
    });
  }
  close() {
    return __async(this, null, function* () {
      yield this.pool.end();
    });
  }
};

// src/adapters/postgres-book-repository.spec.ts
describe("PostgresBookRespository", () => {
  const connectionString = "postgres://admin:admin@localhost:5432/booktrack";
  const dbConnection = new PgConnection(connectionString);
  const bookRepository = new PostgresBookRepository();
  const registry = Registry.getInstance();
  registry.register("dbConnection", dbConnection);
  beforeEach(() => __async(exports, null, function* () {
    yield dbConnection.query("DELETE FROM books");
  }));
  afterAll(() => __async(exports, null, function* () {
    yield dbConnection.query("DELETE FROM books");
    yield dbConnection.close();
  }));
  it("Should be able to get a book by id", () => __async(exports, null, function* () {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title"
    });
    yield dbConnection.query(
      `INSERT INTO
       books(id, title, author, description, image_url, published_at)
       VALUES($1, $2, $3, $4, $5, $6)`,
      [
        book.getId(),
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt()
      ]
    );
    const result = yield bookRepository.getById(book.getId());
    expect(result).toBeInstanceOf(Book);
    expect(result == null ? void 0 : result.getId()).toEqual(book.getId());
    expect(result == null ? void 0 : result.getTitle()).toEqual(book.getTitle());
    expect(result == null ? void 0 : result.getAuthor()).toEqual(book.getAuthor());
    expect(result == null ? void 0 : result.getDescription()).toEqual(book.getDescription());
    expect(result == null ? void 0 : result.getImageUrl()).toEqual(book.getImageUrl());
    expect(result == null ? void 0 : result.getPublishedAt()).toEqual(book.getPublishedAt());
  }));
  it("Should be able to get a book by page and title filter", () => __async(exports, null, function* () {
    const books = [
      {
        author: "John Doe",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Some Title"
      },
      {
        author: "Janny Doe",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Some Title"
      },
      {
        author: "Frank Brow",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Some Title"
      },
      {
        author: "Robbert Yellow",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Super Title"
      }
    ].map((data) => Book.create(data));
    for (let book of books) {
      yield dbConnection.query(
        `INSERT INTO
       books(id, title, author, description, image_url, published_at)
       VALUES($1, $2, $3, $4, $5, $6)`,
        [
          book.getId(),
          book.getTitle(),
          book.getAuthor(),
          book.getDescription(),
          book.getImageUrl(),
          book.getPublishedAt()
        ]
      );
    }
    const result = yield bookRepository.getMany({
      pageSettings: {
        page: 2,
        pageSize: 2
      },
      filter: {
        title: "some"
      }
    });
    expect(result).toHaveLength(1);
    expect(result[0].getTitle()).toEqual("Some Title");
  }));
  it("Should be able to insert a new book", () => __async(exports, null, function* () {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title"
    });
    yield bookRepository.insert(book);
    const queryResult = yield dbConnection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [book.getId()]
    );
    expect(queryResult[0].id).toEqual(book.getId());
    expect(queryResult[0].title).toEqual(book.getTitle());
    expect(queryResult[0].author).toEqual(book.getAuthor());
    expect(queryResult[0].description).toEqual(book.getDescription());
    expect(queryResult[0].image_url).toEqual(book.getImageUrl());
    expect(queryResult[0].published_at).toEqual(book.getPublishedAt());
  }));
  it("Should be able to update a book", () => __async(exports, null, function* () {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title"
    });
    yield dbConnection.query(
      `INSERT INTO
         books(id, title, author, description, image_url, published_at)
         VALUES($1, $2, $3, $4, $5, $6)`,
      [
        book.getId(),
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt()
      ]
    );
    book.setAuthor("Janny Doe");
    book.setDescription("New description");
    book.setImageUrl("http://somenewurl.com/image");
    book.setPublishedAt("2020-01-02");
    book.setTitle("New Title");
    bookRepository.update(book);
    const queryResult = yield dbConnection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [book.getId()]
    );
    expect(queryResult[0].id).toEqual(book.getId());
    expect(queryResult[0].title).toEqual(book.getTitle());
    expect(queryResult[0].author).toEqual(book.getAuthor());
    expect(queryResult[0].description).toEqual(book.getDescription());
    expect(queryResult[0].image_url).toEqual(book.getImageUrl());
    expect(queryResult[0].published_at).toEqual(book.getPublishedAt());
  }));
  it("Should be able to delete a book", () => __async(exports, null, function* () {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Super Title"
    });
    yield dbConnection.query(
      `INSERT INTO
         books(id, title, author, description, image_url, published_at)
         VALUES($1, $2, $3, $4, $5, $6)`,
      [
        book.getId(),
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt()
      ]
    );
    yield bookRepository.delete(book);
    const queryResult = yield dbConnection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [book.getId()]
    );
    expect(queryResult).toHaveLength(0);
  }));
});
