-- create table for all books
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    book_name TEXT,
    author TEXT,
    date_read DATE,
    rating INTEGER,
    cover TEXT,
    summary TEXT
);

-- create table for notes
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    note TEXT,
    book_id INTEGER REFERENCES books(id)
);

-- insert book in the test db
INSERT INTO test (book_name, date_read)
VALUES ('Mir', '01/31/2026');


