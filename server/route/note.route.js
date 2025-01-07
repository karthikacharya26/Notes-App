const express = require("express");
const NoteModel = require("../model/note.model");

const noteRouter = express.Router();

noteRouter.get("/", async (req, res) => {
  const userId = req.user._id;
  try {
    const notes = await NoteModel.find({ userId });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ msg: "error while fetching note" });
  }
});

noteRouter.post("/create", async (req, res) => {
  const { title, content, status } = req.body;
  const userId = req.user._id;
  try {
    const note = new NoteModel({
      title,
      content,
      status,
      userId,
    });
    await note.save();
    res.status(200).json({ msg: "note created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "error while creating note" });
  }
});

noteRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const noteId = req.params.id;
  const userId = req.user._id;
  try {
    const note = await NoteModel.findOne({ _id: noteId });
    if (note.userId.toString() === userId.toString()) {
      await NoteModel.findByIdAndUpdate({ _id: noteId }, payload);
      return res.status(200).json({ msg: "note updated successfully" });
    } else {
      return res.status(401).json({ msg: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ msg: "error while updating note" });
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user._id;
  try {
    const note = await NoteModel.findById({ _id: noteId });
    if (note.userId.toString() === userId.toString()) {
      await NoteModel.findByIdAndDelete(noteId);
      return res.status(200).json({ msg: "note deleted successfully" });
    } else {
      return res.status(401).json({ msg: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ msg: "error while deleting note" });
  }
});

module.exports = noteRouter;