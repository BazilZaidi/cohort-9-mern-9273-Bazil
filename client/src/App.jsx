import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;