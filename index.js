import express from "express";
import pg from "pg";
import dotenv from "dtenv";
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

//Main page with all books covers and ratings (must be able to sort books by rating ana recency - I want to do it in query)


//add new book

//watch book with all notes

//add new note to book

//update note

//delete note to book


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
