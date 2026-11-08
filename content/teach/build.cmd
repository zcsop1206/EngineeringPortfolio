@echo off
rem Builds every LaTeX doc under content\teach\<name>\<name>.tex into <name>.pdf with TinyTeX's xelatex,
rem two passes, from any directory. Pass a name to build one doc: build.cmd putnam
setlocal
set "XELATEX=%APPDATA%\TinyTeX\bin\windows\xelatex.exe"
if not exist "%XELATEX%" (
  echo xelatex not found at %XELATEX%
  exit /b 1
)
set "HERE=%~dp0"
set "FAIL=0"
for /d %%D in ("%HERE%*") do (
  if exist "%%D\%%~nxD.tex" (
    if "%~1"=="" ( call :build "%%D" "%%~nxD" ) else ( if /i "%~1"=="%%~nxD" call :build "%%D" "%%~nxD" )
  )
)
if "%FAIL%"=="1" exit /b 1
exit /b 0

:build
pushd "%~1"
"%XELATEX%" -interaction=nonstopmode -halt-on-error "%~2.tex" >nul
if errorlevel 1 ( echo %~2: first pass failed, see %~1\%~2.log & set "FAIL=1" & popd & goto :eof )
"%XELATEX%" -interaction=nonstopmode -halt-on-error "%~2.tex" >nul
if errorlevel 1 ( echo %~2: second pass failed, see %~1\%~2.log & set "FAIL=1" & popd & goto :eof )
del /q "%~2.aux" "%~2.out" "%~2.toc" "%~2.log" 2>nul
echo %~2.pdf built
popd
goto :eof
