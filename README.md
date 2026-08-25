# GreenX7 — Frontend

Giao diện web GreenX7 cho **2 role: ADMIN và CUSTOMER**, phân quyền ở cả tầng route lẫn tầng UI.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Axios · TanStack Query · Zustand · react-hook-form + Zod

---

## 1. Chạy trong 3 lệnh

> Cần chạy **GreenX7-BE** trước (xem README của backend).

```bash
cp .env.example .env.local
npm install
npm run dev
```

Mở http://localhost:3000

**Tài khoản dùng thử** (đã hiển thị sẵn ngay dưới form đăng nhập)

| Role | Email | Mật khẩu | Vào thẳng |
|---|---|---|---|
| ADMIN | admin@greenx7.com | Admin@123 | `/admin` |
| CUSTOMER | customer@greenx7.com | Customer@123 | `/products` |

> ⚠️ **`JWT_ACCESS_SECRET` trong `.env.local` phải TRÙNG với `JWT_ACCESS_SECRET` của backend.**
> Middleware verify chữ ký access token bằng chính secret này. Sai secret ⇒ mọi người bị coi như chưa đăng nhập.

---

## 2. Kiến trúc bảo mật — điểm quan trọng nhất của base này

```
Trình duyệt                Next.js (BFF)                    NestJS
    |                           |                              |
    |-- POST /api/auth/login -->|                              |
    |                           |-- POST /auth/login --------->|
    |                           |<-- { user, tokens } ---------|
    |<-- { user } + Set-Cookie--|  (token KHÔNG lọt về browser)|
    |    httpOnly gx7_at/gx7_rt |                              |
    |                           |                              |
    |-- axios GET /api/bff/products ->|                        |
    |                           | đọc cookie -> gắn Bearer --->|
    |<--------------------------|<-----------------------------|
```

**Ba điều rút ra:**

1. **JavaScript phía client không bao giờ chạm vào token.** Token nằm trong httpOnly cookie ⇒ một lỗ hổng XSS cũng không lấy được phiên đăng nhập. Đây là lý do phải có lớp BFF thay vì gọi thẳng NestJS.
2. **Trình duyệt không gọi thẳng backend.** `axios.baseURL = '/api/bff'` ⇒ cùng origin ⇒ không CORS, không preflight, và URL thật của backend không lộ ra ngoài.
3. **Phân quyền có 3 lớp**, mỗi lớp giải một bài toán khác nhau:

| Lớp | Ở đâu | Chống được gì | Không chống được gì |
|---|---|---|---|
| `middleware.ts` | Edge, trước khi render | Vào nhầm khu vực, lộ nội dung trang | Token vừa bị hạ quyền nhưng chưa hết hạn |
| `(admin)/layout.tsx` | Server component | Trạng thái quyền THẬT tại thời điểm request | Gọi API trực tiếp |
| Guard của NestJS | Backend | **Tất cả** — đây mới là bảo mật thật | — |

> `<Can>` và menu lọc theo permission chỉ là **UX**, không phải bảo mật. Ẩn nút không ngăn được ai gọi API bằng curl.

---

## 3. Cấu trúc thư mục

```
src/
├── middleware.ts              # verify JWT ở edge + tự refresh + chặn route theo role
├── app/
│   ├── layout.tsx             # lấy user ở SERVER -> truyền xuống AuthProvider
│   ├── (auth)/                # login, register — layout riêng, đã đăng nhập sẽ bị đẩy đi
│   ├── (admin)/               # /admin/* — sidebar, kiểm tra role lần 2
│   ├── (shop)/                # /, /products, /profile — header + footer khách hàng
│   └── api/
│       ├── auth/*             # BFF: login/register/refresh/logout/me (nơi DUY NHẤT set cookie)
│       └── bff/[...path]      # proxy mọi request còn lại, tự gắn Bearer từ cookie
├── components/
│   ├── ui/                    # primitive: button, input, table, dialog, select... (kiểu shadcn)
│   ├── layout/                # sidebar, header, user-nav
│   ├── shared/                # PageHeader, EmptyState, Pagination, SearchInput, Can, ConfirmDialog
│   └── providers/             # QueryProvider, AppProviders
├── features/                  # tổ chức theo TÍNH NĂNG, không theo loại file
│   ├── auth/                  # schemas + api + provider + form
│   ├── products/              # schemas + api + hooks + components
│   ├── categories/
│   ├── users/
│   └── dashboard/
├── lib/
│   ├── axios.ts               # instance + interceptor refresh CÓ HÀNG ĐỢI
│   ├── backend.ts             # gọi NestJS từ server (route handler)
│   ├── server-api.ts          # gọi NestJS từ server component
│   ├── api-error.ts           # chuẩn hoá lỗi + map lỗi field vào form
│   ├── cookies.ts             # tên cookie + option httpOnly/secure/sameSite
│   ├── jwt.ts                 # verify token bằng jose (chạy được ở Edge)
│   └── query-client.ts        # cấu hình TanStack Query + queryKeys tập trung
├── config/
│   ├── permissions.ts         # bản sao permission map của BE (dùng cho UI)
│   ├── routes.ts              # hằng số route + luật bảo vệ theo role
│   └── navigation.ts          # menu admin/customer, lọc theo permission
├── stores/ui.store.ts         # UI state (zustand) — KHÔNG chứa dữ liệu server
└── types/                     # ApiResponse, AuthUser, entity — khớp DTO của BE
```

**Nguyên tắc chia state**

| Loại dữ liệu | Dùng gì | Ví dụ |
|---|---|---|
| Từ server | TanStack Query | danh sách sản phẩm, thống kê |
| UI thuần | Zustand | sidebar thu gọn hay chưa |
| Danh tính người dùng | AuthProvider (server đưa xuống) | user, role, permissions |
| Bộ lọc bảng | `useState` trong component | trang hiện tại, từ khoá |

Đừng nhét dữ liệu server vào Zustand — sẽ có hai nguồn sự thật và bug đồng bộ.

---

## 4. Vài chi tiết đáng chú ý trong code

**Refresh token có hàng đợi** (`src/lib/axios.ts`)
Một màn hình bắn 5 request song song, cả 5 cùng nhận 401. Nếu mỗi request tự gọi refresh, lần thứ 2 sẽ dùng refresh token đã bị revoke — BE coi là token bị đánh cắp và **huỷ toàn bộ phiên**. Vì vậy chỉ request đầu tiên gọi refresh, số còn lại xếp hàng chờ rồi retry.

**Refresh trong middleware** (`src/middleware.ts`)
Server component không set được cookie. Nếu không gia hạn ở middleware, cứ 15 phút người dùng sẽ bị đá ra giữa lúc đang duyệt trang.

**Lỗi từ BE map thẳng vào form** (`applyFieldErrors`)
BE trả `errors: { email: ["Email đã tồn tại"] }` ⇒ hiển thị đúng ngay dưới ô email, không phải toast chung chung.

**Chống open redirect** (`login/page.tsx`)
`?next=` chỉ được chấp nhận nếu bắt đầu bằng `/` và không phải `//` — nếu không, `?next=https://evil.com` sẽ biến trang đăng nhập thành bàn đạp lừa đảo.

**Design token tập trung** (`src/app/globals.css`)
Toàn bộ màu là CSS variable dạng HSL. Lấy token từ Figma → sửa `globals.css` → cả admin lẫn customer đổi theo. Không component nào hardcode màu.

---

## 5. Nối UI với Figma

1. Mở Figma **GreenX7 - Stage 2** → Dev Mode.
2. Copy color token → convert sang HSL → dán vào `:root` trong `src/app/globals.css` (định dạng `152 62% 30%`, không có `hsl()`).
3. Font: đổi `Be_Vietnam_Pro` trong `src/app/layout.tsx` sang font của design (nhớ để `subsets: ['latin','vietnamese']`).
4. Bo góc/khoảng cách: chỉnh `--radius` và `theme.extend` trong `tailwind.config.ts`.
5. Component mới: đặt vào `src/components/ui/` nếu dùng lại được, `src/features/<tính-năng>/components/` nếu chỉ phục vụ một màn hình.

---

## 6. Lệnh thường dùng

```bash
npm run dev          # dev server, hot reload
npm run build        # build production
npm run start        # chạy bản đã build
npm run lint         # eslint --fix
npm run typecheck    # tsc --noEmit
npm run test         # vitest
```

---

## 7. Thêm một màn hình quản trị mới — 5 bước

1. `src/types/entities.ts` — khai báo entity khớp DTO của BE.
2. `src/features/<tên>/schemas.ts` — schema Zod cho form + kiểu tham số danh sách.
3. `src/features/<tên>/api/<tên>.api.ts` — gọi API qua `get/post/patch/del` của `lib/axios`.
4. `src/features/<tên>/hooks/use-<tên>.ts` — `useQuery` / `useMutation` + invalidate.
5. `src/app/(admin)/admin/<tên>/page.tsx` + thêm một mục vào `src/config/navigation.ts`.

Copy nguyên `features/products/` làm khuôn — nó có đủ list, filter, phân trang, dialog form và xoá có xác nhận.

---

## 8. Trước khi lên production

- [ ] `COOKIE_SECURE=true` (bắt buộc khi chạy https)
- [ ] `JWT_ACCESS_SECRET` là secret thật và trùng với BE
- [ ] `API_URL` trỏ tới backend nội bộ (không public ra ngoài)
- [ ] Thêm Content-Security-Policy vào `next.config.mjs` sau khi chốt danh sách domain asset
- [ ] Khai báo domain ảnh trong `images.remotePatterns`
- [ ] Gắn Sentry vào `src/app/error.tsx`
