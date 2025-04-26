# Bước 1: Chọn image Node.js làm môi trường build
FROM node:18-alpine AS build

# Bước 2: Đặt thư mục làm việc
WORKDIR /app

# Bước 3: Sao chép package.json và package-lock.json
COPY package.json  ./
COPY package-lock.json ./

# Bước 4: Cài đặt các dependencies
RUN npm install

# Bước 5: Sao chép mã nguồn vào container
COPY . .

# Bước 6: Build ứng dụng React
RUN npm run build

# Bước 7: Chạy ứng dụng trên Nginx
FROM nginx:alpine

# Sao chép ứng dụng đã build vào thư mục static của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
