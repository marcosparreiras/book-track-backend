CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP NOT NULL
);

CREATE TABLE comments (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL, 
 book_id TEXT NOT NULL, 
 content TEXT NOT NULL,
 rate INTEGER NOT NULL,
 CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT book_fk FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);