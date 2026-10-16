// Local-only failure injection for real browser checks. Never part of dist.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const qaPort = Number(process.env.GOEASE_QA_PORT || 4175);
const connections = new Set();
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname.startsWith("/assets/hoi-an-")) {
    res.writeHead(404).end("Image failure injected");
    return;
  }
  if (
    url.pathname.startsWith("/assets/ha-long-") &&
    req.headers.referer?.includes("initial-fail")
  ) {
    res.writeHead(404).end("Initial image failure injected");
    return;
  }
  try {
    const file = resolve(root, "." + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    let bytes = await readFile(
      file === root ? resolve(root, "index.html") : file,
    );
    const types = {
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".webp": "image/webp",
      ".png": "image/png",
    };
    res
      .writeHead(200, {
        "Content-Type":
          file === root
            ? "text/html; charset=utf-8"
            : types[extname(file)] || "application/octet-stream",
      })
      .end(bytes);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
server.on("connection", (socket) => {
  connections.add(socket);
  socket.on("close", () => connections.delete(socket));
});
process.on("SIGINT", () => {
  connections.forEach((socket) => socket.destroy());
  server.close(() => process.exit(0));
});
server.listen(qaPort, "127.0.0.1", () =>
  console.log(`Failure QA only: http://127.0.0.1:${qaPort}`),
);
