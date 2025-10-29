# Quick Start Guide

## Cách nhanh nhất để chạy ứng dụng

### Chuẩn bị
Đảm bảo bạn đã cài đặt:
- Node.js 18+
- Docker Desktop (đang chạy)

### Chạy ứng dụng (3 bước)

#### 1. Khởi động PostgreSQL
```bash
cd content-idea-manager
docker compose up -d
```

Đợi 10 giây để PostgreSQL khởi động.

#### 2. Setup và chạy Backend
Mở terminal mới:
```bash
cd content-idea-manager/backend
npm install
npm run init-db
npm run dev
```

Backend sẽ chạy tại http://localhost:4000

#### 3. Setup và chạy Frontend
Mở terminal thứ 3:
```bash
cd content-idea-manager/frontend
npm install
npm run dev
```

Frontend sẽ chạy tại http://localhost:3000

### Mở ứng dụng
Truy cập: **http://localhost:3000**

### Test API trực tiếp
```bash
# Health check
curl http://localhost:4000/health

# Lấy danh sách ideas
curl http://localhost:4000/ideas

# Tạo idea mới
curl -X POST http://localhost:4000/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Idea",
    "description": "This is a test idea",
    "persona": "Developer",
    "industry": "Technology",
    "status": "draft"
  }'
```

## Sử dụng script tự động (Tùy chọn)

Chạy script setup tự động:
```bash
cd content-idea-manager
./start.sh
```

Script sẽ:
- Khởi động PostgreSQL
- Cài đặt dependencies cho backend và frontend
- Khởi tạo database

Sau đó chạy backend và frontend theo hướng dẫn từ script.

## Dừng ứng dụng

1. Nhấn `Ctrl+C` trong terminal backend
2. Nhấn `Ctrl+C` trong terminal frontend
3. Dừng PostgreSQL:
```bash
docker compose down
```

## Có vấn đề?

Xem chi tiết trong [README.md](./README.md) phần Troubleshooting.
