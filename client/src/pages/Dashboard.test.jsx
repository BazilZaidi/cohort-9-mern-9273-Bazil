import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../context/AuthContext';
import * as notesService from '../services/notesService';

jest.mock('../services/notesService');

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    notesService.getNotes.mockReturnValue(new Promise(() => {}));
    renderDashboard();
    expect(screen.getByText(/loading notes/i)).toBeInTheDocument();
  });

  it('shows empty state when there are no notes', async () => {
    notesService.getNotes.mockResolvedValue([]);
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    });
  });

  it('renders a list of notes', async () => {
    notesService.getNotes.mockResolvedValue([
      { _id: '1', title: 'First Note', content: 'Hello world' },
      { _id: '2', title: 'Second Note', content: 'Another note' },
    ]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('First Note')).toBeInTheDocument();
      expect(screen.getByText('Second Note')).toBeInTheDocument();
    });
  });

  it('deletes a note when delete is confirmed', async () => {
    notesService.getNotes.mockResolvedValue([
      { _id: '1', title: 'Note to delete', content: 'Bye' },
    ]);
    notesService.deleteNote.mockResolvedValue({ message: 'deleted' });
    window.confirm = jest.fn(() => true);

    renderDashboard();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Note to delete')).toBeInTheDocument();
    });

    await user.click(screen.getByText('✕'));

    await waitFor(() => {
      expect(notesService.deleteNote).toHaveBeenCalledWith('1');
    });
  });
});