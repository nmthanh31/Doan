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

EXPOSE 3004


CMD ["node", "index.js"]
