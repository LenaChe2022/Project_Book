import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";

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

async function getOpenLibraryCover(title, author) {
    // Search and get cover in one call (if available)
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(title)}+${encodeURIComponent(author)}&fields=cover_i,cover_edition_key&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.docs && data.docs[0] && data.docs[0].cover_i) {
      // cover_i gives you a direct image ID
      const bookImg = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
      console.log(bookImg);
      return bookImg;
    }
    return null;
  }

//   async function getOpenLibraryCoverAxios(title, author) {
//     const generalUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(author)}+${encodeURIComponent(title)}&fields=key,title,author_name,editions`;
//     console.log(generalUrl);

//     try {
//         const response = await axios.get(generalUrl);
//         const bookResponse = JSON.parse(response);
//         console.log("what I got on response:   " + bookResponse);
//         console.log (bookResponse.data.doc[0].editions);
//         return bookResponse.doc[0].editions.docs[0].key; 
//     } catch (error) {
//         console.error("Failed to get book key", error.message);
//         return "No image";
//     }
//   }

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

//form to add new book
app.get("/add", (req, res) => {
    console.log("Prepare to enter new book");
    res.render("new_book.ejs");
});

//add new book (using openlibrary API) 
app.post("/add", async (req, res) => {
    console.log("new book object: ");
    console.log(req.body);

    const author = req.body.author;
    const title = req.body.bookName;

    //First, I need to get OLID Key number using Author and Book Title

    const generalUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(author)}+${encodeURIComponent(title)}&fields=key,title,author_name,editions`;
    console.log(generalUrl);

   
    try {
        const response = await axios.get(generalUrl);
        const bookResponse = response.data;
        console.log(response);
        console.log (bookResponse.docs[0].editions);
        
        const bookKey = bookResponse.docs[0].editions.docs[0].key;
        console.log("the key I get  " + bookKey);

        const bookCoverKey = bookKey.replace('/books/', '');
        
        //With OLID key value I can get the link to a picture
        //https://covers.openlibrary.org/b/$key/$value-$size.jpg

        const bookCover = `https://covers.openlibrary.org/b/olid/${bookCoverKey}-L.jpg`;
        console.log("The book cover reference: " + bookCover);

        const newBook = {
            id: myBooks.length,
            bookName: req.body.bookName,
            author: req.body.author,
            dateRead: req.body.dateRead,
            rating: req.body.myRate,
            cover: bookCover || "https://bookshow.blurb.com/bookshow/cache/P11360640/md/cover_2.jpeg?access_key=675523b769268bce5b0b710b3d0e7841",
            summary: req.body.mySummary,
            notes: [],
        };

        myBooks.push(newBook);

        res.render("index.ejs", {
            listTitle: "Books I Read",
            listItems: myBooks,
        });

        
    } catch (error) {
        console.error("Failed to get book key", error.message);
        return "No image";
    }
  
         
});

//delete a book
app.post("/book/delete/:index", (req, res) => {
    console.log("Book to delete: " + req.params.index);
    const n = req.params.index;

    //delete a bok in DB

    res.redirect('/');

    

});

//page to edit a book
app.get("/book/edit/:index", (req, res) => {
    console.log("Book to edit: " + req.params.index);

    const bookId = req.params.index;

    const bookItem = myBooks[bookId];

    res.render("book_edit.ejs", {
        item: bookItem,
    });

});

app.post("/book/edit/:index", (req, res) => {
    console.log("Book to edit: " + req.params.index);

    console.log(req.body);

    const newData = req.body;

    const bookId = req.params.index;

    if (newData.bookName == '') {
        console.log ("Book Title didn't change");
    } else {
        myBooks[bookId].bookName = newData.bookName;
    }

    if (newData.author == '') {
        console.log ("Author didn't change");
    } else {
        myBooks[bookId].author = newData.author;
    }

    if (newData.dateRead) {
        myBooks[bookId].dateRead = newData.dateRead;
    }

    if (newData.mySummary) {
        myBooks[bookId].summary = newData.mySummary;
    }

    if (newData.myRate) {
        myBooks[bookId].rating = newData.myRate;
    }

    console.log("New Data of Book " + bookId);
    console.log(myBooks[bookId]);

    

    res.redirect('/');

});


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
app.post("/book/:index/add", (req, res) => {
    console.log("add new note " + req.body.newNote + " to book N: " + req.params.index);
    const newNote = req.body.newNote;
    const bookId = req.params.index;

    //To replace with DB Query for adding note
    if (newNote) {
      const n = myBooks[bookId].notes.length;
      const noteBD = {
        id: n,
        note: newNote,
        bookId: bookId,
        }
      myBooks[req.params.index].notes.push(noteBD);
    }


    const bookItem = myBooks[bookId];
    console.log(bookItem);
    res.render("book.ejs", {
        item: bookItem,
    });
});

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
app.post("/book/:index/delete", (req, res) => {
    console.log("book index to delete note: " + req.params.index);
    console.log("note index to remove: " + req.body.deleteItemId);
    const bookId = req.params.index;
    const noteId = req.body.deleteItemId;

    //replace with DB Query later
    myBooks[bookId].notes.splice(noteId, 1);

    const bookItem = myBooks[bookId];
    res.render("book.ejs", {
        item: bookItem,
    });


});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
