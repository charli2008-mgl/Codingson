const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const WebSocket = require("ws");

const port = 3000;
const publicDir = path.resolve(__dirname);

const contentTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let safePath = decodeURIComponent(req.url.split("?")[0]);
  if (safePath === "/") safePath = "/index.html";
  const filePath = path.join(publicDir, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

const wss = new WebSocket.Server({ server });
const rooms = new Map();

function broadcastToRoom(roomId, message, sender) {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const client of room.clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on("connection", (ws) => {
  ws.roomId = null;

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch (err) {
      return;
    }

    if (data.type === "join" && typeof data.room === "string") {
      const roomId = data.room;
      ws.roomId = roomId;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          clients: new Set(),
          state: { html: "", css: "", js: "" },
        });
      }

      const room = rooms.get(roomId);
      room.clients.add(ws);

      if (room.state && (room.state.html || room.state.css || room.state.js)) {
        ws.send(
          JSON.stringify({
            type: "init",
            state: room.state,
          }),
        );
      }

      console.log(
        `Client joined room ${roomId} (${room.clients.size} clients)`,
      );
      return;
    }

    if (data.type === "update" && typeof data.room === "string") {
      const room = rooms.get(data.room);
      if (!room) return;
      if (typeof data.editor === "string" && typeof data.value === "string") {
        room.state[data.editor] = data.value;
        const payload = JSON.stringify({
          type: "remote-update",
          editor: data.editor,
          value: data.value,
        });
        broadcastToRoom(data.room, payload, ws);
      }
    }
  });

  ws.on("close", () => {
    if (ws.roomId) {
      const room = rooms.get(ws.roomId);
      if (room) {
        room.clients.delete(ws);
        if (room.clients.size === 0) {
          rooms.delete(ws.roomId);
        }
      }
    }
  });
});

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  return addresses;
}

server.listen(port, () => {
  console.log(
    `Static server and collaboration websocket running on http://localhost:${port}`,
  );
  const ips = getLocalIPs();
  if (ips.length) {
    console.log("Local network addresses:");
    ips.forEach((addr) => console.log(`  http://${addr}:${port}`));
  }
});
