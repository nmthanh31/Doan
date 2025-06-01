# Base image
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài dependencies trước
COPY package*.json ./

# Cài đặt các package (dependencies)
RUN npm install

# Copy toàn bộ mã nguồn (trừ những file nằm trong .dockerignore)
COPY . .

# Nếu bạn có thư mục data hoặc file CSV cần thiết, hãy copy nó nếu chưa có trong mã nguồn
# COPY ./data ./data

# Mở port mà service sẽ lắng nghe (ví dụ 3001)
EXPOSE 3001

# Lệnh để khởi động service Node.js (file chính của bạn là index.js)
CMD ["node", "index.js"]
