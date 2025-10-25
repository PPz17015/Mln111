# 🔧 Giải pháp Lỗi CORS - Quiz Application

## ❌ Vấn đề hiện tại

Bạn đang gặp lỗi CORS khi mở file HTML trực tiếp từ file system:
```
Access to fetch at 'file:///E:/FA25/Mln111/qa-viewer/questions.json' 
from origin 'null' has been blocked by CORS policy
```

## ✅ Giải pháp

### 🚀 Cách 1: Khởi động Local Server (Khuyến nghị)

#### **Sử dụng Python:**
```bash
# Mở Command Prompt trong thư mục qa-viewer
cd E:\FA25\Mln111\qa-viewer

# Khởi động server
python -m http.server 8000
```

#### **Sử dụng Batch File:**
```bash
# Double-click vào file start-server.bat
# Hoặc chạy trong Command Prompt
start-server.bat
```

#### **Sử dụng PowerShell:**
```powershell
# Chạy script PowerShell
.\start-server.ps1
```

### 🌐 Truy cập ứng dụng

Sau khi khởi động server, truy cập:
- **Quiz App**: http://localhost:8000/index.html
- **Performance Test**: http://localhost:8000/performance-test.html
- **Server Guide**: http://localhost:8000/server-start.html

## 🔧 Cách 2: Sử dụng VS Code Live Server

1. **Cài đặt extension**: "Live Server" trong VS Code
2. **Right-click** vào file `index.html`
3. **Chọn**: "Open with Live Server"
4. **Tự động mở** trình duyệt với server local

## 🔧 Cách 3: Sử dụng Node.js

```bash
# Cài đặt http-server globally
npm install -g http-server

# Khởi động server
http-server -p 8000
```

## 📊 Test Hiệu suất

Sau khi khởi động server thành công:

1. **Mở Performance Test**: http://localhost:8000/performance-test.html
2. **Chạy các test**:
   - Test 1: Load Questions JSON
   - Test 2: Memory Usage  
   - Test 3: DOM Performance
   - Test 4: Full Application

### **Kết quả mong đợi với 5000 câu hỏi:**
- **Load time**: < 200ms
- **Memory usage**: < 20MB
- **DOM performance**: < 100ms
- **Full app**: < 300ms

## 🎯 Sử dụng Quiz App

1. **Mở Quiz App**: http://localhost:8000/index.html
2. **Chờ loading** indicator biến mất
3. **Làm quiz**: Chọn đáp án và nhấn "Câu tiếp theo"
4. **Xem kết quả**: Thống kê chi tiết và câu sai

## 🛠️ Troubleshooting

### **Lỗi Port đã được sử dụng:**
```bash
# Sử dụng port khác
python -m http.server 8001
# Truy cập: http://localhost:8001
```

### **Python không được cài đặt:**
1. Tải Python từ: https://python.org
2. Cài đặt với option "Add to PATH"
3. Restart Command Prompt

### **Firewall chặn:**
1. Cho phép Python qua Windows Firewall
2. Hoặc tạm thời tắt firewall để test

### **File không tồn tại:**
- Đảm bảo file `questions.json` có trong thư mục `qa-viewer`
- Kiểm tra tên file chính xác (không có khoảng trắng thừa)

## 📁 Cấu trúc File

```
qa-viewer/
├── index.html              # Quiz App chính
├── performance-test.html   # Test hiệu suất
├── server-start.html       # Hướng dẫn server
├── start-server.bat        # Batch file khởi động
├── start-server.ps1        # PowerShell script
├── questions.json          # Dữ liệu câu hỏi (5000+ dòng)
├── script-optimized.js     # JavaScript tối ưu
├── style.css               # CSS styling
└── README.md               # Hướng dẫn tổng hợp
```

## 🎉 Kết luận

Sau khi khởi động server thành công:
- ✅ Không còn lỗi CORS
- ✅ Có thể test hiệu suất với 5000 câu hỏi
- ✅ Quiz app hoạt động mượt mà
- ✅ Tất cả tính năng tối ưu hoạt động

**Chúc bạn có trải nghiệm quiz tuyệt vời! 🚀**
