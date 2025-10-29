# Quick Start Guide 🚀

Hướng dẫn nhanh để chạy ứng dụng trong 5 phút!

## Prerequisites

- Node.js 18+ đã cài đặt
- PostgreSQL đã cài đặt và đang chạy
- 1 API key từ OpenAI, Anthropic, Google hoặc Deepseek

## Bước 1: Clone và Setup Database (2 phút)

```bash
# Tạo database
createdb ai_ideas

# Nếu không dùng được createdb, dùng psql:
psql -U postgres -c "CREATE DATABASE ai_ideas;"
```

## Bước 2: Setup Backend (2 phút)

```bash
cd ai-idea-generator/backend

# Install dependencies
npm install

# Copy và edit .env
cp .env.example .env

# Sửa .env với text editor yêu thích của bạn
# VÍ DỤ với OpenAI:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_ideas
# OPENAI_API_KEY=sk-proj-your-key-here
# (các key khác để trống nếu không dùng)
```

```bash
# Chạy migration
npm run migrate

# Start backend
npm run dev
```

✅ Backend sẽ chạy tại http://localhost:3001

## Bước 3: Setup Frontend (1 phút)

Mở terminal mới:

```bash
cd ai-idea-generator/frontend

# Install dependencies
npm install

# Copy .env.local
cp .env.local.example .env.local

# Start frontend
npm run dev
```

✅ Frontend sẽ chạy tại http://localhost:3000

## Bước 4: Thử nghiệm

1. Mở http://localhost:3000
2. Điền form:
   - Persona: **Marketing Manager**
   - Industry: **SaaS**
   - Provider: **OpenAI**
3. Click "Generate Ideas"
4. Đợi 10-30 giây
5. Xem 10 ý tưởng được tạo ra!

## Lỗi phổ biến

### "Database connection failed"
```bash
# Kiểm tra PostgreSQL đang chạy
sudo service postgresql status  # Linux
brew services list              # macOS

# Start nếu chưa chạy
sudo service postgresql start   # Linux
brew services start postgresql  # macOS
```

### "Provider openai is not configured"
- Kiểm tra OPENAI_API_KEY trong `.env`
- Đảm bảo không có khoảng trắng thừa
- Restart backend sau khi sửa .env

### "Port 3000 already in use"
```bash
# Kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9

# Hoặc đổi port
PORT=3002 npm run dev
```

## API Keys miễn phí

### OpenAI
1. Đăng ký tại https://platform.openai.com/
2. Add credit card (cần $5 tối thiểu)
3. Tạo API key tại https://platform.openai.com/api-keys

### Google Gemini
1. Đăng ký tại https://makersuite.google.com/
2. **MIỄN PHÍ** với rate limit cao
3. Tạo API key trong dashboard

### Anthropic Claude
1. Đăng ký tại https://console.anthropic.com/
2. Nhận $5 credit miễn phí
3. Tạo API key

### Deepseek
1. Đăng ký tại https://platform.deepseek.com/
2. Rẻ nhất trong tất cả providers
3. Tạo API key

## Tips

- **Dùng Gemini** nếu muốn miễn phí và nhanh
- **Dùng Claude** nếu muốn chất lượng cao nhất
- **Dùng OpenAI** nếu muốn stable và phổ biến
- **Dùng Deepseek** nếu muốn rẻ

## Next Steps

Đọc [README.md](./README.md) để hiểu chi tiết về:
- Architecture
- Code structure
- API documentation
- Troubleshooting nâng cao
