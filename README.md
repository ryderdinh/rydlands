# rydlands.com — Landing page

Next.js 14 (App Router) + TypeScript. Không dùng Tailwind, style thuần CSS trong
`app/globals.css` để giữ project nhẹ, dễ chỉnh.

## Hiệu ứng đặc biệt

- **Three.js** (`components/ShaderBackground.tsx`): shader nền cho hero, viết
  bằng GLSL thuần (vertex + fragment shader riêng), mô phỏng các dải sóng chất
  lỏng chồng lớp — cùng tinh thần với shader chai nước bạn đang làm trên Unity.
- **GSAP**:
  - `components/HeroIntro.tsx` — hiệu ứng chữ hero xuất hiện tuần tự khi tải trang.
  - `components/BottleRack.tsx` — dãy chai nước "rót" lên bằng `scaleY` +
    `elastic.out`, mô phỏng cảm giác chất lỏng ổn định lại.
  - `components/ScrollReveal.tsx` — dùng `ScrollTrigger` để reveal các section
    (skills, projects, about, contact) khi cuộn tới.
- Tất cả animation đều tôn trọng `prefers-reduced-motion` (xem `lib/motion.ts`).

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Build production

```bash
npm run build
npm run start
```

## Việc cần chỉnh trước khi deploy lên rydlands.com

1. `app/layout.tsx` — cập nhật `metadataBase`/OG nếu cần.
2. `app/page.tsx` — phần `contact-links`: thay link GitHub/LinkedIn (`href="#"`)
   và email `hello@rydlands.com` bằng thông tin thật.
3. Thêm `favicon.ico` / OG image vào `public/` nếu muốn.
4. Deploy: Vercel là nhanh nhất (connect repo → domain `rydlands.com` vào Vercel
   → trỏ DNS theo hướng dẫn của Vercel).
