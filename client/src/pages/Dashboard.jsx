import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  FileText,
  Pin,
  PinOff,
  Settings,
  Search,
  Plus,
  LogOut,
  StickyNote,
  Trash2,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getNotes,
  deleteNote,
  togglePin,
  getTrash,
  restoreNote,
  permanentlyDeleteNote,
} from '../services/notesService';

const CARD_COLORS = [
  { bg: 'bg-rose-100', text: 'text-rose-900', accent: 'text-rose-500' },
  { bg: 'bg-sky-100', text: 'text-sky-900', accent: 'text-sky-500' },
  { bg: 'bg-emerald-100', text: 'text-emerald-900', accent: 'text-emerald-500' },
  { bg: 'bg-amber-100', text: 'text-amber-900', accent: 'text-amber-500' },
  { bg: 'bg-violet-100', text: 'text-violet-900', accent: 'text-violet-500' },
  { bg: 'bg-orange-100', text: 'text-orange-900', accent: 'text-orange-500' },
];

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [trashNotes, setTrashNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // 'all' | 'pinned' | 'trash'

  useEffect(() => {
    if (view === 'trash') {
      fetchTrash();
    } else {
      fetchNotes();
    }
  }, [view]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const data = await getTrash();
      setTrashNotes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Move this note to trash?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete note');
    }
  };

  const handleTogglePin = async (id, e) => {
    e.stopPropagation();
    try {
      const updated = await togglePin(id);
      setNotes(notes.map((note) => (note._id === id ? updated : note)));
    } catch (err) {
      console.error(err);
      setError('Failed to update pin');
    }
  };

  const handleRestore = async (id, e) => {
    e.stopPropagation();
    try {
      await restoreNote(id);
      setTrashNotes(trashNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to restore note');
    }
  };

  const handlePermanentDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Permanently delete this note? This cannot be undone.')) return;
    try {
      await permanentlyDeleteNote(id);
      setTrashNotes(trashNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to permanently delete note');
    }
  };

  const activeNotes = view === 'trash' ? trashNotes : notes;

  const filteredNotes = activeNotes
    .filter((note) => note.title.toLowerCase().includes(search.toLowerCase()))
    .filter((note) => (view === 'pinned' ? note.isPinned : true));

  const goToNote = (id) => navigate(`/notes/${id}`);

  const viewTitles = {
    all: 'All Notes',
    pinned: 'Pinned Notes',
    trash: 'Trash',
  };

  const emptyMessages = {
    all: 'No notes yet — create your first one!',
    pinned: 'No pinned notes yet',
    trash: 'Trash is empty',
  };

  let content;
  if (loading) {
    content = <p className="text-gray-500 text-sm">Loading...</p>;
  } else if (filteredNotes.length === 0) {
    content = (
      <div className="text-center py-20">
        <StickyNote className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">
          {search ? 'No notes match your search' : emptyMessages[view]}
        </p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredNotes.map((note, index) => {
          const color = CARD_COLORS[index % CARD_COLORS.length];
          return (
            <div
              key={note._id}
              role="button"
              tabIndex={0}
              onClick={() => view !== 'trash' && goToNote(note._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target === e.currentTarget && view !== 'trash') {
                  goToNote(note._id);
                }
              }}
              className={`${color.bg} rounded-2xl p-5 ${
                view !== 'trash' ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''
              } transition-all duration-200`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-bold text-lg ${color.text} truncate pr-2`}>
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  {view === 'trash' ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleRestore(note._id, e)}
                        title="Restore"
                        className={`${color.accent} hover:opacity-70`}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handlePermanentDelete(note._id, e)}
                        title="Delete permanently"
                        className={`${color.accent} hover:text-red-600`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(note._id, e)}
                        className={`${color.accent} hover:opacity-70`}
                      >
                        {note.isPinned ? (
                          <Pin className="w-4 h-4 fill-current" />
                        ) : (
                          <PinOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(note._id, e)}
                        className={`${color.accent} hover:text-red-600 text-sm`}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div
                className={`text-sm ${color.text} opacity-70 line-clamp-4`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-5 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-lg font-bold text-gray-900">Notes</span>
        </div>

        <nav className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Main
          </p>
          <button
            type="button"
            onClick={() => setView('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm mb-1 transition-colors ${
              view === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            All Notes
          </button>
          <button
            type="button"
            onClick={() => setView('pinned')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm mb-1 transition-colors ${
              view === 'pinned' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Pin className="w-4 h-4" />
            Pinned Notes
          </button>
          <button
            type="button"
            onClick={() => setView('trash')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm mb-1 transition-colors ${
              view === 'trash' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Trash
          </button>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm mb-1 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">{user?.name}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{viewTitles[view]}</h2>
            <p className="text-sm text-gray-500">{filteredNotes.length} notes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            {view !== 'trash' && (
              <button
                type="button"
                onClick={() => navigate('/notes/new')}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Note
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>
        )}

        {content}
      </main>
    </div>
  );
}

export default Dashboard;