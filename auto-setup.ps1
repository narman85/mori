# Auto-setup PocketBase on Fly.io
Write-Host "Setting up PocketBase database..." -ForegroundColor Green

# First create admin via direct HTTP request
$adminData = @{
    email = "admin@mori.az"
    password = "MoriTea2024!"
    passwordConfirm = "MoriTea2024!"
} | ConvertTo-Json

try {
    # Try to create first admin
    Invoke-RestMethod -Uri "https://mori-tea-backend.fly.dev/api/admins" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "Admin created!" -ForegroundColor Green
} catch {
    Write-Host "Admin setup needed or already exists" -ForegroundColor Yellow
}

Write-Host "`nPLEASE COMPLETE SETUP:" -ForegroundColor Cyan
Write-Host "1. Open: https://mori-tea-backend.fly.dev/_/" -ForegroundColor Yellow
Write-Host "2. Login with:" -ForegroundColor Yellow
Write-Host "   Email: admin@mori.az" -ForegroundColor White
Write-Host "   Password: MoriTea2024!" -ForegroundColor White
Write-Host "3. Import the schema file: pocketbase-schema.json" -ForegroundColor Yellow
Write-Host "`nThen your site will work!" -ForegroundColor Green