# Hướng dẫn Sử dụng Quiz Application - Phiên bản Tối ưu

## 🚀 Khởi động nhanh

1. **Mở ứng dụng**: Double-click vào file `index.html`
2. **Chờ tải**: Loading indicator sẽ hiển thị trong vài giây
3. **Bắt đầu quiz**: Chọn đáp án và nhấn "Câu tiếp theo"

## 📊 Hiệu suất với 5000 câu hỏi

### **Tác động đến RAM**
- **File JSON**: ~2-5MB
- **Memory khi load**: ~10-20MB
- **Kết luận**: ✅ Rất nhẹ, không ảnh hưởng đáng kể

### **Tác động đến CPU**
- **Load ban đầu**: ~100-200ms
- **Xử lý DOM**: ~50-100ms
- **Kết luận**: ✅ Hiệu suất tốt, không lag

### **Tác động đến Network**
- **Chỉ load 1 lần**: Không cần request thêm
- **Kết luận**: ✅ Tối ưu bandwidth

## 🔧 Tính năng Tối ưu

### **1. Lazy Loading**
- Chỉ tải 100 câu hỏi mỗi lần
- Giảm tải ban đầu và sử dụng RAM
- Tải trang tiếp theo khi cần

### **2. Memory Management**
- Giải phóng bộ nhớ không cần thiết
- Sử dụng `will-change` CSS để tối ưu animation
- Quản lý DOM elements hiệu quả

### **3. Performance Features**
- Loading indicator với spinner
- Progress bar hiển thị tiến trình
- Page info hiển thị trang hiện tại
- Responsive design cho mobile

## 📱 Giao diện Người dùng

### **Header**
- Tiêu đề ứng dụng
- Progress bar hiển thị tiến trình
- Thông tin điểm số (Đúng/Sai)

### **Question Section**
- Hiển thị câu hỏi hiện tại
- 4 lựa chọn A, B, C, D
- Màu sắc phản hồi:
  - 🟢 **Xanh**: Đáp án đúng
  - 🔴 **Đỏ**: Đáp án sai

### **Navigation**
- **Câu tiếp theo**: Chuyển sang câu hỏi tiếp theo
- **Làm quiz mới**: Bắt đầu lại từ đầu

### **Results Section**
- Tổng điểm số
- Tỷ lệ phần trăm đúng
- Danh sách câu trả lời sai chi tiết

## 🎯 Cách sử dụng Chi tiết

### **Bước 1: Khởi động**
```
1. Mở file index.html
2. Chờ loading indicator biến mất
3. Đọc câu hỏi và các lựa chọn
```

### **Bước 2: Trả lời**
```
1. Click vào đáp án bạn chọn
2. Xem phản hồi màu sắc
3. Nhấn "Câu tiếp theo" để tiếp tục
```

### **Bước 3: Kết thúc**
```
1. Hoàn thành tất cả câu hỏi
2. Xem kết quả tổng thể
3. Xem lại các câu trả lời sai
4. Nhấn "Làm quiz mới" để bắt đầu lại
```

## 🔍 Test Hiệu suất

### **Sử dụng Performance Test**
1. Mở file `performance-test.html`
2. Chạy các test:
   - **Test 1**: Load Questions JSON
   - **Test 2**: Memory Usage
   - **Test 3**: DOM Performance
   - **Test 4**: Full Application

### **Kết quả mong đợi**
- **Load time**: < 200ms
- **Memory usage**: < 20MB
- **DOM performance**: < 100ms
- **Full app**: < 300ms

## 🛠️ Troubleshooting

### **Lỗi tải file**
```
❌ Lỗi: "Không thể tải câu hỏi"
✅ Giải pháp:
- Kiểm tra file questions.json có tồn tại
- Đảm bảo format JSON đúng
- Kiểm tra CORS policy
```

### **Hiệu suất chậm**
```
❌ Lỗi: Ứng dụng chạy chậm
✅ Giải pháp:
- Đóng các tab không cần thiết
- Restart trình duyệt
- Kiểm tra RAM available
```

### **Giao diện lỗi**
```
❌ Lỗi: Giao diện hiển thị sai
✅ Giải pháp:
- Refresh trang
- Clear cache trình duyệt
- Kiểm tra console errors
```

## 📋 Yêu cầu Hệ thống

### **Tối thiểu**
- **RAM**: 2GB
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+
- **Internet**: Không cần (offline)

### **Khuyến nghị**
- **RAM**: 4GB+
- **Browser**: Chrome 90+, Firefox 85+, Safari 14+
- **CPU**: Dual-core 2GHz+

## 🎨 Tùy chỉnh

### **Thay đổi số câu hỏi mỗi trang**
```javascript
// Trong script-optimized.js
this.questionsPerPage = 50; // Thay đổi số này
```

### **Thay đổi màu sắc**
```css
/* Trong style.css */
.option-btn.correct {
    background: #4caf50; /* Màu xanh cho đúng */
}

.option-btn.wrong {
    background: #f44336; /* Màu đỏ cho sai */
}
```

### **Thay đổi animation**
```css
/* Trong style.css */
.option-btn {
    transition: all 0.2s ease; /* Thay đổi thời gian */
}
```

## 📈 Monitoring

### **Console Logs**
- Mở Developer Tools (F12)
- Xem tab Console để theo dõi logs
- Kiểm tra errors và warnings

### **Performance Tab**
- Mở Developer Tools (F12)
- Xem tab Performance
- Record và analyze hiệu suất

### **Memory Tab**
- Mở Developer Tools (F12)
- Xem tab Memory
- Monitor memory usage

## 🎯 Best Practices

### **Cho người dùng**
- Làm quiz trong môi trường yên tĩnh
- Đọc kỹ câu hỏi trước khi trả lời
- Sử dụng tính năng xem lại câu sai

### **Cho developer**
- Backup file questions.json
- Test trên nhiều trình duyệt
- Monitor performance thường xuyên

## 📞 Hỗ trợ

### **Liên hệ**
- **Email**: support@quizapp.com
- **Phone**: +84 123 456 789
- **Website**: https://quizapp.com

### **FAQ**
- **Q**: Tại sao ứng dụng chạy chậm?
- **A**: Kiểm tra RAM và đóng các tab không cần thiết

- **Q**: Làm sao thêm câu hỏi mới?
- **A**: Chỉnh sửa file questions.json theo format có sẵn

- **Q**: Có thể sử dụng offline không?
- **A**: Có, ứng dụng hoạt động hoàn toàn offline

---

**Chúc bạn có trải nghiệm quiz tuyệt vời! 🎉**
