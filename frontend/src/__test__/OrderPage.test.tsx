import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import OrderPage from '../pages/OrderPage';
import { AuthProvider } from '../contexts/AuthContext';

const mockedAxios = vi.mocked(axios, true);

describe('OrderPage', () => {
    beforeEach(() => {
        // Giả lập API trả về một mảng rỗng để component không bị lỗi
        mockedAxios.get.mockResolvedValue({ data: [] });
    });

  it('should render the order page heading', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <OrderPage />
        </AuthProvider>
      </MemoryRouter>
    );
    // Chỉ cần kiểm tra tiêu đề Quản lý đơn hàng có hiển thị không
    expect(await screen.findByRole('heading', { name: /quản lý đơn hàng/i })).toBeInTheDocument();
  });
});