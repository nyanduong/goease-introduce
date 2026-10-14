# GoEase landing page

Website giới thiệu GoEase, sử dụng HTML/CSS/JavaScript thuần, không cần cài thư viện.

Chạy từ thư mục này bằng `npm start`, mở http://127.0.0.1:4173. Website deploy dùng thư mục `dist`.

## GitHub Pages

Địa chỉ: https://tranthaigin.github.io/goease-introduce/

Workflow `.github/workflows/pages.yml` kiểm tra JavaScript và triển khai thư mục `dist` khi push vào `main`. Có thể chạy lại bằng Actions → Deploy GoEase to GitHub Pages → Run workflow. Pages dùng nguồn GitHub Actions. Các đường dẫn ảnh/CSS/JS dùng đường dẫn tương đối để hoạt động tại `/goease-introduce/`.

Logo chính thức và ảnh định hướng màu do người dùng cung cấp; ảnh Hạ Long lấy từ tài nguyên dự án C:/GoEase/go-ease-webapp. Ảnh 1 dùng để định hướng phong cách, không nhúng làm phần giới thiệu ứng dụng. Ba màn hình điện thoại minh họa được dựng bằng HTML/CSS. Giữ nguyên slogan “Just go. We’ll plan.”. Website mặc định tiếng Việt, có nút chuyển English và lưu lựa chọn.

Tài liệu nguồn: README.md, docs/UI_DIRECTION.md, docs/FEATURE_FLOWS.md, docs/MVP_EXPO_GO.md của dự án GoEase. Các chức năng trong website là định hướng, có nhãn đang phát triển. Phần xem trước là giao diện minh họa, không phải ảnh chụp ứng dụng đã phát hành.

Repo dự án: https://github.com/tranthaigin/goease-introduce. Remote `origin` trỏ tới repo này. Sites dùng kho riêng qua helper của plugin; không thay đổi remote GitHub khi triển khai Sites.

Màu sắc theo ảnh 1: kem `#FFF8EF`, xanh ngọc `#008B92`, xanh đậm `#123E4B`, cam `#F58B27`; hành động chính dùng gradient cam vàng, nền nhấn dùng gradient xanh ngọc. Lớp phong cách dự án nằm trong `dist/theme.css`, bố cục responsive trong `dist/styles.css`.

Phông chính: Noto Sans variable qua Google Fonts, hỗ trợ tiếng Việt, có font hệ thống dự phòng và `display=swap`. Nội dung chính tăng cỡ chữ và khoảng dòng. Animation dùng CSS và IntersectionObserver: nội dung hiện một lần khi cuộn tới, nút phản hồi nhẹ và hộp thoại hiện nhanh. Không dùng thư viện animation hay xử lý cuộn liên tục; hỗ trợ `prefers-reduced-motion` và điều hướng bằng bàn phím.

Các phần du lịch dùng `dist/travel.css`: cụm điện thoại mở từ hai chiếc chồng sang ba chiếc xòe khi vào màn hình; ba thẻ hành trình hiện theo thứ tự cùng đường bay; khung tải và logo chuyển động chậm, tạm dừng khi ra ngoài màn hình. Có nút tạm dừng/tiếp tục và hỗ trợ giảm chuyển động. Điện thoại dùng bố cục ba chiếc thu nhỏ trên mobile.

Mục Giới thiệu liên kết tới https://www.facebook.com/profile.php?id=61594839483458 và nhúng Page Plugin chính thức, tải khi cuộn gần tới mục này. Nút mở Facebook luôn hiện, kể cả khi plugin bị chặn. Plugin có thể phụ thuộc quyền riêng tư, cookie và cấu hình phía Facebook.

Logo nền trong suốt dùng riêng ở khung tải: `dist/assets/goease-logo-cutout.png`. Logo gốc được giữ nguyên. Xem [prompt và nguồn asset](docs/logo-cutout.md).

Hai nút tải đang hiển thị “Sắp ra mắt”, chưa gắn link theo yêu cầu. Khi có URL chính thức, điền `ios` và `android` trong `downloadLinks` ở dist/app.js. Đường dẫn trống mở thông báo; đường dẫn hợp lệ chuyển đến store tương ứng. Không gắn URL Expo Go thay cho ứng dụng GoEase.
