@echo off
cd /d "%~dp0"  
cd ../
set /p inputStr="Please enter the version number, there is no 'v' before it, in the format of 3.11.2  :"
npm version %inputStr% 