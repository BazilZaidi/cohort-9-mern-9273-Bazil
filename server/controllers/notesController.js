const Note = require('../models/Note');

// @route  POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user._id,
    });

    req.log.info({ noteId: note._id, userId: req.user._id }, 'Note created');

    res.status(201).json(note);
  } catch (error) {
    req.log.error(error, 'Failed to create note');
    res.status(500).json({ message: 'Server error while creating note' });
  }
};

// @route  GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id, isDeleted: false }).sort({ createdAt: -1 });

    req.log.info({ userId: req.user._id, count: notes.length }, 'Fetched notes');

    res.status(200).json(notes);
  } catch (error) {
    req.log.error(error, 'Failed to fetch notes');
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

// @route  GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    req.log.error(error, 'Failed to fetch note');
    res.status(500).json({ message: 'Server error while fetching note' });
  }
};

// @route  PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    const updatedNote = await note.save();

    req.log.info({ noteId: updatedNote._id, userId: req.user._id }, 'Note updated');

    res.status(200).json(updatedNote);
  } catch (error) {
    req.log.error(error, 'Failed to update note');
    res.status(500).json({ message: 'Server error while updating note' });
  }
};

// @route  PATCH /api/notes/:id/pin
const togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();

    req.log.info(
      { noteId: updatedNote._id, userId: req.user._id, isPinned: updatedNote.isPinned },
      'Note pin toggled'
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    req.log.error(error, 'Failed to toggle pin');
    res.status(500).json({ message: 'Server error while toggling pin' });
  }
};

// @route  DELETE /api/notes/:id
// const deleteNote = async (req, res) => {
//   try {
//     const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDeleted: false });

//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     req.log.info({ noteId: req.params.id, userId: req.user._id }, 'Note deleted');

//     res.status(200).json({ message: 'Note deleted successfully' });
//   } catch (error) {
//     req.log.error(error, 'Failed to delete note');
//     res.status(500).json({ message: 'Server error while deleting note' });
//   }
// };
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isDeleted = true;
    note.deletedAt = new Date();
    await note.save();

    req.log.info({ noteId: req.params.id, userId: req.user._id }, 'Note moved to trash');

    res.status(200).json({ message: 'Note moved to trash' });
  } catch (error) {
    req.log.error(error, 'Failed to delete note');
    res.status(500).json({ message: 'Server error while deleting note' });
  }
};

// @route  GET /api/notes/trash
const getTrash = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    req.log.error(error, 'Failed to fetch trash');
    res.status(500).json({ message: 'Server error while fetching trash' });
  }
};

// @route  PATCH /api/notes/:id/restore
const restoreNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: true });

    if (!note) {
      return res.status(404).json({ message: 'Note not found in trash' });
    }

    note.isDeleted = false;
    note.deletedAt = null;
    const restoredNote = await note.save();

    req.log.info({ noteId: restoredNote._id, userId: req.user._id }, 'Note restored');

    res.status(200).json(restoredNote);
  } catch (error) {
    req.log.error(error, 'Failed to restore note');
    res.status(500).json({ message: 'Server error while restoring note' });
  }
};

// @route  DELETE /api/notes/:id/permanent
const permanentlyDeleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDeleted: true });

    if (!note) {
      return res.status(404).json({ message: 'Note not found in trash' });
    }

    req.log.info({ noteId: req.params.id, userId: req.user._id }, 'Note permanently deleted');

    res.status(200).json({ message: 'Note permanently deleted' });
  } catch (error) {
    req.log.error(error, 'Failed to permanently delete note');
    res.status(500).json({ message: 'Server error while permanently deleting note' });
  }
};
module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote, togglePin, getTrash, restoreNote, permanentlyDeleteNote, };