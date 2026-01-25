# Live-V2 API Integration

Halaman `/live-v2` menggunakan **data real-time dari API** (bukan localStorage).

## 🎯 Features

✅ Auto-refresh setiap 5 detik  
✅ Data transformation dari API → TVProject format  
✅ Support Series (per episode) dan Movie/TVC  
✅ Progress calculation dari milestones  
✅ Loading & error states

## 📁 File Structure

```
lib/
├── api/
│   ├── projects.ts         # API service functions
│   ├── transformers.ts     # Data transformation logic
│   └── client.ts           # Axios instance
├── use-api-projects.ts     # Custom hook with auto-refresh
└── types.ts                # TVProject types (existing)

types/
└── project.ts              # API response types

app/
└── live-v2/
    └── page.tsx            # Live page using API data
```

## 🚀 Setup

1. Copy environment file:

```bash
cp .env.local.example .env.local
```

2. Update API URL di `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run dev server:

```bash
npm run dev
```

4. Visit: `http://localhost:3000/live-v2`

## 🔄 Data Flow

```
API Endpoint → Fetch → Transform → TVProject[] → UI Components
─────────────────────────────────────────────────────────────
/projects     fetchProjectsWithEpisodes()
/episodes     ↓
/milestones   transformApiDataToTVProjects()
              ↓
              useApiProjects() hook (auto-refresh 5s)
              ↓
              Kanban Board UI (existing components)
```

## 📊 Data Transformation

### Status Mapping

| API Episode Status | Kanban Column |
| ------------------ | ------------- |
| "Scripting"        | pre-produksi  |
| "Filming"          | shooting      |
| "Editing"          | editing       |
| "Completed"        | selesai       |
| "Payment"          | payment       |

### Progress Calculation

```typescript
Progress % = (Done Milestones / Total Milestones) × 100
```

### Series vs Movie/TVC

- **Series**: Each episode → separate card in kanban
- **Movie/TVC**: Project → single card based on global_status

## 🎨 UI Components

Menggunakan **existing components** dari `/app/live/_components`:

- ✅ ProjectCard
- ✅ GroupedProjectCardLive
- ✅ AnimatedColumn
- ✅ All badge components

**No component duplication needed** - hanya data source yang berubah!

## 🐛 Debugging

Check browser console untuk:

- API call logs
- Transformation errors
- Loading states

## 🔐 Authentication

API client sudah include JWT token dari `localStorage.getItem("auth_token")`
