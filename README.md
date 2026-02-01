# Production Tracking System
http://localhost:3000/live-v2
Sistem live tracking produksi data api backend.

## 🎯 Features

- ✅ **Progress Tracking** - Monitoring progress per tahapan produksi
- ✅ **Authentication** - Login system dengan role-based access
- ✅ **Dark Mode** - Toggle tema terang/gelap
- ✅ **Grouped Projects** - Card otomatis grup per judul project
- ✅ **Live Dashboard** - Monitoring real-time status produksi

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **HTTP Client**: Axios


## 📋 Prerequisites

- Node.js >= 18.x
- Bun / npm / yarn / pnpm
- Backend API running (port 5000)

## 🛠 Installation

### 1. Clone dan Install Dependencies

```bash
# Install dependencies
bun install
# or
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` dari template:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` sesuai konfigurasi backend API Anda:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
bun dev
# or
npm run dev
```

Server akan berjalan di [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── page.tsx                 # Dashboard kanban (localStorage)
├── login/                   # Login page
├── unauthorized/            # Unauthorized access page
├── live-v2/                 # Live tracking dengan API real-time
│   ├── page.tsx
│   └── _components/         # Components spesifik live-v2
├── live-coba-coba/          # Experimental page (sample data)
├── layout.tsx               # Root layout
├── providers.tsx            # App providers (Auth, Theme, Toast)
└── globals.css              # Global styles

components/
├── ui/                      # shadcn/ui base components
├── grouped-project-card.tsx # Kanban project card dengan grouping
├── grouped-project-card-live.tsx # Live version card
├── animated-column.tsx      # Animated kanban column
├── protected-route.tsx      # HOC untuk protected pages
├── add-project-dialog.tsx   # Dialog tambah project
└── edit-project-dialog.tsx  # Dialog edit project

lib/
├── api/
│   ├── auth.ts              # Auth API endpoints
│   ├── client.ts            # Axios instance with interceptors
│   ├── projects.ts          # Projects API endpoints
│   └── transformers.ts      # Data transformation logic
├── contexts/
│   └── auth-context.tsx     # Global auth state
├── use-projects.ts          # Hook untuk localStorage projects
├── use-api-projects.ts      # Hook untuk API projects (auto-refresh)
├── use-milestones.ts        # Hook untuk fetch milestones
├── types.ts                 # Type definitions & configs
├── utils.ts                 # Utility functions
└── data.ts                  # Sample data

types/
└── project.ts               # API response types


```

## 🌐 Pages & Routes

| Route             | Deskripsi                    | Data Source               | Auth |
| ----------------- | ---------------------------- | ------------------------- | ---- |
| `/`               | Dashboard kanban dengan CRUD | localStorage              | ❌   |
| `/live-v2`        | Live tracking real-time      | **API** (auto-refresh 5s) | ✅   |
| `/live-coba-coba` | Experimental live page       | localStorage sample       | ✅   |
| `/login`          | Login page                   | API                       | ❌   |
| `/unauthorized`   | Access denied page           | -                         | ❌   |

> **💡 Untuk data fetch asli dari API**, gunakan halaman **`/live-v2`**

## 🔄 Data Flow (Live-v2)

```
Backend API → Axios Client → Transformers → TVProject[] → UI
─────────────────────────────────────────────────────────────
/api/projects      fetchProjectsWithEpisodes()
/api/episodes      ↓
/api/milestones    transformApiDataToTVProjects()
                   ↓
                   useApiProjects() (auto-refresh 5s)
                   ↓
                   Kanban Board UI Components
```

## 🔐 Authentication

System menggunakan JWT-based authentication via API backend.

### Login

1. Akses `/login`
2. Masukkan credentials
3. Token disimpan di localStorage
4. Auto redirect berdasarkan role

## 📊 Status Mapping (API → UI)

| API Episode Status          | Kanban Column |
| --------------------------- | ------------- |
| Scripting, Pre-Production   | pre-produksi  |
| Filming, Shooting           | shooting      |
| Editing, Post-Production    | editing       |
| Preview Ready, Completed    | selesai       |
| Master Ready, Payment, Paid | payment       |

## 🔧 Development

### Build untuk Production

```bash
bun run build
# or
npm run build
```

### Lint Code

```bash
bun run lint
# or
npm run lint
```

### Start Production Server

```bash
bun start
# or
npm start
```

## 🌟 Key Dependencies

- `next` - React framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `@radix-ui/*` - Headless UI components
- `axios` - HTTP client
- `gsap` - Animations
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `next-themes` - Dark mode

## 📝 Environment Variables

| Variable              | Deskripsi            | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## 🤝 Contributing

Untuk kontribusi development:

1. Clone repository
2. Install dependencies
3. Buat branch fitur baru
4. Commit changes
5. Push dan buat Pull Request

## 📄 License

Private project - All rights reserved.
