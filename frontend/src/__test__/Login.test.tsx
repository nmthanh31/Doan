// src/__test__/Login.test.tsx

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginPage from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>();
  return { ...original, useNavigate: () => mockedNavigate };
});

describe('LoginPage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    // Giả lập API kiểm tra user khi khởi tạo -> luôn thất bại cho trang Login
    mockedAxios.get.mockRejectedValue(new Error('No user'));
  });

  it('should render login form correctly', () => {
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /Đăng nhập/i })).toBeInTheDocument();
  });

  it('should navigate to /products on successful login', async () => {
    mockedAxios.post.mockResolvedValue({ data: { token: 'fake-token', user: { id: '1', role: 'user' } } });
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
        // SỬA LỖI: Mong đợi chuyển hướng đến "/products"
        expect(mockedNavigate).toHaveBeenCalledWith('/products');
    });
  });
  
  it('should display an error message on failed login', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Email hoặc mật khẩu không đúng' } } });
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    
    expect(await screen.findByText(/Email hoặc mật khẩu không đúng/i)).toBeInTheDocument();
  });
});