import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../pages/ProductList';
import { AuthProvider } from '../contexts/AuthContext';

const mockedAxios = vi.mocked(axios, true);

describe('ProductList Page', () => {
    beforeEach(() => {
        // Giả lập API trả về một mảng rỗng để component không bị lỗi
        mockedAxios.get.mockResolvedValue({ data: { products: [] } });
    });

  it('should render the product list heading', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProductList />
        </AuthProvider>
      </BrowserRouter>
    );
    // Chỉ cần kiểm tra tiêu đề Danh sách sản phẩm có hiển thị không
    expect(await screen.findByRole('heading', { name: /danh sách sản phẩm/i })).toBeInTheDocument();
  });
});