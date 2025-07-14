// async function Log(stack, level, packageName, message) {
//     const logData = {
//         stack,
//         level,
//         package: packageName,
//         message
//     };

//     try {
//         const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtZXR0YXNhbmRlZXAxMjM0NUBnbWFpbC5jb20iLCJleHAiOjE3NTI0NzI2MDYsImlhdCI6MTc1MjQ3MTcwNiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIyMDI2MjI5LWMzODQtNGNjZS1iMWUyLThmM2MwNWIzNzRjNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1ldHRhIHNhbmRlZXAiLCJzdWIiOiI5NzQ2ZDllNC1mYTA5LTQ0NmYtYTJhMy02MDg4ZjQ0YTE4N2UifSwiZW1haWwiOiJtZXR0YXNhbmRlZXAxMjM0NUBnbWFpbC5jb20iLCJuYW1lIjoibWV0dGEgc2FuZGVlcCIsInJvbGxObyI6IjEyMjEzNDIyIiwiYWNjZXNzQ29kZSI6IkNaeXBRSyIsImNsaWVudElEIjoiOTc0NmQ5ZTQtZmEwOS00NDZmLWEyYTMtNjA4OGY0NGExODdlIiwiY2xpZW50U2VjcmV0IjoiUGVhQ0tYa3p1a3ZHUEJBbiJ9.oAQfWFgZdsdrS5sjRV9NWUpZ1jiZDoDB1wiYT4uS5uc" 
//             },
//             body: JSON.stringify(logData)
//         });

//         const result = await response.json();
//         console.log("✅ Log sent:", result);
//     } catch (error) {
//         console.error("❌ Log failed:", error.message);
//     }
// }
// AFFORDMED/logmiddleware/logger.js

// const fs = require("fs");
// const path = require("path");

// // ✅ log.txt in same directory
// const logFile = path.join(__dirname, "log.txt");

// module.exports = function logger(req, res, next) {
//   const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
//   fs.appendFileSync(logFile, log);
//   next();
// };

const fs = require("fs");
const path = require("path");
// const fetch = require("node-fetch"); // Already works in Node.js

const LOG_FILE = path.join(__dirname, "log.txt");
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtZXR0YXNhbmRlZXAxMjM0NUBnbWFpbC5jb20iLCJleHAiOjE3NTI0NzI2MDYsImlhdCI6MTc1MjQ3MTcwNiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIyMDI2MjI5LWMzODQtNGNjZS1iMWUyLThmM2MwNWIzNzRjNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1ldHRhIHNhbmRlZXAiLCJzdWIiOiI5NzQ2ZDllNC1mYTA5LTQ0NmYtYTJhMy02MDg4ZjQ0YTE4N2UifSwiZW1haWwiOiJtZXR0YXNhbmRlZXAxMjM0NUBnbWFpbC5jb20iLCJuYW1lIjoibWV0dGEgc2FuZGVlcCIsInJvbGxObyI6IjEyMjEzNDIyIiwiYWNjZXNzQ29kZSI6IkNaeXBRSyIsImNsaWVudElEIjoiOTc0NmQ5ZTQtZmEwOS00NDZmLWEyYTMtNjA4OGY0NGExODdlIiwiY2xpZW50U2VjcmV0IjoiUGVhQ0tYa3p1a3ZHUEJBbiJ9.oAQfWFgZdsdrS5sjRV9NWUpZ1jiZDoDB1wiYT4uS5uc"; 

function logToFile(message) {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, entry);
}

async function Log(stack, level, packageName, message) {
    const fetch = (await import('node-fetch')).default;
    const logData = {
        stack,
        level,
        package: packageName,
        message
    };

    try {
        const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": TOKEN
            },
            body: JSON.stringify(logData)
        });

        const result = await response.json();
        console.log("✅ Backend log sent:", result);
    } catch (error) {
        logToFile(`${stack.toUpperCase()} | ${level.toUpperCase()} | ${packageName}: ${message}`);
        console.error("❌ Remote log failed. Logged to file.");
    }
}

module.exports = Log;

