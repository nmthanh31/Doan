export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    created_at: string;
  };
}
