# GoEase — báo cáo nâng cấp

Ngày kiểm tra: 14/10/2026. Repository: `C:/Wed-GoEase/goease-site`. Bản xem thử: **http://127.0.0.1:4174**.

## Kết quả, UI/UX và thương hiệu

Nâng cấp website hiện có bằng HTML/CSS/JavaScript thuần, không thêm framework hoặc dependency runtime. Giữ logo, tên GoEase, slogan “Just go. We’ll plan.”, bảng màu kem/xanh ngọc/cam, thông điệp tiếng Việt, ngôn ngữ Anh, FAQ, liên kết Facebook và hai nút tải sắp ra mắt. AI/lịch trình/ngân sách vẫn được mô tả là định hướng đang phát triển; không thêm số liệu người dùng hay testimonial giả.

Đã audit trước sửa, đọc README/MVP_EXPO_GO trong C:/GoEase và Google Docs EXE101_G17_03, tham khảo Linear/Framer/Raycast/Notion về khoảng cách, hierarchy, product presentation và motion. Không đổi tài liệu hoặc dự án sản phẩm. Audit chi tiết nằm trong `PREMIUM_AUDIT.md`.

Website dùng `color-scheme: light`, không dark theme, theme toggle hoặc OS color-scheme switching. Chỉ ngôn ngữ được lưu trong localStorage. Noto Sans hỗ trợ tiếng Việt và font fallback giữ nguyên. Các CSS nền, logo gốc/cutout và ảnh Hạ Long gốc có hash bằng HEAD ban đầu.

Tinh chỉnh trạng thái active navigation, focus, nút nhấn, menu tablet, spacing, FAQ và bố cục kết trang. CTA tải nằm sau FAQ/About để kết thúc hành trình nội dung. Hero giữ thông điệp và bố cục đã duyệt.

## Desktop, tablet và mobile

Desktop giữ phone fan có chiều sâu, hover nhỏ và ba thẻ hành trình dạng vé. Tablet/mobile dùng phone 260px, scroll-snap, vuốt ngang, nút trước/sau và phím trái/phải; không thu cả ba thành chữ quá nhỏ. Tablet có menu đầy đủ ở breakpoint riêng.

Mobile giảm khoảng dịch chuyển, bỏ zoom ảnh và một số trang trí ambient, giữ fade và phản hồi thao tác. Có vùng chạm/focus rõ, safe-area, popup theo chiều cao màn hình, footer và nút tải chỉnh riêng.

## Hệ thống animation

- Hero entrance phối hợp headline/mô tả/CTA/ảnh khoảng 580–750ms, opacity/translate nhẹ, không chặn tương tác.
- Reveal một lần bằng IntersectionObserver; focus, pause hoặc reduced motion làm rõ nội dung, tránh kẹt phần ẩn.
- Phone fan khoảng 1.1s; thẻ hành trình delay 0/280/560ms. Theo yêu cầu bổ sung, đường bay chạy lặp chậm 8s, nét nối sáng dần và các mốc sáng tuần tự; có observer riêng để dừng ngoài viewport.
- Ambient có giới hạn: máy bay hero chậm, logo float 8s, khung CTA drift 12s, halo/orbit chậm. CTA dừng ngoài viewport; mobile có ít hiệu ứng hơn.
- Hai nút pause đồng bộ toàn trang, kể cả slideshow. CSS animation và chuyển cảnh không thiết yếu dừng, nội dung vẫn dùng được. Có visibilitychange, reduced-motion, pagehide/pageshow và dọn timer/observer. Không thư viện animation hoặc vòng xử lý scroll liên tục.

## Hero slideshow

Hạ Long (minh họa dự án), Hội An, Sa Pa, Đà Lạt; hai lớp ảnh cố định, crossfade 950ms (mobile 800ms), tự đổi khoảng 5 giây. Desktop zoom nhẹ, mobile không zoom. Có previous/next, bốn indicator, phím trái/phải, tên điểm đến/alt Việt–Anh, thông báo cho điều hướng thủ công.

Ảnh đầu ưu tiên, chỉ preload ảnh kế tiếp bằng Image/decode; WebP 480/960/1280 và responsive srcset/sizes. Autoplay dừng khi pause, reduced motion, tab ẩn, hover, focus trong slideshow, modal mở, đang xử lý hoặc ngoài viewport. Gỡ một lý do pause không bỏ qua lý do khác.

Ảnh lỗi giữ ảnh đang xem, báo lỗi và skip khi autoplay; ảnh đầu lỗi tự tìm điểm đến dùng được. Timeout ảnh 10s; thao tác lúc chuyển ảnh được xếp hàng. Nguồn ảnh Commons/tác giả/giấy phép nằm trong `dist/image-credits.html`. Logo và ảnh gốc không sửa nội dung, chỉ thêm bản WebP tối ưu.

## Popup và các lỗi được sửa qua kiểm thử

Giữ một native dialog, nền sáng, mở 220ms/đóng 180ms (tức thời khi motion dừng). Cả iOS/Android ở hero và CTA đúng thông báo chưa có link tải. Có close, confirm, Escape, click ngoài, Tab/Shift+Tab trap, focus phục hồi, nền inert và khóa cuộn root/body có phục hồi style/vị trí.

Kiểm thử phát hiện Tab có thể thoát khỏi dialog trong IAB: bổ sung vòng focus rõ ràng và retest pass. Phát hiện focus sau đóng dialog cuộn bên trong khung CTA 74px, che tiêu đề phụ: `overflow: clip` cắt trang trí mà không tạo scroll container. Retest tọa độ trước/sau bằng nhau, panel scrollTop 0. Đây là sửa khung CTA, không phải cách che lỗi Facebook.

Kiểm tra ảnh chụp cũng phát hiện menu/FAQ mới mở khi pause có thể bị đóng băng ở opacity 0 do entrance cũ. Đã loại animation cho các nội dung thao tác thiết yếu khi pause; retest menu và nội dung FAQ có opacity 1.

## Facebook: chẩn đoán, giải pháp và cập nhật bài mới

**Vòng lặp bài đăng chưa tái hiện được.** Trước sửa chỉ có một iframe, không có clone/polling/mount loop của website. Scroll trong plugin vẫn liên kết tới story `122100927537494649`; timestamp/xem thêm/bình luận/chia sẻ của cùng bài không phải bài nhân bản. Console có lỗi provider từ `static.xx.fbcdn.net` (“Could not find element”, module/DataStore). Không có bằng chứng để khẳng định website tạo bài trùng hoặc mọi lỗi Meta đã được sửa.

Đã sửa điểm yếu thuộc website: wrapper nhúng không tham gia reveal transform, width responsive tối đa 500px, height có chủ đích 540/560px, tải gần About, loading/fallback 12s, retry và link trực tiếp. Một iframe ổn định; đổi ngôn ngữ/modal/cuộn không đổi src. Chỉ reload khi width thay đổi đủ lớn (debounce 400ms) hoặc người dùng retry. Không auto-scroll, polling hay tạo feed giả. Chỉ plugin Meta có scrollbar, không thêm vùng cuộn ngoài.

`load` iframe chỉ xác nhận transport, không chứng minh nội dung cross-origin hợp lệ. Không thể tự phát hiện mọi lỗi cookie/chặn hoặc can thiệp pagination/dedup bên trong Meta. Link mở fanpage luôn sẵn để người dùng xem trực tiếp.

Page Plugin là cơ chế chính thức cung cấp public timeline khi tải/tải lại; thêm bài công khai không cần sửa mã/redeploy website. Tab đang mở không được polling liên tục; khách refresh hoặc tải lại khung để lấy nội dung provider hiện tại. Không có SLA tức thời: thời gian phụ thuộc cache/quyền hiển thị của Meta, chưa kiểm chứng bằng việc đăng bài mới. Không đăng thử lên fanpage trong nhiệm vụ này.

Nếu cần chủ động lấy/caching feed, phương án Graph API cần backend/serverless, token phía server, Meta app/quyền phù hợp, có thể app review và xử lý rate limit/cache. Không đưa token vào GitHub Pages. Không có credentials/backend được cung cấp nên không triển khai API. Tài liệu Meta mở trong audit bị giới hạn login/không trả đủ nội dung; không khẳng định tên quyền/hạn mức chưa xác minh. Không scraping.

## Hiệu năng và accessibility

Ảnh Hạ Long gốc 2,662,404 bytes được giữ; WebP 960px là 103,778 bytes, 480px là 29,936 bytes. Đây là byte file đo được, không phải thời gian tải/Lighthouse. Logo nhỏ và ảnh responsive giảm tải asset lớn. Không tải ngay tất cả ảnh nguồn full-resolution, iframe tải trễ, animation chủ yếu transform/opacity, không thêm runtime dependencies.

Semantic nav/FAQ/dialog, focus visible, controls có tên, active indicator, alt và live announcement thủ công. Không có Lighthouse CLI sẵn; không công bố điểm Lighthouse, FPS/Core Web Vitals hoặc chứng nhận WCAG toàn diện. Chưa đo trên thiết bị yếu/mạng chậm thật.

## Kiểm thử đã chạy

| Kiểm tra | Kết quả thực tế |
| --- | --- |
| npm run build | Pass JS syntax và 20 local references; kiểm tra đủ 12 biến thể ảnh, một iframe/một dialog. Artifact tĩnh, không bundling/publish. |
| npm test | 5/5 pass: pause reasons, pause kết hợp, wrap hai hướng, skip ảnh lỗi và tập ảnh rỗng/toàn lỗi. |
| git diff --check | Pass; chỉ cảnh báo LF/CRLF thông thường. |
| Slideshow | Quan sát Hạ Long → Hội An sau khoảng 5.5s; pause và focus giữ điểm đến qua 5.5s; previous/next thủ công vẫn dùng được; Việt/Anh đúng. |
| Phone/journey | Trước cuộn chưa phones-open; sau cuộn/1.5s đủ ba phone xòe opacity 1; card delay 0/0.28/0.56s hiện đủ. |
| Ambient | CTA/logo running khi hiện, paused sau nút pause. |
| Đường hành trình bổ sung | Máy bay di chuyển ngang đúng đường; chu kỳ 8s infinite, progress và ba mốc đồng bộ. Nút pause giữ nguyên transform qua 1.1s. |
| Modal | Hero/CTA iOS/Android đúng copy; Escape, confirm, outside, Tab/ShiftTab, focus restore và không dịch ngang. |
| Mobile popup 390×600 | Dialog trong viewport, scroll nền không đổi khi thử cuộn ngoài; Escape mở khóa và focus về iOS. |
| CTA sau dialog | Tọa độ copy trước/sau bằng nhau, panel scrollTop 0. |
| Menu/preview/FAQ | Tablet/mobile mở/đóng/Escape, đóng sau link; preview nút/phím đổi 02/03 → 03/03; FAQ click mở/Enter đóng. |
| Facebook thật | Bài chính thức, một iframe; src không đổi qua language/modal ở cùng width; mobile không tràn ngang. |
| Facebook timeout | Server QA không phản hồi: sau 13.5s hiện fallback, link đúng, vẫn một iframe. |
| Ảnh 404 | Hội An lỗi giữ ảnh đang xem và báo lỗi; chặn thêm ảnh đầu Hạ Long phục hồi Sa Pa rồi tiếp tục điểm đến khác. |
| Console | Không quan sát lỗi JS GoEase trong luồng thường; lỗi Meta còn tồn tại; 404 trên server QA được chủ động mô phỏng. |
| Brand/config | Hash logo gốc/cutout/ảnh Hạ Long, 3 CSS gốc, workflow và hosting config bằng HEAD ban đầu. |

### Responsive trong trình duyệt

Đã chạy **360×844, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080**. Cả chín: documentWidth = clientWidth, không tràn ngang, không ảnh đã tải bị hỏng, light scheme, đúng một iframe. Mobile/tablet phone 260px/controls hiện; desktop fan/controls ẩn. Đã xem trực quan hero, product preview, About/Facebook, CTA và popup ở các kích thước đại diện.

Ảnh chụp ở `qa/premium/`, dữ liệu `qa/premium/responsive.json` (Git ignored). Kiểm tra thêm mobile cao 600px. Chưa chạy orientation suite trên máy thật hoặc đủ Safari/Firefox.

### Giới hạn kiểm chứng còn lại

IAB không có reduced-motion media emulation. Thử đổi tab/ẩn browser panel không làm document.hidden đổi: **chưa mô phỏng thành công hidden-tab/OS reduced-motion trong browser**. Nhánh policy có unit tests; event/CSS được audit, không coi đó là xác minh OS thật. Hover có handler/policy, chưa kiểm thử con trỏ độc lập khỏi focus. Bfcache được xử lý nguồn nhưng chưa chạy tình huống thật.

Không có xác nhận độ trễ bài Facebook mới hoặc bảo đảm hết lỗi bên trong Meta. Các giới hạn provider/thiết bị nêu trên là phần cần review tiếp; không có lỗi website đã phát hiện còn bỏ mặc sau các kiểm tra này.

## File thay đổi

- Sửa: `dist/index.html`, `dist/app.js`, `package.json`, `server.mjs`, `README.md`.
- Thêm runtime: `dist/premium.css`, `interactions.js`, `slideshow.js`, `motion-state.js`, `image-credits.html`.
- Thêm assets: 12 WebP cho ha-long/hoi-an/sa-pa/da-lat ở 480/960/1280; `goease-logo-small.webp`, `goease-logo-cutout-small.webp`.
- Thêm công cụ: `scripts/validate-site.mjs`, `optimize-assets.py`, `qa-failure-server.mjs`, `tests/slideshow-state.test.mjs`.
- Thêm tài liệu: `docs/PREMIUM_AUDIT.md`, `docs/PREMIUM_REPORT.md`.

app.js giữ catalogue/download links; controller chuyển sang interactions.js. Không xóa tài nguyên/CSS gốc, không sửa dự án C:/GoEase hoặc Google Docs.

## Preview và Git trước khi phê duyệt xuất bản

Server review 4174 được giữ chạy; server mô phỏng lỗi 4175 đã dừng. Để chạy lại:

```powershell
cd C:\Wed-GoEase\goease-site
$env:GOEASE_PORT = '4174'
npm start
```

Mở http://127.0.0.1:4174. QA và ảnh nguồn không nằm trong dist.

HEAD vẫn `ae662b4808748b3269d32899f98281402c889225`, branch main, origin giữ nguyên. Tất cả sửa đổi trong working tree, không stage/commit. Không push, merge, PR, Actions hoặc deploy, không hành động sửa website công khai. Workflow/hosting config giữ nguyên.

Các trạng thái Git trên là bản ghi khi kết thúc review cục bộ. Ngày 14/10/2026, người dùng yêu cầu “deploy phần mới làm lên đi”, cho phép commit/push bản nâng cấp và xuất bản bằng workflow GitHub Pages hiện có. Giao diện sáng và thương hiệu vẫn được giữ nguyên.
