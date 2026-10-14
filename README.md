# GoEase landing page

Website giới thiệu GoEase, sử dụng HTML/CSS/JavaScript thuần, không cần cài thư viện.

Chạy từ thư mục này bằng `npm start`, mở http://127.0.0.1:4173. Website deploy dùng thư mục `dist`.

Logo chính thức và poster do người dùng cung cấp; ảnh Hạ Long lấy từ tài nguyên dự án C:/GoEase/go-ease-webapp. Giữ nguyên slogan “Just go. We’ll plan.”. Website mặc định tiếng Việt, có nút chuyển English và lưu lựa chọn.

Tài liệu nguồn: README.md, docs/UI_DIRECTION.md, docs/FEATURE_FLOWS.md, docs/MVP_EXPO_GO.md của dự án GoEase. Các chức năng trong website là định hướng, có nhãn đang phát triển. Poster là thiết kế tham chiếu, không phải ảnh chụp ứng dụng đã phát hành.

Hai nút tải đang hiển thị “Sắp ra mắt”, chưa gắn link theo yêu cầu. Khi có URL chính thức, điền `ios` và `android` trong `downloadLinks` ở dist/app.js. Đường dẫn trống mở thông báo; đường dẫn hợp lệ chuyển đến store tương ứng. Không gắn URL Expo Go thay cho ứng dụng GoEase.
