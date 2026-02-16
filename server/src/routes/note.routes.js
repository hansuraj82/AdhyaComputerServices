import express from "express";
const router = express.Router();
import { addNote, deleteNote, getNotesByCustomer, updateNote } from "../controllers/note.controller.js";
import protect from "../middleware/auth.middleware.js";

// Routes
router.post("/add", protect, addNote);
router.get("/customer/:customerId", protect, getNotesByCustomer);
router.put("/edit/:noteId", protect, updateNote);
router.delete("/:noteId", protect, deleteNote);

export default router;