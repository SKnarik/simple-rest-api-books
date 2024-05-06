import http from "http";
import fs from "fs";

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(fs.readFileSync("./books.json", "utf-8"));
      res.end();
    } else res.end("Invalid request!");
  })
  .listen(3000);
console.log("Server running at port 3000");
