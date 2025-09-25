// const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('views'));

const helloNodeRoute = require('./routes/helloNode');
app.use(helloNodeRoute);

const serverTimeRoute = require('./routes/serverTime');
app.use(serverTimeRoute);

const getHealthRoute = require('./routes/health');
app.use(getHealthRoute);

const debug = require('./routes/debug');
app.use(debug);

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   const msg = 'Hello Node!\n'
//   res.end(msg);
// });

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

module.exports = {app, server};