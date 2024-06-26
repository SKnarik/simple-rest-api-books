import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { bookValidationSchema } from "../validations/book-validation.js";

export const createBook = (req, res) => {
  try {
    const { title, author, genre, year_published, rating, summary } = req.body;
    const id = uuidv4();
    const createdAt = moment();

    const { error } = bookValidationSchema.validate(req.body);

    if (error) {
      res.status(403).send(error.message);
    }

    const newBook = {
      id,
      title,
      author,
      genre,
      year_published,
      rating,
      summary,
      createdAt,
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

    res.status(200).send({ book: newBook });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const getBooks = (req, res) => {
  try {
    const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
    res.status(200).send({ books });
  } catch (error) {
    res.status(400).send({ error: error.message });
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

    res.status(200).send({ book: thisBook });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

export const updateBook = (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      throw new Error("ID parameter is required");
    }

    const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      throw new Error("Book not found");
    }

    const updatedBooks = books.map((book, i) => {
      if (i === index) {
        return { ...book, ...payload };
      }
      return book;
    });

    fs.writeFileSync("books.json", JSON.stringify(updatedBooks, null, 2));

    res.status(200).send({
      message: `The book with id "${id}" successfully updateed`,
      book: updatedBooks[index],
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
