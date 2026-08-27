const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
  getTrash,
  restoreNote,
  permanentlyDeleteNote,
} = require('../controllers/notesController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/trash', getTrash);
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/restore', restoreNote);
router.delete('/:id/permanent', permanentlyDeleteNote);

module.exports = router;