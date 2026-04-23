@echo off

:: =========================
:: 네트워크 연결 확인
:: =========================

ping -n 1 ohsahngah.github.io >nul 2>&1

if errorlevel 1 (
    powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('인터넷 연결을 확인해 주세요.`n네트워크에 연결되어 있지 않습니다.','CADS 실행 불가')"
    exit
)

:: =========================
:: Chrome 설치 확인
:: =========================

set "CHROME_PATH="

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

if defined CHROME_PATH (
    start "" "%CHROME_PATH%" ^
    --user-data-dir="C:\temp\chrome-app" ^
    --new-window ^
    --force-dark-mode ^
    --app="https://ohsahngah.github.io/cads/#dashboard" ^
    --window-size=1320,960 ^
    --window-position=300,60
) else (
    powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Google Chrome가 설치되어 있지 않습니다.`n먼저 Chrome를 설치해 주세요.','CADS 실행 불가')"
)
