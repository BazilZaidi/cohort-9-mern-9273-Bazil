import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';
import { AuthProvider } from '../context/AuthContext';
import * as authService from '../services/authService';

jest.mock('../services/authService');

const renderSignup = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Signup />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Signup page', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders name, email, and password fields', () => {
    renderSignup();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows an error message when signup fails', async () => {
    authService.signup.mockRejectedValue({
      response: { data: { message: 'User already exists' } },
    });

    renderSignup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  it('calls the signup service with correct data on submit', async () => {
    authService.signup.mockResolvedValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'fake-jwt-token',
    });

    renderSignup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'password123'
      );
    });
  });
});