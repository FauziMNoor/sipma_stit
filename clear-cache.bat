@echo off
echo ========================================
echo CLEARING NEXT.JS CACHE
echo ========================================
echo.

echo [1/3] Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Deleting .next folder...
if exist .next (
    rmdir /s /q .next
    echo     - .next folder deleted!
) else (
    echo     - .next folder not found
)

echo.
echo [3/3] Deleting node_modules cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo     - node_modules\.cache deleted!
) else (
    echo     - node_modules\.cache not found
)

echo.
echo ========================================
echo CACHE CLEARED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open browser and hard refresh (Ctrl+Shift+R)
echo.
pause
