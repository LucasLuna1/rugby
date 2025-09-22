@echo off
echo 🏉 Iniciando Ficha Digital de Rugby...
echo.
echo Configuracion inteligente del sistema de partidos
echo.

echo Instalando dependencias del backend...
call npm install

echo.
echo Instalando dependencias del frontend...
cd client
call npm install
cd ..

echo.
echo Iniciando servidor backend en puerto 5000...
start "Backend Server" cmd /k "npm start"

echo.
echo Esperando 3 segundos para que el backend se inicie...
timeout /t 3 /nobreak >nul

echo.
echo Iniciando cliente React en puerto 3000...
start "React Client" cmd /k "cd client && npm start"

echo.
echo ✅ Sistema iniciado correctamente!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
