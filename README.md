# GoEase landing page

Website giới thiệu GoEase bằng HTML/CSS/JavaScript thuần. Giữ logo, slogan “Just go. We’ll plan.”, màu kem/xanh ngọc/cam và nội dung đã duyệt. Chỉ có light theme, không có Dark Mode.

## Xem thử cục bộ

Chạy trong C:\Wed-GoEase\goease-site bằng PowerShell:

```powershell
$env:GOEASE_PORT = '4174'
npm start
```

Mở http://127.0.0.1:4174. Không đặt GOEASE_PORT thì server dùng 4173. Không cần cài dependency để chạy website.

```powershell
npm run check
npm run build
npm test
```

Build kiểm tra JS và tài nguyên của artifact tĩnh dist, không bundling hoặc publish. Test kiểm tra chính sách autoplay, điều hướng và ảnh lỗi.

## Cấu trúc

- dist/index.html: nội dung, mockup, FAQ, Facebook và native dialog.
- dist/styles.css, theme.css, travel.css: lớp giao diện đã duyệt, giữ nguyên.
- dist/premium.css: lớp tinh chỉnh giao diện, responsive và chuyển động.
- dist/app.js: bản dịch Việt/Anh và downloadLinks, chỉ lưu ngôn ngữ trong localStorage.
- dist/interactions.js: menu, reveal, preview, dialog, pause và Facebook.
- dist/slideshow.js, motion-state.js: slideshow hai lớp ảnh, autoplay khoảng 5 giây, điều khiển/preload/xử lý lỗi.

Desktop giữ ba điện thoại xòe; mobile/tablet dùng mockup 260px có vuốt, nút trước/sau và phím mũi tên. Giữ Noto Sans hỗ trợ tiếng Việt, display=swap và font hệ thống dự phòng. Chuyển động tôn trọng giảm chuyển động, trạng thái tab và nút pause.

Hai nút tải vẫn mở thông báo sắp ra mắt. Khi có URL chính thức và được duyệt, cập nhật downloadLinks trong dist/app.js; không gắn URL Expo Go thay GoEase.

Facebook dùng một Page Plugin chính thức của https://www.facebook.com/profile.php?id=61594839483458. Có loading, timeout/fallback, tải lại thủ công và liên kết trực tiếp. Meta cung cấp public timeline khi tải khung; thời điểm bài mới xuất hiện phụ thuộc cache/quyền truy cập. Không feed giả, scraping hoặc token frontend.

## Tài liệu và assets

- [Audit trước sửa](docs/PREMIUM_AUDIT.md)
- [Báo cáo hoàn thành và kiểm thử](docs/PREMIUM_REPORT.md)
- [Nguồn ảnh và giấy phép](dist/image-credits.html)
- [Nguồn logo cutout có sẵn](docs/logo-cutout.md)

Logo, cutout và ảnh Hạ Long gốc được giữ nguyên; WebP là bản tối ưu bổ sung. scripts/optimize-assets.py cần Python/Pillow để tái tạo assets, không cần khi chạy web. Nguồn Commons ở qa/source-images trên máy này, không nằm trong artifact. Muốn tái tạo trên máy khác cần tải ảnh nguồn từ các trang/giấy phép đã ghi.

Đã đối chiếu README và docs/MVP_EXPO_GO.md hiện có trong C:/GoEase/go-ease-webapp, cùng Google Docs EXE101_G17_03. UI_DIRECTION.md và FEATURE_FLOWS.md cũ không còn trong checkout sản phẩm hiện tại. Mockup và AI/lịch trình/ngân sách là định hướng, không phải tính năng đã phát hành.

## Git và website công khai

Repo: https://github.com/tranthaigin/goease-introduce. Website: https://tranthaigin.github.io/goease-introduce/.

Workflow .github/workflows/pages.yml publish dist khi push main. Bản nâng cấp đã được review cục bộ; ngày 14/10/2026 người dùng yêu cầu triển khai bản mới lên GitHub Pages. Sử dụng workflow hiện có, không đổi remote hoặc hosting config. Báo cáo lưu kết quả kiểm thử và trạng thái trước lần phê duyệt này.

qa/ được Git bỏ qua, chứa ảnh chụp/kết quả kiểm thử. scripts/qa-failure-server.mjs chỉ mô phỏng lỗi ở 4175, không nằm trong dist hoặc chạy trong bản thật.
