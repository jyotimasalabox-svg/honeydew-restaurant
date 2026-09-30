// Honeydew Restaurant, Ajmer - Local Node.js Server
// No external dependencies needed! Runs with standard Node.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = __dirname;
const DATA_FILE = path.join(__dirname, 'honeydew_data.json');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

// Seed initial data file if not present
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    settings: {
      restaurantName: "Honeydew Restaurant",
      tagline: "अजमेर का ऐतिहासिक स्वाद • 1970 से निरंतर सेवा",
      phone: "+91 94140 12345",
      whatsapp: "919414012345",
      address: "स्टेशन रोड, रामगंज, रेलवे स्टेशन के ठीक सामने, अजमेर, राजस्थान - 305001",
      bookingFee: 150,
      upiId: "honeydew.ajmer@okaxis",
      upiName: "Honeydew Restaurant Ajmer",
      adminUser: "admin",
      adminPass: "honeydew@123",
      timings: "सुबह 11:00 AM से रात 11:30 PM (सातों दिन)",
      bannerNotice: "रेलवे यात्रियों व दरगाह आने वाले श्रद्धालुओं के लिए स्पेशल प्री-ऑर्डर व फास्ट डिलीवरी सुविधा उपलब्ध है।"
    },
    bookings: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // API Endpoints for persistent backend storage
  if (pathname === '/api/data' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: "Data saved successfully" }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
    return;
  }

  // Serve static files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  } else if (safePath === '/admin' || safePath === '\\admin') {
    safePath = '/admin.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for single-page routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Honeydew Restaurant, Ajmer - Live Server Started!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Admin Login: admin / honeydew@123`);
  console.log(`=======================================================`);
});
