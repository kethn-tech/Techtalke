@echo off
setlocal

:: Windows Deployment Script for TechTalke
:: This script handles the deployment process on Windows

set "PROJECT_NAME=techtalke"
set "PROJECT_DIR=%~dp0.."
set "LOG_FILE=%PROJECT_DIR%\deploy.log"

:: Function to print status
:print_status
echo [%time%] INFO: %~1 >> "%LOG_FILE%"
echo [INFO] %~1
goto :eof

:print_error
echo [%time%] ERROR: %~1 >> "%LOG_FILE%"
echo [ERROR] %~1
goto :eof

:: Function to check if Docker is running
:check_docker
docker version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Docker is not running or not installed"
    exit /b 1
)
goto :eof

:: Function to health check
:health_check
call :print_status "Performing health check..."
for /L %%i in (1,1,10) do (
    curl -f --max-time 10 http://localhost:4000/health >nul 2>&1
    if !errorlevel! equ 0 (
        call :print_status "Health check passed on attempt %%i"
        goto :eof
    )
    call :print_status "Health check failed, attempt %%i/10"
    timeout /t 5 >nul
)
call :print_error "Health check failed after 10 attempts"
exit /b 1

:: Function to deploy
:deploy
call :print_status "Starting deployment process..."

:: Check if Docker is running
call :check_docker
if %errorlevel% neq 0 exit /b 1

:: Check if docker-compose file exists
if not exist "%PROJECT_DIR%\docker-compose.yml" (
    call :print_error "docker-compose.yml not found"
    exit /b 1
)

:: Pull latest images
call :print_status "Pulling latest Docker images..."
docker-compose pull
if %errorlevel% neq 0 (
    call :print_error "Failed to pull Docker images"
    exit /b 1
)

:: Stop services
call :print_status "Stopping services..."
docker-compose down
if %errorlevel% neq 0 (
    call :print_error "Failed to stop services"
    exit /b 1
)

:: Start services
call :print_status "Starting services..."
docker-compose up -d
if %errorlevel% neq 0 (
    call :print_error "Failed to start services"
    exit /b 1
)

:: Wait for services to start
call :print_status "Waiting for services to start..."
timeout /t 30 >nul

:: Health check
call :health_check
if %errorlevel% neq 0 exit /b 1

:: Clean up
call :print_status "Cleaning up old Docker images..."
docker image prune -f

call :print_status "Deployment completed successfully!"
goto :eof

:: Function to show usage
:usage
echo Usage: %~nx0 [OPTIONS]
echo Options:
echo   deploy    Start deployment process
echo   health    Perform health check only
echo   help      Show this help message
goto :eof

:: Main script logic
if "%~1"=="deploy" (
    call :deploy
) else if "%~1"=="health" (
    call :health_check
) else if "%~1"=="help" (
    call :usage
) else (
    call :print_error "Invalid option. Use 'help' for usage information."
    call :usage
    exit /b 1
)