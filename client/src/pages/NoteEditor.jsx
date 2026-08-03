import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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
    if (!isNewNote) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const note = await getNoteById(id);
      setTitle(note.title);
      setContent(note.content);
    } catch (err) {
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
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">
          {isNewNote ? 'New Note' : 'Edit Note'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-semibold text-gray-900 mb-4 px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-lg bg-transparent"
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Start writing..."
            className="h-96"
          />
        </div>
      </main>
    </div>
  );
}

export default NoteEditor;