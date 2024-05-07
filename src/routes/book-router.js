import { Router } from "express";
const router = Router();

import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} from "../controllers/book-controller.js";

router.post("/", createBook);
router.get("/:id", getBook);
router.get("/", getBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
