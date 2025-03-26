const express = require('express');
const { serverPortno } = require('./config/config');
const { BookCollector } = require('./services/BookCollector');
const fs = require('fs');
const { json } = require('stream/consumers');

const app = express();

app.use((req, res, next) => {
    console.log(`Endpoint: ${req.url} || method: ${req.method}`);
    next();
})
app.use(express.json());

app.get('/books', async (req, res, next) => {
    try {
        let fileUrl = __dirname + "/data/Books.json";
        let currentBooks = fs.readFileSync(fileUrl);
        currentBooks = JSON.parse(currentBooks);
        console.log(currentBooks, " are present");

        res.status(200).json({ currentBooks });
    } catch (err) {
        console.log(err);
        next(err);
    }
})


app.post('/books/rent', async (req, res, next) => {
    try {
        if (Object.keys(req.body).length < 2) {
            res.status(401);
            throw new Error("User id or book id not found");
        }
        const { userId, bookId } = req.body;
        let fileUrl = __dirname + "/data/Books.json";
        let currentBooks = fs.readFileSync(fileUrl);
        currentBooks = JSON.parse(currentBooks);
        currentBooks = currentBooks.books;
        updatedBooks = currentBooks;

        let bookPresent;
        const isBookPresent = currentBooks.filter((book) => {
            if (book.id === bookId) {
                bookPresent = book;
            } else {
                return book;
            }
        })


        // let bookIndex = -1;
        if (bookPresent) {
            if (bookPresent.count < 1) {
                res.status(404).json({ error: "Book is already rented!" });
            } else {
                bookPresent.count=0;
                isBookPresent.push(bookPresent)
                // console.log("index: ", isBookPresent);
                fs.writeFileSync(fileUrl, JSON.stringify({ books: isBookPresent }));
                res.status(200).json({ message: "book rented", rentedBook: bookPresent })
            }
        } else {
            res.status(404);
            throw new Error("book not found");
        }

    } catch (err) {
        console.log(err);
        next(err);
    }
})


app.post('/books/return', async (req, res, next) => {
    try {
        if (Object.keys(req.body).length < 2) {
            res.status(401);
            throw new Error("User id or book id not found");
        }
        const { userId, bookId } = req.body;

        let fileUrl = __dirname + "/data/Books.json";
        let currentBooks = fs.readFileSync(fileUrl);
        currentBooks = JSON.parse(currentBooks);
        currentBooks = currentBooks.books;
        updatedBooks = currentBooks;
        let bookPresent;
        const isBookPresent = currentBooks.filter((book) => {
            if (book.id === bookId) {
                bookPresent = book;
            } else {
                return book;
            }
        })

        if (bookPresent) {
            if (bookPresent.count <1) {
                bookPresent.count=1;
                isBookPresent.push(bookPresent)
                fs.writeFileSync(fileUrl, JSON.stringify({ books: isBookPresent }));
                res.status(200).json({ message: "book returned", rentedBook: bookPresent })
            } else {
                res.status(200).json({ error: "Book is already present!" });
            }
        } else {
            res.status(404);
            throw new Error("book not found");
        }

    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.json({ error: err.message })
    next();
})


app.listen(serverPortno, () => {
    BookCollector();
    console.log(`Server running at port ${serverPortno}`);
})