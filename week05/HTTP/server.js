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

      // response.end("Hello World!");
      //   response.end(`
      //   <html lang="en">

      //   <head>
      //     <meta charset="UTF-8" />
      //     <meta name="viewport"
      //           content="width=device-width, initial-scale=1.0" />
      //     <title>Document</title>
      //     <style>
      //       body div {
      //         color: red;
      //         font-size: 20px;
      //       }

      //       body #parser {
      //         color: pink;
      //       }
      //     </style>
      //   </head>

      //   <body>
      //     <div>Hello World!</div>
      //     <div id='parser'>HTML Parser!</div>
      //     <br/>
      //   </body>

      //   </html>
      //   `);
      // });
      response.end(`
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          #container {
            width: 500px;
            height: 300px;
            display: flex;
            background-color: rgb(255, 255, 255);
          }

          #container #myid {
            width: 200px;
            height: 100px;
            background-color: rgb(255, 0, 0);
          }

          #container .c1 {
            flex: 1;
            background-color: rgb(0, 255, 0);
          }
        </style>
      </head>

      <body>
        <div id="container">
          <div id="myid" />
          <div class="c1" />
        </div>
      </body>

      </html>
      `);
    });
});

server.listen(18888);

console.log("Server is running at http://localhost:18888");
