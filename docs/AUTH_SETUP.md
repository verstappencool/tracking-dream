# Authentication System - Setup Guide

## ✅ Yang Sudah Dibuat

### 1. **API Client Layer**

- `lib/api/client.ts` - Axios instance dengan auto token injection
- `lib/api/auth.ts` - Auth API endpoints (login, logout, me, register)

### 2. **Auth Context & Provider**

- `lib/contexts/auth-context.tsx` - Global auth state management
- `app/providers.tsx` - App-level providers wrapper

### 3. **Login Page**

- `app/login/page.tsx` - Beautiful login UI dengan form validation
- Auto redirect berdasarkan role

### 4. **Protected Routes**

- `components/protected-route.tsx` - Wrapper untuk halaman yang perlu auth

### 5. **Pages**

- `app/unauthorized/page.tsx` - Error page untuk unauthorized access

### 6. **Environment**

- `.env.local` - API base URL configuration

---

## 🚀 Cara Menggunakan

### 1. **Setup Environment**

Edit `.env.local` jika API backend beda port:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. **Protect Halaman yang Sudah Ada**

Update `app/page.tsx` (admin dashboard):

```tsx
"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function Home() {
  return (
    <ProtectedRoute allowedRoles={["admin", "producer"]}>
      {/* Your existing component code */}
    </ProtectedRoute>
  );
}
```

Update `app/live/page.tsx`:

```tsx
"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function LiveTrackingPage() {
  return (
    <ProtectedRoute>
      {/* No role restriction, all authenticated users can access */}
      {/* Your existing component code */}
    </ProtectedRoute>
  );
}
```

### 3. **Gunakan Auth Hook di Component**

```tsx
import { useAuth } from "@/lib/contexts/auth-context";

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 4. **Add Logout Button ke Header**

Di `app/page.tsx`, tambahkan logout button:

```tsx
import { useAuth } from "@/lib/contexts/auth-context";
import { LogOut } from "lucide-react";

// Di dalam component
const { user, logout } = useAuth();

// Di header/navbar
<Button variant="ghost" size="sm" onClick={logout} className="gap-2">
  <LogOut className="w-4 h-4" />
  Logout
</Button>;
```

---

## 🔐 Login Credentials (Demo)

Sesuai dokumentasi backend:

```
Email: admin@dreamlight.com
Password: admin123
```

---

## 📋 Role-Based Routing

Auth context automatically redirects users after login:

- **Admin/Producer** → `/` (dashboard utama)
- **Crew** → `/crew` (crew dashboard - belum ada, buat nanti)
- **Broadcaster** → `/broadcaster` (belum ada)
- **Investor** → `/investor` (belum ada)

---

## 🎨 Features

### ✅ Auto Token Management

- Token disimpan di localStorage
- Auto inject ke semua API requests
- Auto redirect ke login jika token expired

### ✅ Protected Routes

- Redirect unauthorized users ke `/login`
- Role-based access control
- Loading state saat check auth

### ✅ Beautiful UI

- Gradient background
- Smooth animations
- Show/hide password toggle
- Loading states
- Toast notifications

### ✅ Error Handling

- API error messages
- Form validation
- Network error handling

---

## 🛠 Next Steps

### 1. **Protect Existing Pages**

- [ ] Update `app/page.tsx` with ProtectedRoute
- [ ] Update `app/live/page.tsx` with ProtectedRoute
- [ ] Update `app/tracking/[id]/page.tsx` with ProtectedRoute

### 2. **Add Logout UI**

- [ ] Add logout button to main dashboard header
- [ ] Add user info display (avatar, name, role)

### 3. **Create Role-Specific Pages**

- [ ] `/crew` page for crew dashboard
- [ ] `/broadcaster` page
- [ ] `/investor` page

### 4. **Connect to Real API**

- [ ] Make sure backend API is running on port 5000
- [ ] Test login with real credentials
- [ ] Test token expiry handling

---

## 🐛 Troubleshooting

### CORS Error

Pastikan backend sudah set CORS:

```js
// Backend
CORS_ORIGIN=http://localhost:3000
```

### Token Not Persisting

Clear localStorage dan login ulang:

```js
localStorage.clear();
```

### Redirect Loop

Periksa role redirect di `auth-context.tsx`

---

## 📁 File Structure

```
app/
├── login/
│   └── page.tsx                    # Login page
├── unauthorized/
│   └── page.tsx                    # Unauthorized access page
├── providers.tsx                   # App providers
└── layout.tsx                      # Updated with Providers

lib/
├── api/
│   ├── client.ts                   # Axios instance
│   └── auth.ts                     # Auth API functions
└── contexts/
    └── auth-context.tsx            # Auth state management

components/
└── protected-route.tsx             # Protected route wrapper

.env.local                          # Environment variables
```

---

## ✨ Testing Checklist

- [ ] Can access login page at `/login`
- [ ] Can login with valid credentials
- [ ] Redirected to correct page based on role
- [ ] Token saved in localStorage
- [ ] Protected pages redirect to login when not authenticated
- [ ] Logout clears token and redirects to login
- [ ] Token auto-refreshes on page reload
- [ ] 401 errors auto redirect to login
- [ ] Unauthorized page shows for wrong roles

---

Sudah siap digunakan! 🎉
