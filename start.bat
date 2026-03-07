@echo off
echo Starting ScholarDoc Hub...

echo Starting Backend...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo App is starting. Navigate to http://localhost:3000
