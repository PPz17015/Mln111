@echo off
echo 🚀 Khởi động Local Server cho Quiz Application...
echo.

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Tìm thấy Python
    goto :start_server
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Tìm thấy Python3
    set python_cmd=python3
    goto :start_server
)

echo ❌ Không tìm thấy Python!
echo.
echo 🔧 Cách khắc phục:
echo 1. Tải và cài đặt Python từ: https://python.org
echo 2. Hoặc sử dụng Node.js: npm install -g http-server
echo 3. Hoặc sử dụng VS Code Live Server extension
echo.
echo 📋 Hướng dẫn chi tiết:
echo Mở file server-start.html trong trình duyệt để xem hướng dẫn
pause
exit /b 1

:start_server
echo 🌐 Khởi động server trên port 8000...
echo 📱 Mở trình duyệt và truy cập: http://localhost:8000
echo 🛑 Nhấn Ctrl+C để dừng server
echo.

REM Khởi động server
python -m http.server 8000
if %errorlevel% neq 0 (
    python3 -m http.server 8000
)

pause
