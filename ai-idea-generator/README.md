# AI Idea Generator 🤖

Một ứng dụng web full-stack cho phép tạo ý tưởng nội dung tự động bằng AI. Hỗ trợ nhiều nhà cung cấp AI như OpenAI, Anthropic (Claude), Google (Gemini), và Deepseek.

## Tính năng chính

- ✨ **Tạo ý tưởng tự động**: Sinh 10 ý tưởng nội dung dựa trên persona và ngành công nghiệp
- 🔄 **Hỗ trợ đa AI provider**: OpenAI, Anthropic, Google Gemini, Deepseek
- ✅ **Validation tự động**: Sử dụng AJV để kiểm tra JSON response từ AI
- 🔁 **Retry logic**: Tự động retry với exponential backoff nếu validation thất bại
- 💾 **Lưu trữ database**: Lưu tất cả ý tưởng vào PostgreSQL
- 🎨 **UI đẹp mắt**: Frontend responsive với Tailwind CSS

## Tech Stack

### Backend
- **Fastify**: Web framework nhanh và hiệu quả
- **TypeScript**: Type safety và developer experience tốt
- **PostgreSQL**: Database quan hệ để lưu trữ ideas
- **OpenAI SDK**: Tích hợp GPT-4
- **Anthropic SDK**: Tích hợp Claude
- **Google Generative AI**: Tích hợp Gemini
- **AJV**: JSON schema validation

### Frontend
- **Next.js 14**: React framework với App Router
- **TypeScript**: Type-safe frontend code
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management

## Cấu trúc thư mục

```
ai-idea-generator/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Database config và migrations
│   │   │   ├── database.ts
│   │   │   └── migrate.ts
│   │   ├── routes/            # API routes
│   │   │   └── ideas.ts
│   │   ├── services/          # Business logic
│   │   │   ├── llm-client.ts       # LLM client cho tất cả providers
│   │   │   ├── validator.ts        # AJV validation
│   │   │   └── idea-generator.ts   # Service chính
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/                   # Frontend Next.js
    ├── app/                   # Next.js App Router
    │   ├── page.tsx          # Trang chính
    │   ├── layout.tsx        # Root layout
    │   └── globals.css       # Global styles
    ├── components/           # React components
    │   ├── IdeaGeneratorForm.tsx
    │   └── IdeasDisplay.tsx
    ├── lib/                  # Utilities
    │   └── api.ts           # API client
    ├── types/               # TypeScript types
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── next.config.js
```

## Hướng dẫn cài đặt

### Yêu cầu

- Node.js 18+
- PostgreSQL 13+
- Ít nhất 1 API key từ: OpenAI, Anthropic, Google, hoặc Deepseek

### Bước 1: Setup Database

```bash
# Cài đặt PostgreSQL (nếu chưa có)
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Tạo database
createdb ai_ideas

# Hoặc dùng psql
psql -U postgres
CREATE DATABASE ai_ideas;
\q
```

### Bước 2: Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Copy và cấu hình .env
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
nano .env
```

Cấu hình `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/ai_ideas

# Thêm ít nhất 1 API key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
DEEPSEEK_API_KEY=...

DEFAULT_MODEL=openai
DEFAULT_TEMPERATURE=0.7
MAX_RETRIES=3
```

```bash
# Chạy migrations để tạo bảng
npm run migrate

# Khởi động backend server
npm run dev
```

Backend sẽ chạy tại `http://localhost:3001`

### Bước 3: Setup Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Copy và cấu hình .env.local
cp .env.local.example .env.local

# Chỉnh sửa .env.local
nano .env.local
```

Cấu hình `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
# Khởi động frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

## Cách sử dụng

1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Điền thông tin:
   - **Target Persona**: Ví dụ: "Tech Entrepreneur", "Marketing Manager"
   - **Industry**: Ví dụ: "SaaS", "E-commerce"
   - **AI Provider**: Chọn OpenAI, Anthropic, Gemini, hoặc Deepseek
3. Click **"Generate Ideas"**
4. Đợi AI tạo 10 ý tưởng (khoảng 10-30 giây)
5. Xem kết quả với title, description, và rationale cho mỗi ý tưởng

## API Documentation

### POST /api/ideas/generate

Tạo ý tưởng mới bằng AI.

**Request Body:**
```json
{
  "persona": "Tech Entrepreneur",
  "industry": "SaaS",
  "provider": "openai",
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "ideas": [
    {
      "title": "How to Scale Your SaaS in 2024",
      "description": "A comprehensive guide covering...",
      "rationale": "Entrepreneurs need actionable advice..."
    }
  ]
}
```

### GET /api/ideas

Lấy danh sách ý tưởng đã lưu.

**Query Parameters:**
- `persona` (optional): Filter by persona
- `industry` (optional): Filter by industry

**Response:**
```json
{
  "success": true,
  "ideas": [...],
  "count": 10
}
```

### GET /api/health

Health check endpoint.

## Giải thích code cho người mới học

### Backend Architecture

#### 1. LLMClient (`src/services/llm-client.ts`)

Class này quản lý kết nối với 4 AI providers khác nhau:

```typescript
class LLMClient {
  // Khởi tạo clients dựa trên API keys có sẵn
  constructor() { ... }

  // Method chính: gọi AI provider bạn chọn
  async generateCompletion(prompt, provider, temperature) {
    // Switch case để chọn provider
    switch (provider) {
      case 'openai': return this.generateWithOpenAI(...)
      case 'anthropic': return this.generateWithAnthropic(...)
      // ...
    }
  }
}
```

**Tại sao cần class này?**
- Tránh duplicate code khi gọi nhiều AI providers
- Dễ thêm provider mới
- Centralized error handling

#### 2. IdeaValidator (`src/services/validator.ts`)

Sử dụng AJV để validate JSON response từ AI:

```typescript
const ideaSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    rationale: { type: 'string', minLength: 1 }
  },
  required: ['title', 'description', 'rationale']
}
```

**Tại sao cần validation?**
- AI đôi khi trả về JSON sai format
- Đảm bảo data nhất quán trước khi lưu vào DB
- Tự động retry nếu validation fail

#### 3. IdeaGeneratorService (`src/services/idea-generator.ts`)

Service chính kết hợp LLMClient và Validator:

```typescript
async generateIdeas(persona, industry, provider) {
  // Retry loop với exponential backoff
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // 1. Gọi AI
    const response = await llmClient.generateCompletion(...)

    // 2. Validate response
    const ideas = validator.parseAndValidateJSON(response)

    // 3. Nếu hợp lệ → return
    if (ideas) return ideas

    // 4. Nếu không → đợi và retry
    await sleep(Math.pow(2, attempt) * 1000)
  }
}
```

**Exponential backoff là gì?**
- Lần 1 fail → đợi 2 giây
- Lần 2 fail → đợi 4 giây
- Lần 3 fail → đợi 8 giây
- Tránh spam API quá nhanh

#### 4. API Routes (`src/routes/ideas.ts`)

Định nghĩa các endpoint:

```typescript
fastify.post('/api/ideas/generate', async (request, reply) => {
  const { persona, industry, provider } = request.body

  // Generate ideas
  const ideas = await ideaService.generateIdeas(...)

  // Save to database
  await ideaService.saveIdeas(...)

  return reply.send({ success: true, ideas })
})
```

### Frontend Architecture

#### 1. API Client (`lib/api.ts`)

Wrapper cho fetch API:

```typescript
class ApiClient {
  static async generateIdeas(request) {
    const response = await fetch('/api/ideas/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    })
    return response.json()
  }
}
```

#### 2. Components

**IdeaGeneratorForm**: Form nhập liệu
- State management với `useState`
- Form validation
- Disable inputs khi loading

**IdeasDisplay**: Hiển thị kết quả
- 4 trạng thái: empty, loading, error, success
- Responsive design với Tailwind CSS

**Page**: Component chính
- Kết nối Form và Display
- Quản lý state toàn cục
- Handle API calls

## Troubleshooting

### Lỗi kết nối database

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Giải pháp:**
- Kiểm tra PostgreSQL đang chạy: `sudo service postgresql status`
- Kiểm tra DATABASE_URL trong .env
- Chạy migrations: `npm run migrate`

### Lỗi API key

```
Error: Provider openai is not configured
```

**Giải pháp:**
- Kiểm tra API key trong `.env`
- Đảm bảo key hợp lệ
- Restart backend server sau khi thay đổi .env

### Frontend không gọi được backend

```
Error: fetch failed
```

**Giải pháp:**
- Kiểm tra backend đang chạy: `curl http://localhost:3001/api/health`
- Kiểm tra CORS settings
- Kiểm tra NEXT_PUBLIC_API_URL trong `.env.local`

## License

MIT

## Tác giả

Built with ❤️ for learning purposes
