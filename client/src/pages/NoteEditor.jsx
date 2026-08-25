import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X, Save, Loader2 } from 'lucide-react';
import { getNoteById, createNote, updateNote } from '../services/notesService';

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewNote = id === 'new';

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
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 note-editor-card">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNewNote ? 'Create Note' : 'Edit Note'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label="Close and return to dashboard"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />

        <label id="note-content-label" className="block text-sm font-semibold text-gray-700 mb-2">
         Content
        </label>
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8"
          aria-labelledby="note-content-label">
          <ReactQuill
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
            className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
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