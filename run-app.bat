@echo off
title Atemzy Hitech Dev Server
cd /d "%~dp0"
echo ===================================================
echo   Starting Atemzy Hitech Corporate App Server...
echo ===================================================
echo.

if not exist "public\planet\scene.gltf" (
    echo Syncing 3D Earth planet assets from local projects...
    powershell -NoProfile -Command "Get-ChildItem -Path (Join-Path $env:USERPROFILE 'OneDrive\Desktop') -Filter 'scene.gltf' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 | ForEach-Object { $dir = $_.Directory.FullName; New-Item -ItemType Directory -Force -Path 'public\planet'; Copy-Item -Path (Join-Path $dir '*') -Destination 'public\planet' -Recurse -Force; Write-Host 'Successfully synced 3D planet model from' $dir }"
)

echo Current Directory: %CD%
echo Checking Node and NPM...
node -v
npm -v
echo.
echo Starting Vite on http://localhost:5173 ...
echo.

call npm run dev -- --host --open /contact
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo npm run dev exited with error code %ERRORLEVEL%.
    echo Trying fallback via npx vite...
    call npx vite --host --open /contact
)

echo.
echo Server stopped.
pause
