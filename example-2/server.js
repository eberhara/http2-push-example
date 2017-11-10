// HTTP2 server (HTTP1.1 compatible)

const { createSecureServer } = require('http2');
const { readFileSync } = require('fs');

const cert = readFileSync('./localhost-cert.pem');
const key = readFileSync('./localhost-privkey.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest
).listen(8444);

function onRequest(req, res) {
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0'
    ? req.stream.session
    : req;

  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion
  }));
}
