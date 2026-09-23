# rydlands.com — Landing page

Next.js (App Router) + TypeScript. Không dùng Tailwind, style thuần CSS trong
`app/globals.css` để giữ project nhẹ, dễ chỉnh.

## Cấu trúc hiện tại

Trang là **một màn hình full-screen gồm nhiều cảnh**, không cuộn như tài liệu.
`app/page.tsx` hiện chỉ render hero; các mục Projects/Skills/About/Contact, nav và
footer đã được gỡ khỏi trang (file component vẫn còn, chưa dùng).

- **Chuyển cảnh** (`components/HeroPinned.tsx`): khoá `html` không cho cuộn, nghe
  wheel / vuốt / phím bằng GSAP `Observer`; mỗi lần cuộn chạy một bước của timeline
  (cuộn ngược thì chạy ngược).
- **Cảnh 1**: poster "agent reveal" — chân dung minh hoạ, khung vàng, chữ RYDER hai mép,
  vòng kỹ năng 3D (`components/SkillsRing.tsx`, three.js CSS3D).
- **Cảnh 2**: nội dung hero mờ đi, frame thu về nửa trái, thẻ kim loại 3D
  (`components/CardScene.tsx`, three.js WebGL, có ánh sáng thật) dựng đứng, trồi lên từ dưới vào trong frame (nửa trái); nửa phải để trống.
- **Preloader** (`components/Preloader.tsx`) và trang luôn mở ở vị trí đầu.
- Máy cảm ứng / `prefers-reduced-motion`: chỉ hiện poster tĩnh, không khoá cuộn
  (xem `lib/motion.ts`).
- Khói Pixi.js (`components/HeroSmoke.tsx`) đang tắt (`SHOW_SMOKE = false`).

## Công cụ chỉnh (chỉ chế độ dev)

Ring tuner (cảnh 1) và card tuner (cảnh 2) là các thanh trượt để tìm giá trị bằng mắt;
xong thì chép số vào hằng trong `SkillsRing.tsx` / `CardScene.tsx`.

## Ảnh thẻ kim loại

`public/card/` — sửa tay `card-color.png`, rồi tạo lại các ảnh còn lại:

```bash
python3 scripts/gen-card-maps.py
```

Chi tiết trong [docs/card-assets.md](docs/card-assets.md). Hướng dẫn cho agent: [CLAUDE.md](CLAUDE.md).

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
2. Thêm `favicon.ico` / OG image vào `public/` nếu muốn.
3. Khi thêm lại phần liên hệ: thay link GitHub/LinkedIn và email placeholder bằng thông tin thật.
4. Deploy: trang là static export (`out/`), lên Vercel hoặc Cloudflare Pages đều được.
