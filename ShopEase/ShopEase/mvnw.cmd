@REM Maven Wrapper for ShopEase
@echo off
setlocal

set "MAVEN_VERSION=3.9.6"
set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\apache-maven-%MAVEN_VERSION%"
set "MAVEN_BIN=%MAVEN_HOME%\bin\mvn.cmd"
set "MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_ZIP=%USERPROFILE%\.m2\wrapper\apache-maven-%MAVEN_VERSION%-bin.zip"

if exist "%MAVEN_BIN%" goto execute

echo Maven %MAVEN_VERSION% not found. Downloading...
if not exist "%USERPROFILE%\.m2\wrapper" mkdir "%USERPROFILE%\.m2\wrapper"

echo Downloading from %MAVEN_URL%
powershell -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'"
if ERRORLEVEL 1 (
    echo Failed to download Maven
    exit /B 1
)

echo Extracting Maven...
powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%USERPROFILE%\.m2\wrapper' -Force"
if ERRORLEVEL 1 (
    echo Failed to extract Maven
    exit /B 1
)

del "%MAVEN_ZIP%" 2>nul
echo Maven %MAVEN_VERSION% installed successfully.

:execute
call "%MAVEN_BIN%" %*

endlocal
exit /B %ERRORLEVEL%
