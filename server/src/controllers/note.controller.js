import Note from "../models/note.model.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ADD NEW NOTE */
export const addNote = asyncHandler(async (req, res) => {
  const { title, content, customerId } = req.body;

  if (!title || !content || !customerId) {
    res.status(400);
    throw new Error("Title, content, and customerId are required");
  }

  const note = await Note.create({ title, content, customerId });
  res.status(201).json(note);
});

/* GET NOTES BY CUSTOMER */
export const getNotesByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const notes = await Note.find({ customerId }).sort({ createdAt: -1 });
  res.json(notes);
});

/* UPDATE NOTE (PUT) */
export const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { new: true, runValidators: true } 
  );

  if (!updatedNote) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.json(updatedNote);
});

/* DELETE NOTE (Optional but recommended) */
export const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  await Note.findByIdAndDelete(noteId);
  res.json({ message: "Note deleted successfully" });
});