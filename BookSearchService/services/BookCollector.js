const fs = require('fs');
const axios = require('axios');

const BookCollector = () => {
    setInterval(() => {
        // console.log('Collecting Books');
        fetchBooks();
    }, 300000);

    // clearInterval(intervalID)
    // const writeToFile=fs.writeFileSync();
}

const fetchBooks = () => {
    let books, totalBooks, beg;
    console.log('Fetching Books');

    let fileUrl = __dirname + "./../data/Books.json";

    axios.get("https://openlibrary.org/search?title=green", {
        headers: {
            "User-Agent": "BookSearchService/1.0 (purusharthasinghthakur01@gmail.com)"
        }
    }).then((res) => {
        beg = res.data.start;
        totalBooks = res.data.num_found;
        books = res.data.docs;
        let booksToCreate = []
        books.map((book) => {
            booksToCreate.push({ id: book.key, count: 1, title: book.title });
        })
        let booksFileData = fs.readFileSync(fileUrl);
        booksFileData = JSON.parse(booksFileData);
        if (Object.keys(booksFileData).length === 0) {
            booksFileData.books = [];
        }
        let foundBooks = booksFileData.books;

        if (foundBooks.length === 0) {
            fs.writeFileSync(fileUrl, JSON.stringify({ books: booksToCreate }))
        } else {
            let newBooks = booksToCreate;
            booksToCreate.map((b) => {
                if (!foundBooks.includes(b)) {
                    newBooks.push(b);
                }
                fs.writeFileSync(fileUrl, JSON.stringify({ books: newBooks }))
            })
        }

        booksFileData = fs.readFileSync(fileUrl);
        console.log("Books length: ", Object.keys(JSON.parse(booksFileData)).length)
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = {
    fetchBooks, BookCollector
}