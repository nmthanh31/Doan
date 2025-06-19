import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

// Vá lỗi môi trường JSDOM
(globalThis as any).TextEncoder = TextEncoder;

// Giả lập AXIOS một cách toàn cục
vi.mock('axios', () => ({
  default: {
    // Mặc định, mọi lời gọi GET đều trả về mảng rỗng để không làm sập component
    get: vi.fn().mockResolvedValue({ data: [] }),
    // Mặc định, mọi lời gọi POST đều trả về object rỗng
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));