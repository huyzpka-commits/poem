# Văn Thơ Việt

> Trợ thủ sáng tác và kiểm tra luật thơ truyền thống & hiện đại Việt Nam — chạy trực tiếp trên trình duyệt, không cần cài đặt.

---

## Tổng quan

**Văn Thơ Việt** là một ứng dụng web đơn trang (SPA) giúp người dùng soạn thảo, phân tích và kiểm tra tính hợp lệ của các thể thơ Việt Nam theo đúng luật cổ điển. Ứng dụng tự động nhận diện thanh điệu (bằng/trắc), tách vần, đếm số chữ, kiểm tra nhịp và gieo vần chân/lưng.

---

## Các thể thơ được hỗ trợ

### 1. Thơ Dân Tộc
- **Lục bát**: Kiểm tra cặp câu 6-8 chữ, vần chân, vần lưng, nhịp chẵn (2/2/2), thanh vần bằng/trắc.
- **Song thất lục bát**: Khổ 4 câu (7-7-6-8), vần chân khổ, vần lưng, thanh bằng/trắc đan xen.
- **Hát nói**: Nhận diện cấu trúc tự do, dùng trong nghệ thuật ca trù.

### 2. Thơ Đường Luật
- **Thất ngôn bát cú**: 8 câu, 7 chữ/câu. Luật bằng/trắc khắt khe. Bố cục 4 phần: Đề, Thực, Luận, Kết.
- **Thất ngôn tứ tuyệt**: 4 câu, 7 chữ/câu. Bản rút gọn của bát cú.
- **Ngũ ngôn bát cú / tứ tuyệt**: 5 chữ/câu. Luật gieo vần tương tự thất ngôn.

### 3. Thơ Hiện Đại
- **Thơ tự do**: Không giới hạn số chữ, số câu. Cảm xúc định nhịp.
- **Thơ 5, 7, 8 chữ**: Kế thừa form truyền thống. Cảnh báo nếu câu lệch form.
- **Thơ văn xuôi**: Viết dạng đoạn văn. Không xuống dòng theo câu.

---

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt (Chrome, Edge, Firefox, Safari...).
2. Chọn **thể thơ** trong danh sách thả xuống.
3. Nhập hoặc dán bài thơ vào khung soạn thảo (mỗi câu trên một dòng).
4. Bấm **"Phân tích & Kiểm tra"**.
5. Xem kết quả:
   - **Lỗi** (đỏ): sai số chữ, sai vần, sai luật bằng/trắc.
   - **Cảnh báo** (cam): thanh vần chưa chuẩn, số câu chưa đủ.
   - **Chi tiết từng câu**: mỗi chữ được tô màu — **xanh lá** = thanh bằng, **đỏ** = thanh trắc.

---

## Cấu trúc dự án

```
Poem-Lucbat/
├── index.html              # Giao diện chính (SPA)
├── css/
│   └── style.css           # Phong cách thiết kế Việt Nam (giấy cổ, mực tàu, đỏ son)
└── js/
    ├── vietnamese-utils.js # Engine xử lý tiếng Việt: tách vần, nhận diện thanh bằng/trắc
    ├── poem-analyzer.js    # Engine phân tích luật các thể thơ
    └── app.js              # Logic giao diện & điều phối
```

---

## Công nghệ

- **HTML5** + **CSS3** — Giao diện responsive, không dùng framework.
- **Vanilla JavaScript** — Không phụ thuộc thư viện bên thứ ba.
- **Unicode NFC/NFD** — Xử lý dấu thanh tiếng Việt chính xác.

---

## Hướng dẫn chạy local

```bash
# Clone repository
git clone https://github.com/huyzpka-commits/poem.git

# Di chuyển vào thư mục
cd poem

# Mở bằng trình duyệt (Windows)
start index.html

# Hoặc trên macOS/Linux
open index.html
```

Hoặc sử dụng Live Server trong VS Code để phát triển.

---

## Lưu ý kỹ thuật

- Thanh điệu được nhận diện dựa trên **dấu thanh tiếng Việt** trong Unicode:
  - **Bằng**: ngang, huyền
  - **Trắc**: sắc, hỏi, ngã, nặng
- Vần được tách bằng cách loại bỏ **phụ âm đầu**, đủ chính xác cho đa số từ thuần Việt.
- Với từ Hán Việt đa âm hoặc vần đặc biệt, người dùng có thể tinh chỉnh thủ công trong `js/vietnamese-utils.js`.

---

## Giấy phép

Mã nguồn mở. Bạn có thể tự do sử dụng, chỉnh sửa và phân phối.

---

*Văn Thơ Việt — Nâng niu từng vần thơ Việt.*
