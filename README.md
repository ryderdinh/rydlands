# rydlands.com — Landing page

Next.js (App Router) + TypeScript. Không dùng Tailwind, style thuần CSS trong
`app/globals.css` để giữ project nhẹ, dễ chỉnh.

## Hiệu ứng đặc biệt

- **Hero** (`components/HeroPinned.tsx`): pinned full-viewport "agent reveal"
  card — chân dung minh họa (`public/ryder-portrait.png`/`.webp`), khung góc
  vàng, chữ "RYDER" lặp mờ chạy dọc 2 mép + phủ nền, dải sáng chéo teal/gold.
  Không còn dùng Three.js/WebGL — toàn bộ là CSS + `<img>`.
- **GSAP** (`ScrollTrigger` + `Lenis`):
  - `components/HeroIntro.tsx` — hiệu ứng chữ hero xuất hiện tuần tự khi tải trang.
  - `components/PinnedScene.tsx` — pin + camera-flight transform (rotateX/translateZ)
    cho từng section khi cuộn tới.
  - `components/ScrollReveal.tsx` — fallback reveal cho mobile/reduced-motion.
- Tất cả animation đều tôn trọng `prefers-reduced-motion` (xem `lib/motion.ts`).

## Cài đặt & chạy

```bash
pnpm install
pnpm dev
```

Mở http://localhost:3000

## Build production

```bash
pnpm build
pnpm start
```

## Việc cần chỉnh trước khi deploy lên rydlands.com

1. `app/layout.tsx` — cập nhật `metadataBase`/OG nếu cần.
2. `app/page.tsx` — phần `contact-links`: thay link GitHub/LinkedIn (`href="#"`)
   và email `hello@rydlands.com` bằng thông tin thật.
3. Thêm `favicon.ico` / OG image vào `public/` nếu muốn.
4. Deploy: Vercel là nhanh nhất (connect repo → domain `rydlands.com` vào Vercel
   → trỏ DNS theo hướng dẫn của Vercel).
