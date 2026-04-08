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

-- insert new book in the books table
INSERT INTO books (book_name, author, date_read, rating, cover, summary)
VALUES ('Holly Bible', 'God', '01.01.2000', 10, 'https://blog-cdn.reedsy.com/directories/gallery/326/large_8018faf26dbfa31402f6629c5f5b3c14.png', 'Worth to read');

INSERT INTO books (book_name, author, date_read, rating, cover, summary)
VALUES ('New Bible', 'God', '01.01.2026', 8, 'https://blog-cdn.reedsy.com/directories/gallery/326/large_8018faf26dbfa31402f6629c5f5b3c14.png', 'Worth to read');

-- insert new note in the notes table
INSERT INTO notes (note, book_id)
VALUES ('good idea', 1);

-- get all books from old to new (1-10)
SELECT * FROM books
ORDER BY ASC;

-- get all books from new to old (10-1)
SELECT * FROM books
ORDER BY DESC;

-- get all notes
SELECT * FROM notes;

-- get all notes for one book
SELECT * FROM notes
WHERE book_id = 1;









