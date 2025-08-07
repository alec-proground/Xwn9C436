global.require = require;
console.log("Hello");
setInterval(() => {}, 1000); // just keep running

// const http = require('http');

// const host = '0.0.0.0';
// const port = 3000;

// const requestListener = function (req, res) {
//     res.writeHead(200);
//     res.end("Server is running!");
// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });