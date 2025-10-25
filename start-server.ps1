# PowerShell Script để khởi động Local Server cho Quiz App
# Chạy script này trong thư mục qa-viewer

Write-Host "🚀 Khởi động Local Server cho Quiz Application..." -ForegroundColor Green
Write-Host ""

# Kiểm tra Python có được cài đặt không
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
}

if ($pythonCmd) {
    Write-Host "✅ Tìm thấy Python: $pythonCmd" -ForegroundColor Green
    
    # Kiểm tra port 8000 có được sử dụng không
    $port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
    if ($port8000) {
        Write-Host "⚠️  Port 8000 đã được sử dụng. Sử dụng port 8001..." -ForegroundColor Yellow
        $port = 8001
    } else {
        $port = 8000
    }
    
    Write-Host "🌐 Khởi động server trên port $port..." -ForegroundColor Cyan
    Write-Host "📱 Mở trình duyệt và truy cập: http://localhost:$port" -ForegroundColor Cyan
    Write-Host "🛑 Nhấn Ctrl+C để dừng server" -ForegroundColor Red
    Write-Host ""
    
    # Khởi động server
    try {
        & $pythonCmd -m http.server $port
    } catch {
        Write-Host "❌ Lỗi khởi động server: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Thử chạy: python -m http.server $port" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Không tìm thấy Python!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Cách khắc phục:" -ForegroundColor Yellow
    Write-Host "1. Tải và cài đặt Python từ: https://python.org" -ForegroundColor White
    Write-Host "2. Hoặc sử dụng Node.js: npm install -g http-server" -ForegroundColor White
    Write-Host "3. Hoặc sử dụng VS Code Live Server extension" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Hướng dẫn chi tiết:" -ForegroundColor Cyan
    Write-Host "Mở file server-start.html trong trình duyệt để xem hướng dẫn" -ForegroundColor White
}
