#!/bin/bash

echo "🏉 Iniciando Ficha Digital de Rugby..."
echo ""
echo "Configuración inteligente del sistema de partidos"
echo ""

echo "Instalando dependencias del backend..."
npm install

echo ""
echo "Instalando dependencias del frontend..."
cd client
npm install
cd ..

echo ""
echo "Iniciando servidor backend en puerto 5000..."
gnome-terminal --title="Backend Server" -- bash -c "npm start; exec bash" &

echo ""
echo "Esperando 3 segundos para que el backend se inicie..."
sleep 3

echo ""
echo "Iniciando cliente React en puerto 3000..."
gnome-terminal --title="React Client" -- bash -c "cd client && npm start; exec bash" &

echo ""
echo "✅ Sistema iniciado correctamente!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Presiona Enter para continuar..."
read
