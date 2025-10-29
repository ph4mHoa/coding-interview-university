# Content Idea Manager

Ứng dụng quản lý ý tưởng nội dung đơn giản với Backend (Fastify + TypeScript + PostgreSQL) và Frontend (Next.js + TypeScript).

## Tính năng

- Thêm ý tưởng nội dung mới với các thông tin: tiêu đề, mô tả, persona, ngành, trạng thái
- Hiển thị danh sách tất cả ý tưởng
- API CRUD đầy đủ cho quản lý ý tưởng
- Database PostgreSQL chạy trên Docker

## Công nghệ sử dụng

### Backend
- Fastify (Web framework)
- TypeScript
- PostgreSQL (Database)
- Docker (Container)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- React

## Cấu trúc dự án

```
content-idea-manager/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── index.ts        # Main server file
│   │   ├── db.ts           # Database connection
│   │   ├── init-db.ts      # Database initialization script
│   │   ├── types.ts        # TypeScript types
│   │   └── routes/
│   │       └── ideas.ts    # CRUD API routes
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/               # Frontend Next.js
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── IdeaForm.tsx
│   │   └── IdeaList.tsx
│   ├── types/
│   │   └── index.ts
│   ├── package.json
│   └── .env.local
└── docker-compose.yml      # Docker configuration
```

## Hướng dẫn cài đặt và chạy

### Yêu cầu
- Node.js 18+
- Docker và Docker Compose
- npm hoặc yarn

### Bước 1: Clone và di chuyển vào thư mục dự án

```bash
cd content-idea-manager
```

### Bước 2: Khởi động PostgreSQL bằng Docker

```bash
docker-compose up -d
```

Đợi khoảng 10 giây để PostgreSQL khởi động hoàn toàn.

### Bước 3: Cài đặt và khởi động Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Khởi tạo database (tạo bảng)
npm run init-db

# Chạy backend server
npm run dev
```

Backend sẽ chạy tại: **http://localhost:4000**

### Bước 4: Cài đặt và khởi động Frontend (Terminal mới)

Mở terminal mới:

```bash
cd content-idea-manager/frontend

# Cài đặt dependencies
npm install

# Chạy frontend
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

### Bước 5: Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:3000**

## API Endpoints

Backend cung cấp các API endpoints sau:

- `GET /ideas` - Lấy danh sách tất cả ý tưởng
- `GET /ideas/:id` - Lấy chi tiết một ý tưởng
- `POST /ideas` - Tạo ý tưởng mới
- `PUT /ideas/:id` - Cập nhật ý tưởng
- `DELETE /ideas/:id` - Xóa ý tưởng
- `GET /health` - Health check

## Schema Database

Bảng `ideas`:

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| title | VARCHAR(255) | Tiêu đề ý tưởng |
| description | TEXT | Mô tả chi tiết |
| persona | VARCHAR(100) | Đối tượng mục tiêu |
| industry | VARCHAR(100) | Ngành công nghiệp |
| status | VARCHAR(50) | Trạng thái (draft, in-progress, published, archived) |
| created_at | TIMESTAMP | Thời gian tạo |

## Ví dụ sử dụng API

### Tạo ý tưởng mới

```bash
curl -X POST http://localhost:4000/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10 Tips for Better SEO",
    "description": "Bài viết hướng dẫn SEO cho người mới bắt đầu",
    "persona": "Marketer",
    "industry": "Digital Marketing",
    "status": "draft"
  }'
```

### Lấy danh sách ý tưởng

```bash
curl http://localhost:4000/ideas
```

## Troubleshooting

### Lỗi kết nối PostgreSQL

Nếu backend không kết nối được với PostgreSQL:

1. Kiểm tra Docker container đang chạy:
```bash
docker ps
```

2. Kiểm tra logs của PostgreSQL:
```bash
docker-compose logs postgres
```

3. Đảm bảo port 5432 không bị chiếm bởi service khác

### Lỗi CORS

Nếu gặp lỗi CORS khi frontend gọi API:

- Kiểm tra file `backend/src/index.ts` đã cấu hình CORS cho `http://localhost:3000`
- Đảm bảo backend đang chạy trước khi start frontend

### Port đã được sử dụng

Nếu port 3000 hoặc 4000 đã được sử dụng:

- Backend: Thay đổi `PORT` trong `backend/.env`
- Frontend: Chạy với port khác: `npm run dev -- -p 3001`

## Dừng ứng dụng

### Dừng backend và frontend
Nhấn `Ctrl + C` trong terminal đang chạy

### Dừng PostgreSQL
```bash
docker-compose down
```

### Dừng và xóa data
```bash
docker-compose down -v
```

## Scripts hữu ích

### Backend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run init-db` - Khởi tạo database

### Frontend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server

## License

MIT
