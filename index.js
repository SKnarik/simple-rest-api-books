import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/books", (req, res) => {
  try {
    const books = JSON.parse(fs.readFileSync("books.json", "utf8"));
    res.send(books);
  } catch (error) {
    console.error("Error reading books data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/books", (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
