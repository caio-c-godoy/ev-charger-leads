const express = require("express");
const path = require("path");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 👉 Serve arquivos da pasta public
  server.use(express.static(path.join(__dirname, "public")));

  // Next.js rotas
  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
