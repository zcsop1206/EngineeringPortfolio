@echo off
rem Builds every LaTeX doc under content\teach\<name>\<name>.tex into <name>.pdf with TinyTeX's xelatex,
rem two passes, from any directory, and every per-topic wrapper in <name>\split\*.tex into <name>\split\*.pdf.
rem Pass a name to build one doc: build.cmd putnam
setlocal
set "XELATEX=%APPDATA%\TinyTeX\bin\windows\xelatex.exe"
if not exist "%XELATEX%" (
  echo xelatex not found at %XELATEX%
  exit /b 1
)
set "HERE=%~dp0"
set "FAIL=0"
rem Reproducible output: the PDFs carry a fixed date instead of the build time, so git sees a change only when the content changes.
set "SOURCE_DATE_EPOCH=1762473600"
set "SOURCE_DATE_EPOCH_TEX_PRIMITIVES=1"
for /d %%D in ("%HERE%*") do (
  if exist "%%D\%%~nxD.tex" (
    if "%~1"=="" ( call :doc "%%D" "%%~nxD" ) else ( if /i "%~1"=="%%~nxD" call :doc "%%D" "%%~nxD" )
  )
)
if "%FAIL%"=="1" exit /b 1
exit /b 0

:doc
pushd "%~1"
call :tex "%~2.tex" "." "%~2"
if exist "split" (
  for %%W in (split\*.tex) do call :tex "%%W" "split" "%%~nW"
)
popd
goto :eof

:tex
rem %1 tex path relative to the doc folder, %2 output directory, %3 job name.
rem TeX reads a backslash in the path as a control sequence, so the path is passed with forward slashes.
set "TEXPATH=%~1"
set "TEXPATH=%TEXPATH:\=/%"
"%XELATEX%" -interaction=nonstopmode -halt-on-error -output-directory=%~2 "%TEXPATH%" >nul
if errorlevel 1 ( echo %~3: first pass failed, see %~2\%~3.log & set "FAIL=1" & goto :eof )
"%XELATEX%" -interaction=nonstopmode -halt-on-error -output-directory=%~2 "%TEXPATH%" >nul
if errorlevel 1 ( echo %~3: second pass failed, see %~2\%~3.log & set "FAIL=1" & goto :eof )
del /q "%~2\%~3.aux" "%~2\%~3.out" "%~2\%~3.toc" "%~2\%~3.log" 2>nul
echo %~3.pdf built
goto :eof
