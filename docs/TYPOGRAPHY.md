# GoEase — hệ chữ và mật độ nội dung

Ngày 15/10/2026. Thay đổi local, chưa push/deploy.

## Cơ sở thiết kế

[GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/) dùng các cấp chữ đã thử nghiệm, phân cấp theo vai trò và đơn vị tương đối để hỗ trợ phóng chữ. [USWDS Typography](https://designsystem.digital.gov/components/typography/) coi cỡ chữ, khoảng cách và độ dài dòng là các yếu tố cần xử lý cùng nhau. GoEase áp dụng cách tổ chức đó với Noto Sans cho toàn bộ giao diện và bảng cỡ riêng. Chỉ slogan “Just go. We’ll plan.” dùng Lora; không sao chép nhận diện của các hệ thống này.

[W3C Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) đề cập tăng chữ tới 200% mà không mất nội dung/chức năng. Mốc 14px dưới đây là lựa chọn của GoEase, không phải cỡ tối thiểu được WCAG quy định.

## Bảy vai trò chữ

| Vai trò | Token | Cỡ mặc định | Dùng cho |
| --- | --- | --- | --- |
| Nhãn phụ | `--type-meta` | 14px | Nhãn, nguồn, trạng thái, chú thích |
| Giao diện | `--type-ui` | 16px | Menu, nút, tab, giá trị trong demo |
| Nội dung | `--type-body` | 18px desktop / 16px ≤700px | Đoạn đọc, bài giới thiệu, FAQ, lời thoại |
| Dẫn nhập | `--type-lead` | 20px | Lead, tên bước, tiêu đề trong điện thoại |
| Tiêu đề nhỏ | `--type-title` | 24px | Tiêu đề card/demo, số ngân sách |
| Tiêu đề phần | `--type-section` | 28–40px | Tiêu đề các section |
| Display | `--type-display` | 48–88px | Slogan hero |

Tất cả dùng `rem`/`clamp` với giới hạn rõ ràng. Các khai báo font-size rải rác đã được chuyển về token, không còn những giá trị 6–13px tại từng breakpoint. Nội dung dùng line-height 1.65; tiêu đề phần dùng 1.2; dòng đoạn đọc giới hạn 60ch. Meta không bị giảm nhỏ hơn trên mobile. Chữ “go.” khổng lồ phía sau điện thoại đã được bỏ khỏi hiển thị.

37 nhóm nội dung Việt/Anh được rút gọn, cùng ba cảnh dẫn chuyện và thông báo tải. Giữ các nhãn minh họa/đang phát triển/chưa phát hành, tính năng tương tác, logo, slogan và nền kem. Trong trạng thái ban đầu đo bằng `main.innerText`, lượng chữ giảm từ 806 xuống 592 từ (khoảng 27%); đây là ảnh chụp trạng thái DOM, không phải tổng mọi cảnh/ngôn ngữ/FAQ đóng.

## Bố cục đi cùng chữ

Header có thể xuống hàng khi chữ lớn. Hero mobile xếp dọc; hai nút store xếp dọc để nhãn 14px và tên store 16px không bị ép nhỏ. Demo/phần guide chuyển một cột trên tablet nhỏ. Điện thoại và workspace tăng chỗ cho chữ, các khoản chi phí có thể xuống dòng, cảnh vẫn giữ chiều cao ổn định ở cỡ mặc định. Ảnh có chiều cao tối thiểu theo rem để caption/slogan không chồng nhau khi phóng chữ.

## Kiểm chứng

- Audit desktop trước: 100 phần tử chứa chữ dưới 14px, nhiều cấp 7–65px cùng display 112px. Sau: không có phần tử chữ đang render dưới 14px; các vai trò 14/16/18/20/24/section/display.
- VI tại 1440/1024/768/430/390/320px: không tràn ngang; nội dung ba cảnh story và ba màn hình phone nằm trong khung. Chữ chính là 18px desktop và 16px mobile; meta 14px.
- EN tại 390/320px: ba cảnh và ba màn hình vừa khung, không tràn ngang.
- Fixture local tăng font-size gốc lên 200% (32px): kiểm tra 1440/1024/768/390/320px không tràn ngang. Kiểm tra nội dung story/phone và dialog không bị tràn ngang. Đây là mô phỏng tăng chữ bằng CSS, chưa phải kiểm thử zoom browser/OS thực tế hay chứng nhận WCAG.
- Build kiểm tra token và artifact; năm unit test hiện có kiểm tra slideshow/pause. Giữ toàn bộ hiệu ứng và điều khiển tạm dừng.

Ảnh và số đo: `qa/redesign/typography-*.jpg`, `typography-before.json`, `typography-results.json`. Fixture/scripts migration nằm trong `qa/` được Git bỏ qua, không đưa vào artifact production.
