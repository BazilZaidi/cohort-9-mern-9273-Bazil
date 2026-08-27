import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X, Save, Loader2 } from 'lucide-react';
import { getNoteById, createNote, updateNote } from '../services/notesService';

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewNote = id === 'new';

  const quillRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle('');
    setContent('');
    setError('');
    if (isNewNote) {
      setLoading(false);
    } else {
      setLoading(true);
      fetchNote();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && quillRef.current) {
      const editorRoot = quillRef.current.getEditor?.()?.root;
      if (editorRoot) {
        editorRoot.setAttribute('aria-labelledby', 'note-content-label');
      }
    }
  }, [loading]);

  const fetchNote = async () => {
    try {
      const note = await getNoteById(id);
      setTitle(note.title);
      setContent(note.content);
    } catch (err) {
      console.error(err);
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (isNewNote) {
        await createNote(title, content);
      } else {
        await updateNote(id, title, content);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading note"
        className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950"
      >
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 note-editor-card">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNewNote ? 'Create Note' : 'Edit Note'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label="Close and return to dashboard"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <label htmlFor="note-title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-transparent"
        />

        <label id="note-content-label" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-8">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your note..."
            className="min-h-[22rem]"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : isNewNote ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;