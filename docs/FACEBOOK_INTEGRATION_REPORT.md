# GoEase — bài giới thiệu trên website thay cho Facebook widget

Ngày 15/10/2026. Phạm vi cuối cùng theo yêu cầu mới nhất: một bài giới thiệu tĩnh trên website, có bố cục gợi nhớ Facebook. Không làm cả fanpage hoặc tích hợp API khi chưa có quyền. Toàn bộ thay đổi local; chưa commit/push/merge/deploy.

## Kết quả và kiến trúc

Một article HTML duy nhất trong phần Cùng GoEase: avatar/logo, tên GO EASE, nhãn “Bài giới thiệu trên website · Đang phát triển”, nội dung được biên tập cho website, hình ảnh Hạ Long của dự án, slogan và ba action. Không giả số lượt theo dõi, cảm xúc hoặc bình luận; không giả ngày đăng Facebook, huy hiệu xác minh hoặc khả năng sản phẩm đã phát hành. Ảnh minh họa là asset GoEase có sẵn, không được gọi là cover/profile tải từ Meta.

Xem bài gốc mở permalink đã kiểm tra của bài giới thiệu Facebook thật. Ghé fanpage mở trang chính thức. Chia sẻ bài gốc mở hộp chia sẻ của Facebook, người dùng tự xác nhận trên Facebook. Không thực hiện hành động social trong quá trình triển khai.

Không iframe, SDK Meta, access token, API endpoint, polling hoặc phân trang. Server local vẫn chỉ phục vụ artifact tĩnh như trước. Prototype API/Worker và fixture source tạo trong bước nghiên cứu đã được gỡ sau khi người dùng đổi phạm vi; không để lại đường tích hợp chưa dùng.

## Điều tra widget cũ

Plugin chính thức trước đây có một iframe 498×460px, một vùng cuộn nội bộ `_10b4` có clientHeight 389px và scrollHeight 761px. Mã GoEase chỉ mount một lần, không clone post hoặc tự cuộn. Event iframe `load` chỉ chứng minh tải khung, không chứng minh timeline bên trong đã kết thúc; lỗi Meta và progressbar bên trong không được trạng thái ngoài xử lý.

Quan sát dữ liệu thật thấy một ID bài `122100927537494649`. Sau ba lần thử cuộn, snapshot vẫn chứa ID đó. Đếm phần tử thật cho thấy **một** link “Tìm chúng tôi trên Facebook” và một progressbar; hai lần xuất hiện chữ trong accessibility snapshot không đồng nghĩa hai placeholder thật. Chưa tái hiện chuỗi placeholder vô hạn người dùng mô tả; thư mục attachment chỉ có văn bản, không có video/ảnh được nêu trong brief. Vì vậy không khẳng định đã tìm được lỗi nội bộ Meta hay bài thật bị duplicate.

Thiết kế mới loại bỏ toàn bộ vùng cuộn/plugin đó. Article nằm trong luồng trang bình thường; hết bài thì người xem cuộn tiếp xuống phần tải ứng dụng. Không có loading hoặc request feed có thể chạy vô hạn.

## Meta API và cập nhật

User xác nhận chỉ có link fanpage, chưa có cấu hình Meta. Request không token tới Graph trả HTTP 400, OAuthException code 104: cần access token. Không thể xác minh các scope hoặc field Page thật được phép đọc trong app chưa cấu hình. [Collection chính thức của Meta](https://www.postman.com/meta/facebook/request/bqfxwbp/get-access-tokens-of-pages-you-manage) mô tả Page Access Token được cấp cho trang người dùng có quyền quản lý; link fanpage không thay thế quyền API.

Các trang tài liệu developers.facebook.com thử truy cập trả lỗi/429 trong phiên này; không dùng mirror không chính thức để khẳng định version hoặc permission mới nhất. Feed Graph, các field media/engagement và đồng bộ bài mới chưa được kiểm chứng live. User đã chọn hướng bài giới thiệu tĩnh thay cho việc tiếp tục tích hợp API.

**Không tự đồng bộ bài mới từ Facebook.** Liên kết fanpage luôn dẫn tới nội dung mới nhất trên Facebook; muốn đổi bài giới thiệu trên website thì chỉnh nguồn website. Không cần backend hoặc quyền Meta cho phương án hiện tại.

## Kiểm chứng và bằng chứng

Permalink thật được mở trong browser, đóng nhắc đăng nhập và xác minh tác giả GO EASE, bài chào giới thiệu/cập nhật ảnh đại diện, trạng thái công khai và ngày 1/10. Không sao chép số tương tác quan sát được vào giao diện website. Screenshot: `qa/redesign/facebook-genuine-permalink.jpg`.

Build xác minh một article giới thiệu, không iframe, anchor/asset/catalogue Việt–Anh. Các kiểm tra responsive, link và luồng cuộn của bản cuối được ghi trong `qa/redesign/static-intro-post-results.json`, ảnh `static-intro-post-*.jpg`. Năm unit test slideshow/pause vẫn chạy; không thêm test giả việc tích hợp Facebook live.

Evidence của prototype API được lưu trong `qa/redesign/facebook-QA-ONLY-*` và `facebook-integration-results.json` có ghi rõ fixture, được Git bỏ qua. Chúng không đại diện cho phương án cuối hoặc dữ liệu Meta live. Không dùng các kiểm tra prototype để tuyên bố website đang có feed Facebook tự đồng bộ.
