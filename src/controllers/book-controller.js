import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const createBook = (req, res) => {
    const { title, author, genre, year_published, rating, summary } = req.body;
    const id = uuidv4();
    const newBook = {
      id,
      title,
      author,
      genre,
      year_published,
      rating,
      summary,
    };

    let books = [];
    if (fs.existsSync("books.json")) {
      books = JSON.parse(fs.readFileSync("books.json", "utf8"));
    } else {
      fs.writeFileSync("books.json", "[]");
    }
  
    const isExisting = books.some((book) => book.title === title);
    if (isExisting) {
      res.status(400).send("Book already exists.");
      return;
    }
  
    books.push(newBook);
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    res.send(books);
};

export const getBooks = (req, res) => {
    try {
        const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
        res.send(books);
      } catch (error) {
        console.error("Error reading books data:", error);
        res.status(500).send("Internal Server Error");
      }  
};

export const getBook = (req, res) => {
    try {
        const { id } = req.params;
        const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
        const thisBook = books.find((book) => book.id === id);
    
        if (!thisBook) {
          throw new Error("Book not found");
        }
    
        res.send(thisBook);
      } catch (error) {
        res.status(404).send({ error: error.message });
      }
};

export const updateBook = (req, res) => {
    try {
        const { id } = req.query;
    
        if (!id) {
          throw new Error("ID parameter is required");
        }
    
        const payload = req.body;
        const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
        const index = books.findIndex((book) => book.id === id);
    
        if (index === -1) {
          throw new Error("Book not found");
        }
    
        const thisBook = books[index];
    
        Object.assign(thisBook, payload);
    
        const updatedBook = books[index];
    
        fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    
        res.status(200).send({
          message: `The book with id "${id}" successfully updateed`,
          book: updatedBook,
        });
      } catch (error) {
        res.status(404).send({ error: error.message });
      }
};

export const deleteBook = (req, res) => {
    try {
        const { id } = req.params;
    
        const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
    
        const index = books.findIndex((book) => book.id === id);
    
        if (index === -1) {
          throw new Error("Book not found");
        }
    
        const [deletedBook] = books.splice(index, 1);
        console.log(deletedBook);
    
        fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
    
        res.status(200).send({
          message: `The book with id "${id}" successfully deleted`,
          book: deletedBook,
        });
      } catch (error) {
        res.status(404).send({ error: error.message });
      }
};
