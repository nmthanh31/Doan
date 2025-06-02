# # Bước 1: Chọn Node.js làm môi trường build
# FROM node:18-alpine AS build

# # Bước 2: Đặt thư mục làm việc trong container
# WORKDIR /app

# # Bước 3: Sao chép package.json và package-lock.json (hoặc yarn.lock)
# COPY package.json package-lock.json* ./

# # Bước 4: Cài đặt dependencies
# RUN npm install

# # Bước 5: Sao chép toàn bộ mã nguồn vào container
# COPY . .

# # Bước 6: Build ứng dụng React (Vite)
# RUN npm run build

# # Bước 7: Dùng image nginx để chạy ứng dụng
# FROM nginx:alpine

# # Xóa thư mục default html của nginx để tránh conflict (tuỳ chọn)
# RUN rm -rf /usr/share/nginx/html/*

# # Bước 8: Copy thư mục dist (build output của vite) vào thư mục static của nginx
# COPY --from=build /app/dist /usr/share/nginx/html

# # Bước 9: Mở cổng 80
# EXPOSE 80

# # Bước 10: Chạy nginx
# CMD ["nginx", "-g", "daemon off;"]
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
