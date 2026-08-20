@echo off
echo ==========================================
echo Initialize Git and Pushing to GitHub...
echo ==========================================

:: Initialize git repository
.\mingit\cmd\git.exe init

:: Add remote origin (ignores error if already exists)
.\mingit\cmd\git.exe remote add origin https://github.com/ilhamrf540-ship-it/WM.git 2>nul
.\mingit\cmd\git.exe remote set-url origin https://github.com/ilhamrf540-ship-it/WM.git

:: Add all files in workspace
.\mingit\cmd\git.exe add .

:: Commit files
.\mingit\cmd\git.exe commit -m "Configure HiveMQ broker and display phone numbers in user profiles"

:: Rename branch to main
.\mingit\cmd\git.exe branch -M main

:: Push files to github repository
echo.
echo Pushing code to GitHub...
.\mingit\cmd\git.exe push -u origin main --force

echo.
echo ==========================================
echo Push Process Finished!
echo ==========================================
pause
