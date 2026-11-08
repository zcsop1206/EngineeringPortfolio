@echo off
rem Starts (or stops) the calls watcher hidden in the background, from any directory.
rem   watch.cmd        start it (stops a running one first)
rem   watch.cmd stop   stop it
setlocal
set "ROOT=%~dp0..\.."
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*tally.mjs*--watch*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
if /i "%~1"=="stop" (
  echo calls watcher stopped
  exit /b 0
)
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process node -ArgumentList 'content/calls/tally.mjs','--watch' -WorkingDirectory '%ROOT%' -WindowStyle Hidden"
echo calls watcher started
endlocal
