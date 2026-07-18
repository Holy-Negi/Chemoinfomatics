@echo off

set BACKEND_DIR=.\eln_db
set FRONTEND_DIR=.\eln_frontend

echo Starting the backend system...
start "Backend - uvicorn" cmd /k "cd /d %BACKEND_DIR% && uv run uvicorn main:app --reload"

echo Starting the frontend system...
start "Frontend - npm" cmd /k "cd /d %FRONTEND_DIR% && npm run dev"

exit