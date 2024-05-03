import http from 'http';

http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message:"Hello world!"}));
        res.end()
    }
    else
        res.end("Invalid request!")

}).listen(3000)
console.log("Server running at port 3000");
