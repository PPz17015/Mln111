# Quiz Trắc Nghiệm

Ứng dụng web quiz trắc nghiệm với giao diện đẹp và tính năng đầy đủ.

## Tính năng

- ✅ Hiển thị câu hỏi trắc nghiệm với 4 lựa chọn
- ✅ Màu sắc phân biệt: câu đúng (xanh), câu sai (đỏ)
- ✅ Thanh tiến độ hiển thị tiến độ làm bài
- ✅ Thống kê số câu đúng/sai theo thời gian thực
- ✅ Kết thúc tự động khi hết câu hỏi
- ✅ Hiển thị kết quả cuối cùng với phần trăm điểm
- ✅ Danh sách chi tiết các câu trả lời sai
- ✅ Nút làm lại quiz
- ✅ Giao diện responsive, tương thích mobile

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Đọc câu hỏi và chọn đáp án
3. Sau khi chọn, câu đúng sẽ hiển thị màu xanh, câu sai màu đỏ
4. Nhấn "Tiếp theo" để chuyển sang câu hỏi tiếp theo
5. Khi hết câu hỏi, xem kết quả và danh sách câu sai
6. Nhấn "Làm quiz mới" để bắt đầu lại

## Cấu trúc file

- `index.html` - File HTML chính
- `style.css` - File CSS cho styling
- `script.js` - File JavaScript xử lý logic
- `questions.json` - File dữ liệu câu hỏi
- `README.md` - Hướng dẫn sử dụng

## Thêm câu hỏi mới

Để thêm câu hỏi mới, chỉnh sửa file `questions.json`:

```json
{
  "id": 11,
  "question": "Câu hỏi của bạn?",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B", 
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "correct": "A"
}
```

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Hỗ trợ JavaScript ES6+
- Không cần kết nối internet (chạy offline)

## Tác giả

Ứng dụng được tạo để hỗ trợ học tập và kiểm tra kiến thức.
