# GoEase — báo cáo complete redesign

Ngày: 15/10/2026. Repository: `C:/Wed-GoEase/goease-site`. Baseline HEAD: `2d227170bc3dcf7e365330d0f4b2270ba29a1aa4`; working tree sạch trước khi thực hiện. Phạm vi: hoàn thành và kiểm tra cục bộ, chờ người dùng review.

## Điều chỉnh sau review giao diện

### Hệ chữ thống nhất và ít nội dung hơn

Đã chuẩn hóa bảy vai trò chữ với rem/clamp: meta 14px, UI 16px, body 18px desktop/16px mobile, lead 20px, title 24px, section 28–40px, display 48–88px. Rút gọn 37 nhóm copy VI/EN và lời dẫn demo; bố cục nới theo chữ. Các số đo chữ/phone height trong QA ban đầu là lịch sử trước thay đổi này. Xem [hệ typography và QA mới](TYPOGRAPHY.md).

### Phần Facebook: phạm vi cuối là một bài giới thiệu tĩnh

Theo yêu cầu mới nhất, widget Facebook được thay bằng một article giới thiệu GoEase trên website, bố cục social với avatar/tên, nội dung, ảnh và link bài gốc/fanpage/share. Không còn iframe, feed API hoặc phân trang. Bài này được ghi nhãn nội dung website, không tự đồng bộ với Facebook. Chi tiết điều tra plugin cũ, kiểm tra permalink thật và giới hạn trong [báo cáo Facebook](FACEBOOK_INTEGRATION_REPORT.md). Các mô tả iframe/auto-update trong phần QA ban đầu phía dưới là lịch sử bản trước, không phải phương án hiện tại.

### Demo dẫn chuyện thay cho ba dòng lợi ích

Phần ý tưởng hiện có màn hình mô phỏng Hội An ở một bên và khung thoại GoEase ở bên cạnh. Lời thoại hiện dần, sở thích được chọn, các hoạt động xuất hiện theo thứ tự và thanh chi phí được điền. Ba cảnh tự luân phiên với thời lượng cấu hình 9,5 giây/cảnh. Nút chọn bước giữ cảnh để đọc, có phát/dừng riêng và xem lại từ đầu. Đây là dữ liệu minh họa; không gọi AI, không báo giá hoặc giả lập tính năng đã phát hành.

Module `dist/story-demo.js` dùng chung chính sách autoplay trong `motion-state.js`; tạm dừng khi ngoài viewport, tab ẩn, modal mở hoặc nút pause chung bật. Chế độ giảm chuyển động hiển thị nguyên lời thoại và kết quả của cảnh, không tự luân phiên; người xem vẫn chọn bước được. Screen reader có lời thoại đầy đủ, không bị thông báo từng ký tự. Mobile xếp khung thoại trước màn hình mô phỏng.

QA bổ sung: 8 nhóm kiểm tra browser đạt; VI ở 1440/1024/768/390/320px và EN ở 320px không tràn ngang, nội dung mô phỏng vừa vùng hiển thị, chiều cao ba cảnh ổn định. Đã quan sát tự đổi sang cảnh 2, kiểm tra đồng bộ khi chọn bước, pause riêng/chung giữ nguyên lời thoại và tiến trình, dừng khi ra khỏi viewport, đổi VI/EN và chọn bước bằng Enter. Không benchmark chính xác thời gian chuyển cảnh; locator wait từng hết hạn trước khi DOM xác nhận chuyển. Chưa mô phỏng thiết lập giảm chuyển động của hệ điều hành hoặc document.hidden thực tế. Evidence: `qa/redesign/story-demo-results.json` và `story-demo-*.jpg`. Build hiện xác thực 130 khóa dịch, 26 tham chiếu asset; các số trước đó trong báo cáo thuộc lần QA ban đầu.

Đoạn mô tả phần trải nghiệm nay dùng chung tỷ lệ cột và khoảng cách với product guide, căn giữa theo tiêu đề, có đường nhấn cam; mobile xếp dưới tiêu đề. Nút App Store dùng xanh đậm, Google Play dùng cam đất, chữ kem đậm, bóng nổi và hiệu ứng sáng quét; vẫn giữ nhãn sắp có mặt và dialog thông báo chưa phát hành.

Bổ sung các vòng chuyển động: chấm trạng thái lan sáng, máy bay nhấp nhô ở hero, ảnh Hội An/Sa Pa trôi và zoom chậm, icon lợi ích xoay nhẹ, vòng máy bay quanh điện thoại, điện thoại nổi, chữ nền trôi, ánh sáng quét và mũi tên trên nút tải. Các khu vực hero/ý tưởng/product/download có IntersectionObserver để dừng khi ngoài viewport. Nút pause, document.hidden, dialog và prefers-reduced-motion áp dụng cả phần tử lẫn pseudo-elements.

Browser kiểm tra bố cục 1440, 1024, 768, 390 và 320px: không tràn ngang document; chữ nút tải nằm trong nút ở 320px. Kiểm tra pause giữ nguyên transform của phone/orbit giữa hai lần đọc, pseudo-element chuyển trạng thái paused, dialog dừng hiệu ứng nền và guide vẫn đổi tab. Reduced-motion được giữ bằng CSS/JS; chưa mô phỏng trực tiếp thiết lập hệ điều hành. Screenshot bổ sung trong `qa/redesign/refinement-*.jpg`. Preview tiếp tục chạy local trên port 4176 theo yêu cầu người dùng.

## Creative direction và nghiên cứu

**Việt Nam, theo cách của bạn** — một tạp chí du lịch ấm áp kết hợp phần giới thiệu sản phẩm rõ ràng. Nền kem `#FFF8EF`, màu chữ xanh trầm, các bề mặt jade và điểm nhấn cam đất. Lora tạo nhịp cho slogan/tiêu đề, Noto Sans giữ nội dung Việt/Anh đọc được. Logo chính thức không đổi nội dung/màu sắc; slogan chính xác **Just go. We'll plan.**; không dark mode hoặc theme toggle.

Đã đọc nguồn sản phẩm hiện tại trong `C:/GoEase/go-ease-webapp` và [Google Docs tham chiếu](https://docs.google.com/document/d/1Gw-Ya7AZdLkljLPnj6_fiTi05DxF9bKpGFo-AYz-eJM/edit). GoEase là dự án sớm cho người trẻ tự tổ chức chuyến đi ở Việt Nam; AI/lịch trình/ngân sách là định hướng đang phát triển. Không chuyển số liệu khảo sát/ngành thành số khách hàng GoEase, không thêm testimonials, booking hoặc khả năng đã phát hành.

Đã đọc và mở trực tiếp [Linear](https://linear.app/), [Framer](https://www.framer.com/), [Raycast](https://www.raycast.com/), [Notion](https://www.notion.com/) trong browser. Áp dụng hierarchy, alignment, một điểm nhấn sản phẩm, chuyển cảnh có mục đích và thông tin ngắn gọn. Không sao chép asset/thương hiệu hoặc phối cảnh đặc trưng của các trang đó. Discovery và hướng thiết kế được ghi trước khi implementation trong `REDESIGN_DIRECTION.md`.

## Thay đổi bố cục và trải nghiệm

| Khu vực                 | Bản redesign                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header                  | Masthead gọn, logo chính thức, ba mục điều hướng, EN, pause và availability; mobile có menu riêng.                                                 |
| Hero                    | Slogan serif kết hợp phần giải thích sản phẩm; ảnh panorama xuyên chiều rộng. Bỏ postcard/stamp/icons rời rạc và hai nút store lớn khỏi đầu trang. |
| Lợi ích                 | Một spread bất đối xứng: ảnh Hội An dạng vòm và ba hàng nội dung chia bằng đường kẻ; không ba card giống nhau.                                     |
| Sản phẩm/cách hoạt động | Gom thành một guide ba bước với một điện thoại lớn: nhu cầu, lịch trình, ngân sách. Các tab chuyển màn hình; lịch trình cho chọn ngày 1–3.         |
| Cộng đồng               | Câu chuyện dự án và tiến trình Ý tưởng → Đang phát triển → Ra mắt, cạnh một timeline fanpage thật.                                                 |
| Availability            | Một invitation jade với ảnh Sa Pa; hai action App Store/Google Play rõ nhãn sắp ra mắt.                                                            |
| FAQ/footer              | Bốn disclosure native, footer tối giản, slogan, nguồn ảnh và về đầu trang.                                                                         |

Desktop dùng chiều ngang cho headline/copy, panorama và các spread. Tablet giữ hai cột nhưng giảm device/grid riêng. Mobile rút gọn intro, đưa ảnh lên sớm, dùng ba guide control ngang và một phone đọc được. Ở 390×844, cạnh trên ảnh hero được đo khoảng **372px**; bản cũ trong screenshot khoảng 600px. Điện thoại có chiều cao ổn định **660px** trên cả ba màn hình, tránh thay đổi chiều cao khi chọn bước. Không ép ba phone vào một hàng.

## Slideshow và motion

Hạ Long, Hội An, Sa Pa, Đà Lạt; autoplay khoảng 5 giây theo timer, crossfade hai lớp khoảng 950ms. Desktop zoom rất nhẹ; mobile tắt zoom. Nút trước/sau, bốn indicator, tên/alt/caption theo ngôn ngữ và phím trái/phải ở region. Ảnh đầu ưu tiên; preload ảnh kế tiếp; WebP responsive 480/960/1280. Không tải ảnh full-resolution gốc cho hero.

Decode cả ảnh preload và **phần tử img thực sự được hiển thị** trước khi bỏ lớp cũ, kể cả khi resize chọn srcset khác. Timeout 10 giây; lỗi giữ ảnh đang xem, hiện trạng thái và có thể chuyển sang ảnh khác. Ảnh đầu lỗi tìm điểm đến còn dùng được. Thao tác trong lúc chuyển cảnh được xếp hàng.

Motion gồm entrance chữ/ảnh ngắn, reveal hình ảnh một lần bằng clipping, chuyển màn hình theo chiều ngang, micro-interactions và đường hành trình nhỏ chạy 8 giây trong product stage. Không fade-up đồng loạt hoặc tạo icon/glow ngẫu nhiên. Global pause dừng slideshow, ambient và smooth scrolling; vẫn dùng được menu, FAQ, guide và dialog. Có reduced-motion, visibilitychange, offscreen observers và lifecycle cleanup.

## Buttons và popup

Một hệ thống primary/secondary/outline, focus ring rõ, hover/pressed và control mobile 44px. Nút store giữ đúng mục đích availability, không gắn URL tải giả.

Dialog mới có ảnh Hạ Long và typography biên tập. Desktop hai cột, portrait mobile một cột, phone landscape ngắn chuyển thành panel nội dung gọn. Native modal làm nền inert; thêm vòng Tab/Shift+Tab, Escape, bấm ngoài, confirm, focus restoration và scroll lock. Không có timer tự mở lại. Các khung trang trí dùng `overflow: clip` thay vùng cuộn ẩn.

Đã sửa qua visual/functional QA: lấy text FAQ từ nội dung DOM thay `innerText` của disclosure đang đóng; chuẩn hóa BR để indentation sau formatting không tạo dòng trống; ổn định chiều cao phone; tăng chữ và hit target mobile; bỏ offset anchor kép; thêm layout popup ngang; decode ảnh thực trước crossfade.

## Facebook: chẩn đoán, cơ chế và giới hạn

Nguồn cũ có một iframe Page Plugin, không có clone/post array, polling hay auto-scroll. Có đường tự navigate lại khi ResizeObserver nhận thay đổi width. Không tái hiện được vòng lặp bài trùng trong website. Các link photo/timestamp/comment/share cùng story `122100927537494649` không đủ chứng minh đó là nhiều bài nhân bản.

Bản mới dùng **một iframe chính thức ổn định**, mount gần section và chỉ navigate lại khi người dùng bấm Tải lại. Cuộn, đổi ngôn ngữ, menu, popup và resize không thay iframe source. Có loading, timeout/fallback 12 giây, chiều cao fallback gọn 320px và link fanpage thật. Không thêm vùng cuộn ngoài iframe, không che duplication bằng CSS, không tạo feed giả hoặc scraping.

Bài công khai do Meta cung cấp khi plugin tải/tải lại. Bài mới không cần sửa source/redeploy; tab đang mở không phải một live subscription. Cache, cookie/login và quyền hiển thị của Meta quyết định nội dung/độ trễ. **Không bảo đảm cập nhật tức thì, chưa đăng bài thử để đo cập nhật.** Sau khi resize một khung đã tải, dùng Tải lại nếu Meta cần tính lại chiều rộng; không remount liên tục.

`load` chỉ xác nhận transport, không chứng minh mọi nội dung cross-origin hợp lệ. Fanpage đã hiển thị bài chính thức trong browser, nhưng console vẫn có lỗi từ `static.xx.fbcdn.net` như “Could not find element” và “DataStore.get”. Không thể sửa pagination/dedup bên trong Meta từ frontend khác origin. Không tuyên bố mọi lỗi của Facebook đã hết.

Đã xem [tài liệu Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin/); công cụ nghiên cứu nhận login wall. Giữ endpoint chính thức đã có và kiểm chứng nó qua browser. Graph API chưa triển khai: cần server, token phía server và quyền Meta được xác minh; không đưa credentials vào GitHub Pages.

## Kiểm tra thực tế

Browser: Codex in-app browser thật, dùng các thao tác UI và quan sát DOM/screenshot. Không dùng screenshot render giả làm acceptance. `qa/redesign/browser-results.json` ghi 21 nhóm kiểm tra đạt và một giới hạn emulation; đây là ledger QA browser, không phải suite E2E độc lập.

| Kiểm tra              | Kết quả                                                                                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build                 | JS syntax, 24 local references, đủ 12 biến thể ảnh, slogan/light theme/anchors, 123 chuỗi English, ba tab/panel, một iframe/dialog: pass. Build artifact tĩnh, không publish.                                                                       |
| Unit                  | 5/5: pause reasons, pause kết hợp, wrap hai chiều, ảnh lỗi, tập ảnh rỗng/toàn lỗi.                                                                                                                                                                  |
| Desktop/mobile/tablet | Quan sát 1440×960, 1024×768, 768×1024, 430×932, 390×844, 320×568; không tràn ngang trong các DOM measurements.                                                                                                                                      |
| Phone thấp/ngang      | Popup 390×600 nằm trong viewport; 844×390 dùng panel gọn khoảng 300px, không cần cuộn nội dung dialog.                                                                                                                                              |
| Navigation/menu       | Anchor đúng; mobile mở/đóng, Escape, focus và đóng sau chọn link.                                                                                                                                                                                   |
| Ngôn ngữ              | VI → EN → VI, không chuỗi dịch rỗng; iframe source không đổi.                                                                                                                                                                                       |
| Slideshow             | Pause giữ cảnh qua 5,5 giây, manual next vẫn hoạt động; resume đổi cảnh thật; manual/alt/label khớp.                                                                                                                                                |
| Autoplay đo thời gian | Một locator wait chạm deadline; DOM observation tiếp theo xác nhận Hạ Long → Hội An và ảnh đã tải. Timer source là 5000ms; không công bố benchmark timing chính xác.                                                                                |
| Motion                | Route chạy khi stage hiện; pause giữ transform không đổi qua các thao tác tiếp theo.                                                                                                                                                                |
| Product               | Chọn ba bước bằng click/phím; ngày 2/3 thay timeline mẫu; phone height cả ba bước là 660px.                                                                                                                                                         |
| Dialog                | iOS/Android đúng copy, Tab/Shift+Tab wrap, Escape/confirm/backdrop đóng, nền khóa cuộn, focus trở về trigger. Các kiểm tra scroll lock so sánh vị trí sau khi browser đưa trigger vào view, tránh nhầm auto-scroll của thao tác click với cuộn nền. |
| FAQ                   | Native disclosure mở bằng click, có nội dung, đóng bằng Enter.                                                                                                                                                                                      |
| Facebook thật         | Bài fanpage chính thức; một iframe, source ổn định qua language/modal.                                                                                                                                                                              |
| Timeout Facebook      | Server QA không phản hồi: fallback thật, link fanpage đúng, một iframe; retry trở về loading.                                                                                                                                                       |
| Ảnh 404               | Hội An lỗi giữ Hạ Long, Sa Pa phục hồi; chặn cả ảnh đầu và Hội An vẫn tìm được điểm đến dùng được. Retest sau khi thêm displayed-element decode đạt.                                                                                                |
| Console               | Snapshot cuối không quan sát lỗi JS GoEase; có lỗi provider Meta, đã lưu riêng. 404 ở fixture QA là chủ động.                                                                                                                                       |
| Brand/config/Git      | Hash logo và config đối chiếu baseline; HEAD không đổi, không stage/commit/push/deploy.                                                                                                                                                             |

## Giới hạn và known issues

- Browser hiện chỉ cung cấp viewport/visibility; mở tab thứ hai không đổi `document.hidden`, không có live reduced-motion emulation. Hai chính sách đã được kiểm tra bằng unit/source/CSS; chưa chứng minh bằng thay OS preference hoặc tab-hidden thật. Không đổi cài đặt máy người dùng để giả lập.
- Meta còn lỗi provider và có thể chặn khung theo trình duyệt/cookie. Update timing và resize nội bộ của plugin nằm ngoài website; luôn có link trực tiếp và retry.
- Chưa chạy trên thiết bị vật lý/iOS Safari/Android Chrome riêng, mạng yếu, Lighthouse hoặc đo FPS/Core Web Vitals. Không công bố chứng nhận WCAG hay điểm hiệu năng.
- Một tab cũ lỗi khi thử cổng 4174; browser đã được khôi phục bằng tab mới ở 4176. Các screenshots và QA cuối lấy từ trang GoEase hoạt động.

Không quan sát blocker trong chức năng GoEase được kiểm tra. Giao diện và chất lượng thiết kế vẫn cần người dùng review trước khi xuất bản.

## Ảnh trước/sau

Ảnh thật được lưu trên máy local, trong `qa/redesign/` (Git ignored). Ảnh hero dùng pause để cố định cảnh khi chụp.

- Trước: `before-desktop.jpg`, `before-mobile.jpg`.
- Sau hero: `after-desktop-hero.jpg`, `after-mobile-hero.jpg`, `after-mobile-320.jpg`.
- Toàn trang: `after-desktop-full.jpg`, `after-mobile-full.jpg`.
- Sections: `after-desktop-idea.jpg`, `after-desktop-product.jpg`, `after-desktop-community.jpg`, `after-desktop-download.jpg`, `after-mobile-product.jpg`, `after-tablet-product.jpg`.
- Popup: `after-desktop-dialog.jpg`, `after-mobile-dialog-390x600.jpg`, `after-landscape-dialog-844x390.jpg`.
- Fallback: `facebook-timeout-fallback.jpg`.

Ảnh toàn trang không ghi lại nội dung iframe Facebook khi nó ở ngoài viewport. `after-mobile-facebook.jpg` chụp riêng khi cuộn vào khung, cho thấy fanpage thật; dùng ảnh section để đánh giá nội dung nhúng, không xem ô trống trong full-page capture là ảnh feed hoàn chỉnh. Card luôn có liên kết trực tiếp **Xem bài viết trên Facebook** bên cạnh Tải lại để dùng cả khi provider không hiển thị đúng.

## Local preview và ranh giới xuất bản

```powershell
cd C:\Wed-GoEase\goease-site
$env:GOEASE_PORT = '4176'
npm start
```

Mở [http://127.0.0.1:4176](http://127.0.0.1:4176). Server mặc định là 4173 nếu không đặt biến. Chỉ cần Node; không có dependency install. `npm run build` kiểm tra `dist`, không tạo APK/IPA hoặc chứng minh tính năng app thật.

**Không commit, stage, push, merge, deploy hoặc trigger GitHub Pages.** Không sửa repo sản phẩm, logo assets, workflow hoặc hosting config. Dừng ở bản cục bộ để người dùng review và yêu cầu xuất bản rõ ràng sau đó.
