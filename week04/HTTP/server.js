const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.method, "---request.method");
  console.log(request.url, "---request.url");

  let body = [];
  request
    .on("error", (error) => {
      console.error(error, "---error");
    })
    .on("data", (chunk) => {
      console.log(chunk, "---chunk");
      body.push(chunk);
      console.log(body, "111---body");
    })
    .on("end", () => {
      // body = Buffer.concat(body).toString();
      console.log(body, "---body");

      response.writeHead(200, { "Content-Type": "text/html" });

      response.end("Hello World!");
    });
});

server.listen(18888);

console.log("Server is running at http://localhost:18888");
