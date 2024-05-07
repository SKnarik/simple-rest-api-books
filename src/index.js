import "dotenv/config";

import express from "express";

import booksRouter from "../src/routes/book-router.js";

const app = express();
const { PORT } = process.env;

app.use(express.json());

app.use("/books", booksRouter);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
