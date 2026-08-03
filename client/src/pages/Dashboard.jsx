import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotes, deleteNote } from '../services/notesService';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
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
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium text-sm mb-1">
            📄 All Notes
          </button>
        </nav>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {user?.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Notes</h2>
            <p className="text-sm text-gray-500">{notes.length} notes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => navigate('/notes/new')}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              + New Note
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🗒️</p>
            <p className="text-gray-500">
              {search ? 'No notes match your search' : 'No notes yet — create your first one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note, index) => {
              const color = CARD_COLORS[index % CARD_COLORS.length];
              return (
                <div
                  key={note._id}
                  onClick={() => navigate(`/notes/${note._id}`)}
                  className={`${color.bg} rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-bold text-lg ${color.text} truncate pr-2`}>
                      {note.title}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(note._id, e)}
                      className={`${color.accent} hover:text-red-600 text-sm shrink-0`}
                    >
                      ✕
                    </button>
                  </div>
                  <div
                    className={`text-sm ${color.text} opacity-70 line-clamp-4`}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;