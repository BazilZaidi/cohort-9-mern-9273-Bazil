import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NoteEditor from './NoteEditor';
import { AuthProvider } from '../context/AuthContext';
import * as notesService from '../services/notesService';

jest.mock('../services/notesService');
jest.mock('react-quill-new', () => {
  return function MockQuill({ value, onChange }) {
    return (
      <textarea
        data-testid="quill-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

const renderEditor = (id) => {
  render(
    <MemoryRouter initialEntries={[`/notes/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/notes/:id" element={<NoteEditor />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('NoteEditor page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders an empty form for a new note', () => {
    renderEditor('new');
    expect(screen.getByPlaceholderText(/note title/i)).toHaveValue('');
    expect(screen.getByText(/create note/i)).toBeInTheDocument();
  });

  it('loads an existing note into the form', async () => {
    notesService.getNoteById.mockResolvedValue({
      _id: '1',
      title: 'Existing Note',
      content: 'Some content',
    });

    renderEditor('1');

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/note title/i)).toHaveValue('Existing Note');
    });
  });

  it('shows an error when saving without a title', async () => {
    renderEditor('new');
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('creates a new note on save', async () => {
    notesService.createNote.mockResolvedValue({ _id: '1', title: 'New Note' });

    renderEditor('new');
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/note title/i), 'New Note');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(notesService.createNote).toHaveBeenCalledWith('New Note', '');
    });
  });
});