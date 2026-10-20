@echo off
cd /d "%~dp0"
echo DIAGNOSTICS START > run-log.txt
echo Current dir: %CD% >> run-log.txt
echo Node version: >> run-log.txt
node -v >> run-log.txt 2>&1
echo NPM version: >> run-log.txt
npm -v >> run-log.txt 2>&1
echo Testing npx vite: >> run-log.txt
call npx vite --version >> run-log.txt 2>&1
echo Done >> run-log.txt
