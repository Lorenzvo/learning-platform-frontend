# Learning Platform Frontend

React app (Vite + Tailwind) that consumes the backend API: browse & filter courses, view details, add to cart, checkout via Stripe.js, and see enrollments. Includes login, ratings display, and admin views (if enabled).

---

## Tech Stack

- **React 18**, **Vite**
- **Tailwind CSS**
- **@stripe/stripe-js**, **@stripe/react-stripe-js**
- **React Router**

---

## Project Structure (High Level)

```
src/
  component/
    Layout/Shell.jsx
    HomePage/HomePage.jsx
    CoursesPage/CoursesPage.jsx (+ .css)
    CourseDetail/CourseDetailPage.jsx
    LoginPage/LoginPage.jsx (+ .css)
    Cart/CartPage.jsx
    Checkout/CheckoutPage.jsx, CartCheckoutPage.jsx
    Enrollments/MyCoursesPage.jsx
    Lesson/LessonPage.jsx
    Admin/* (AdminLayout, AdminPaymentsPage, etc.)
    Button/Button.jsx (+ .css)
    TextField/TextField.jsx (+ .css)
  context/
    CartContext.jsx
  lib/
    api.ts (fetch helper)
  App.jsx
  main.jsx
index.css, App.css
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```
# Base URL for API. With Vite dev proxy, "/" is fine; otherwise use http://localhost:8080
VITE_API_BASE=/

# Stripe publishable key
VITE_STRIPE_PK=pk_test_123
```

---

## Dev Proxy (Recommended)

Create `vite.config.ts`:

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/actuator': 'http://localhost:8080'
    }
  }
})
```

---

## Install & Run

```
npm install
npm run dev   # http://localhost:5173
```

---

## Build & Preview

```
npm run build
npm run preview
```

---

## API Helper (`src/lib/api.ts`)

- Automatically prefixes `VITE_API_BASE`
- Adds `Authorization: Bearer <jwt>` if present
- Parses JSON, throws on non-2xx with `{code,message}` if available

**Example:**

```
export async function api(path: string, options: RequestInit = {}) {
  const base = import.meta.env.VITE_API_BASE || '';
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${base}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}
```

---

## Auth Flow

- **Login:** `POST /api/auth/login` → stores JWT in `localStorage`
- Header shows **Login/Logout** based on JWT presence
- Protected views (e.g., cart/checkout) redirect if no JWT

---

## Courses & Filters

- Catalogue:  
  `GET /api/courses?page=&q=&level=&minRating=&sort=`
- Thumbnail handling:
  - Supports `thumbnailUrl` or `thumbnail_url`
  - Accepts absolute or root-relative paths
  - Falls back to placeholder on error
- Details:  
  `GET /api/courses/{slug}` (includes TOC/modules/lessons)

---

## Cart & Checkout

- **Cart:**
  - `GET /api/cart`
  - `POST /api/cart/items {courseId}`
  - `DELETE /api/cart/items/{id}`

- **Checkout:**
  - Single:  
    `POST /api/checkout {courseId}` → `{ clientSecret, paymentId, piId }`
  - Cart:  
    `POST /api/checkout/cart` → `[ { clientSecret, paymentId, piId, ... }, ... ]`

- **Stripe.js:**
  - Load Stripe with `VITE_STRIPE_PK`
  - Use `CardElement` and `stripe.confirmCardPayment(clientSecret)` (no redirects in dev)
  - For cart: confirm sequentially; show per-item status; retry failures only
  - After success, poll `/api/enrollments/me` to reflect webhook completion

---

## Enrollments & Lessons

- **My Courses:** `GET /api/enrollments/me`
- **Lesson Page:**
  - Demo lessons → play immediately
  - Full lessons → request  
    `GET /api/lessons/{id}/playback-token` (short-lived) and pass token to player/signed URL

---

## Reviews

- Display average rating on course cards & detail page
- (Optional) Authenticated users can submit reviews

---

## Styling

- Tailwind utility classes + small custom CSS
- Palette: **indigo/blue, rounded cards**
- Optional: `src/styles/theme.css` with CSS variables for brand colors

---

## Testing & Tools

- Postman collection (auth, courses, cart, checkout, enrollments)
- Stripe CLI: confirm test PIs & replay webhooks
- ESLint/Prettier (optional)

---

## Scripts

```
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

---

## Deployment (Brief)

- **Static hosting:** Vercel / Netlify / S3+CloudFront
- **Environment:**
  - `VITE_API_BASE` → API origin
  - `VITE_STRIPE_PK` → production publishable key
- **CORS:** Ensure API allows frontend origin if not using a reverse proxy

---

## End-to-End Dev Checklist

1. Start MySQL (local or Docker)
2. Run API:  
   ```
   ./mvnw spring-boot:run
   ```
3. Seed dev data (Flyway `db/seed-dev` enabled in dev profile)
4. Stripe CLI:  
   ```
   stripe listen --forward-to http://localhost:8080/api/webhooks/payment
   ```
5. Start frontend:  
   ```
   npm run dev
   ```
6. Browse courses → add to cart → checkout → verify enrollment appears
7. (Optional) Admin: export payments CSV, try refund (if implemented)
Browse courses → add to cart → checkout → verify enrollment appears

(Optional) Admin: export payments CSV, try refund (if implemented)
