// // src/__test__/SignUp.test.tsx

// import '@testing-library/jest-dom';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import { BrowserRouter } from 'react-router-dom';
// import SignUpPage from '../pages/SignUp';

// // Không cần mock axios vì component dùng fetch
// // vi.mock('axios');

// const mockedNavigate = vi.fn();
// vi.mock('react-router-dom', async (importOriginal) => {
//   const original = await importOriginal<typeof import('react-router-dom')>();
//   return { ...original, useNavigate: () => mockedNavigate };
// });

// describe('SignUpPage', () => {

//   // Chạy trước mỗi bài test
//   beforeEach(() => {
//     // Giả lập window.fetch và window.alert
//     vi.spyOn(window, 'fetch');
//     vi.spyOn(window, 'alert').mockImplementation(() => {}); // Giả lập alert để không gây lỗi
//   });

//   // Chạy sau mỗi bài test để dọn dẹp
//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   // Test này đã pass, giữ nguyên!
//   it('should render signup form correctly', () => {
//     render(<BrowserRouter><SignUpPage /></BrowserRouter>);
//     expect(screen.getByRole('heading', { name: /đăng ký tài khoản/i })).toBeInTheDocument();
//     expect(screen.getByLabelText(/họ và tên/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Địa chỉ$/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/^Mật khẩu$/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Nhập lại mật khẩu/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
//   });

//   // Sửa lại bài test này
//   it('should call register API on form submit and navigate', async () => {
//     // Thiết lập cho fetch giả lập một response thành công
//     (window.fetch as any).mockResolvedValue({
//       ok: true,
//       json: () => Promise.resolve({ message: 'Đăng ký thành công' }),
//     });
    
//     render(<BrowserRouter><SignUpPage /></BrowserRouter>);

//     // Điền thông tin vào form
//     fireEvent.change(screen.getByLabelText(/họ và tên/i), { target: { value: 'Test User' } });
//     fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'test@example.com' } });
//     fireEvent.change(screen.getByLabelText(/^Mật khẩu$/i), { target: { value: 'password123' } });
//     fireEvent.change(screen.getByLabelText(/nhập lại mật khẩu/i), { target: { value: 'password123' } });
//     fireEvent.change(screen.getByLabelText(/số điện thoại/i), { target: { value: '0123456789' } });
//     fireEvent.change(screen.getByLabelText(/^Địa chỉ$/i), { target: { value: '123 Test St' } });

//     // Nhấn nút submit
//     fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
//     // Đợi và kiểm tra xem fetch và navigate có được gọi không
//     await waitFor(() => {
//       // Kiểm tra fetch có được gọi với đúng endpoint không
//       expect(window.fetch).toHaveBeenCalledWith(
//         expect.stringContaining('/api/users/register'),
//         expect.any(Object)
//       );
//     });

//     await waitFor(() => {
//       // Kiểm tra có chuyển hướng đến trang login không
//       expect(mockedNavigate).toHaveBeenCalledWith('/login');
//     });
//   });
// });
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '../pages/SignUp';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>();
  return { ...original, useNavigate: () => mockedNavigate };
});

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Đăng ký thành công' })
    } as Response);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render signup form correctly', () => {
    render(<BrowserRouter><SignUpPage /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /đăng ký tài khoản/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/họ và tên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Địa chỉ$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mật khẩu$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nhập lại mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should call register API on form submit and navigate', async () => {
    render(<BrowserRouter><SignUpPage /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/họ và tên/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Mật khẩu$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/nhập lại mật khẩu/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/số điện thoại/i), { target: { value: '0123456789' } });
    fireEvent.change(screen.getByLabelText(/^Địa chỉ$/i), { target: { value: '123 Test St' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/register'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
