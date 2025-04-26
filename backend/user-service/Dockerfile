# Base image
FROM node:18-alpine

# Set thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ project vào container (trừ những file .dockerignore nếu có)
COPY . .

# COPY ./data ./data

# COPY ./data/users.csv ./data/users.csv

# Mở port (port app bạn đang listen, mình thấy là 3001)
EXPOSE 3001

# Lệnh khởi chạy app
CMD ["node", "index.js"]
