import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let myBooks = [
    {
        id: 0,
        bookName: "Holly Bible",
        author: "God",
        dateRead: "01.01.2000",
        rating: 10,
        cover: "https://blog-cdn.reedsy.com/directories/gallery/326/large_8018faf26dbfa31402f6629c5f5b3c14.png",
        summary: "Worth to read",
        notes: [
            {
                id: 0,
                note: "good idea",
                bookId: 0,
            },
            {
                id: 1,
                note: "would read again soon",
                bookId: 0,
            },
        ],
    },
    {
        id: 1,
        bookName: "New Bible",
        author: "God",
        dateRead: "01.01.2026",
        rating: 8,
        cover: "https://blog-cdn.reedsy.com/directories/gallery/326/large_8018faf26dbfa31402f6629c5f5b3c14.png",
        summary: "Worth to read",
        notes: [
            {
                id: 0,
                note: "First part was better",
                bookId: 1,
            },
        ],
    },
];

var sorting = "ASC";

//Main page with all books covers and ratings (must be able to sort books by rating ana recency - I want to do it in query)
app.get("/", (req,res) => {
    console.log("It works now");
    console.log(req.query.sort);
    sorting = req.query.sort;
    res.render("index.ejs", {
        listTitle: "Books I Read",
        listItems: myBooks,
    });
});

//add new book

//watch book with all notes
app.get("/book/:index", (req, res) => {
    console.log(req.params.index);
    const bookId = req.params.index;
    //Later make SQL query to take book with this ID
    const bookItem = myBooks[bookId];
    res.render("book.ejs", {
        item: bookItem,
    });
});

//add new note to book

//update note
app.post("/book/:index/edit", (req, res) => {
    console.log("book index to edit " + req.params.index);
    console.log(req.body);
    const i = req.params.index;
    const n = req.body.updatedItemId;
    myBooks[i].notes[n].note = req.body.updatedItemTitle;
    const bookItem = myBooks[i];
    res.render("book.ejs", {
        item: bookItem,
    });
})


//delete note to book


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
