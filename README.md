# GoEase landing page

Bản redesign phát hành ngày 16/10/2026, theo hướng **Việt Nam, theo cách của bạn**: bố cục tạp chí du lịch, ảnh phong cảnh rộng và phần giới thiệu sản phẩm theo từng bước. HTML/CSS/JavaScript, với Three.js được bundle cục bộ cho mô hình máy bay WebGL; không dùng CDN runtime. Giữ nguyên logo chính thức, slogan **Just go. We'll plan.**, nền kem `#FFF8EF` và light mode.

## Chạy local

Trong PowerShell:

```powershell
cd C:\Wed-GoEase\goease-site
$env:GOEASE_PORT = '4176'
npm start
```

Mở [http://127.0.0.1:4176](http://127.0.0.1:4176). Artifact `dist` chạy trực tiếp, không cần cài dependency để xem. Khi sửa mô hình 3D hoặc build lại, chạy `npm ci` trước. Nếu không đặt `GOEASE_PORT`, server dùng 4173. Dừng bằng Ctrl+C. Sau khi sửa nguồn, tải lại trình duyệt; không có HMR.

```powershell
npm run check
npm run build
npm test
```

Build bundle `src/hero-aircraft.js` bằng esbuild rồi xác minh artifact tĩnh `dist`, cú pháp JS, tài nguyên, anchor, slogan, light theme, catalogue dịch và cấu trúc guide. Không publish. Tám unit test kiểm tra đường bay, autoplay/slideshow; không thay kiểm thử trình duyệt. Bài giới thiệu được kiểm tra trực tiếp về responsive, nội dung Việt/Anh và liên kết.

## Nguồn đang dùng

- `dist/index.html`: trang được thiết kế lại, demo dẫn chuyện, ba màn hình minh họa, một bài giới thiệu cộng đồng, FAQ và một native dialog. Không iframe Facebook.
- `dist/design.css`: toàn bộ hệ thống thiết kế mới, breakpoint, trạng thái tương tác và motion. Các stylesheet cũ được giữ lại nhưng **không còn được tải** bởi trang chính.
- `dist/app.js`: catalogue Việt/Anh, dữ liệu lịch trình minh họa và `downloadLinks`.
- `dist/interactions.js`: menu, ngôn ngữ, guide/day controls, dialog, motion và reveal.
- `src/hero-bay.js`: cảnh vịnh nhiều lớp, gợn nước, thuyền buồm chuyển động, phản chiếu, vệt nước và mây; dùng chung renderer và pause policy với máy bay. Xem [ảnh và prompt](docs/LIVING_BAY_ASSETS.md).
- `src/hero-aircraft.js` → `dist/hero-aircraft.js`: mô hình hình học 3D, ánh sáng, đường bay không gian và pause policy; chạy `npm run build:hero` sau khi sửa nguồn.
- `dist/story-demo.js`: lời thoại hiện dần và mô phỏng hành trình mẫu đồng bộ.
- `dist/slideshow.js`, `dist/motion-state.js`: slideshow hai lớp, decode ảnh thật trước chuyển cảnh, autoplay khoảng 5 giây và pause policy.

Ngôn ngữ và bản demo chuyến đi (khi người dùng bấm lưu) được lưu trong localStorage. Tiếng Việt là mặc định; nút EN chuyển sang tiếng Anh. Noto Sans/Lora hỗ trợ tiếng Việt, tải với `display=swap` và có fallback.

GoEase hiện là dự án đang phát triển. Các màn hình, lịch trình và chi phí là ví dụ có nhãn. Không có AI request, booking hoặc download thật. Hai nút App Store/Google Play mở thông báo sắp ra mắt. Chỉ cập nhật `downloadLinks` khi có URL phát hành chính thức được duyệt.

## Facebook và bài giới thiệu

Theo yêu cầu điều chỉnh mới nhất, phần cộng đồng dùng **một bài giới thiệu tĩnh trên website**, có bố cục gợi nhớ bài đăng Facebook nhưng dùng thiết kế GoEase. Nội dung được biên tập cho website, có nhãn rõ ràng; không phải bản sao feed live. Không hiển thị lượt thích/bình luận giả, không gọi Meta API, không iframe, polling, phân trang hoặc spinner.

Ảnh là hình ảnh thương hiệu có sẵn của dự án; tên và logo chính thức được giữ. Liên kết **Xem bài gốc** mở bài giới thiệu thật đã xác minh trên Facebook; **Ghé fanpage** mở trang chính thức; **Chia sẻ bài gốc** mở hộp chia sẻ Facebook để người dùng tự thao tác. Không thực hiện follow/like/share tự động.

Không cần Meta App hoặc access token để vận hành bài giới thiệu này. Bài viết mới trên Facebook không tự đồng bộ vào website; nội dung website cần chỉnh sửa khi muốn cập nhật. Bản hiện tại chạy hoàn toàn trên GitHub Pages và local static server, không thêm backend. Xem [báo cáo bài giới thiệu và kiểm tra Facebook](docs/FACEBOOK_INTEGRATION_REPORT.md).

## Tài liệu và bằng chứng

- [Hệ chữ, nội dung và QA responsive](docs/TYPOGRAPHY.md)
- [Hướng thiết kế và discovery](docs/REDESIGN_DIRECTION.md)
- [Báo cáo redesign, QA và giới hạn](docs/REDESIGN_REPORT.md)
- [Nguồn ảnh và giấy phép](dist/image-credits.html)
- [Lịch sử logo cutout](docs/logo-cutout.md)
- `qa/redesign/`: ảnh trước/sau, browser-results.json, console và hash baseline; được Git bỏ qua, lưu trên máy local.

Đã đọc README/MVP_EXPO_GO trong `C:/GoEase/go-ease-webapp` và Google Docs tham chiếu. Không sửa repository sản phẩm. Nguồn ảnh/logo có sẵn được giữ nguyên; phong cảnh Hạ Long và ảnh máy bay fallback được tạo riêng cho hero; xem `docs/HERO_ART_DIRECTION.md`.

## Git và hosting

Repo triển khai: [nyanduong/goease-introduce](https://github.com/nyanduong/goease-introduce). Tên miền chính: [goease.com.vn](https://goease.com.vn/).

Workflow `.github/workflows/pages.yml` publish `dist` khi push `main`, hoặc khi chạy thủ công từ GitHub Actions. Trước khi cập nhật website, chạy `npm ci`, `npm run build` và `npm test`, rồi commit cả source và artifact `dist` đã build.

Tên miền được nối với GitHub Pages theo yêu cầu ngày 26/10/2026. Trong Settings → Pages, Source là **GitHub Actions** và Custom domain là `goease.com.vn`. Với workflow này, tên miền được lưu trong cấu hình Pages; không cần file `CNAME` trong repository.

DNS tại Tenten:

| Loại | Tên | Giá trị |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | nyanduong.github.io |

GitHub cấp chứng chỉ TLS cho tên miền sau khi kiểm tra DNS thành công. Bật **Enforce HTTPS** khi chứng chỉ đã sẵn sàng. `www.goease.com.vn` chuyển về tên miền chính. Chỉ xuất bản các thay đổi nội dung khi người dùng yêu cầu.
