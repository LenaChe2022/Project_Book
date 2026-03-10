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
        rating: 5,
        cover: "https://blog-cdn.reedsy.com/directories/gallery/326/large_8018faf26dbfa31402f6629c5f5b3c14.png",
        summary: "Worth to read",
        notes: [
            "good idea",
            "would read again soon",
        ],
    },
    {
        id: 1,
        bookName: "New Bible",
        author: "God",
        dateRead: "01.01.2026",
        rating: 5,
        cover: "https://blog-cdn.reedsy.com/directories/gallery/326/large_8018faf26dbfa31402f6629c5f5b3c14.png",
        summary: "Worth to read",
        notes: [
            "First part was better",
        ],
    },
];

//Main page with all books covers and ratings (must be able to sort books by rating ana recency - I want to do it in query)
app.get("/", (req,res) => {
    console.log("It works now");
    res.render("index.ejs", {
        listTitle: "Books I Read",
        listItems: myBooks,
    });
});

//add new book

//watch book with all notes

//add new note to book

//update note

//delete note to book


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
