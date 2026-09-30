@echo off
title Honeydew Restaurant Ajmer - Website Server
echo =======================================================
echo   Honeydew Restaurant, Ajmer - Website Server Starting
echo   Address: Station Road, Ramganj, Opp. Railway Station
echo =======================================================
echo.
echo Website URL: http://localhost:4000
echo Admin Portal: admin / honeydew@123
echo.
start http://localhost:4000
node server.js
pause
