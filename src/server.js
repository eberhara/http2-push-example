'use strict'

const fs = require('fs')
const http2 = require('http2')
const path = require('path')

const { HTTP2_HEADER_PATH } = http2.constants
const { getFiles } = require('./helper.js')

const key = fs.readFileSync(path.resolve(__dirname, '../ssl/key.pem'))
const cert = fs.readFileSync(path.resolve(__dirname, '../ssl/cert.pem'))


const publicFiles = getFiles(path.resolve(__dirname, '../public/'))

function push (stream, path) {
  const file = publicFiles.get(path)

  if (!file) {
    return
  }

  stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (pushStream) => {
    pushStream.respondWithFD(file.fileDescriptor, file.headers)
  })
}

const wait = (ms) => {
  const start = new Date().getTime()
  let end = start
  while (end < start + ms) {
    end = new Date().getTime()
  }
}

const handler = (req, res) => {
  wait(2000)
  const path = req.headers[HTTP2_HEADER_PATH]
  const reqPath = path === '/' ? '/index.html' : path
  const file = publicFiles.get(reqPath)

  if (!file) {
    res.statusCode = 404
    res.end()
    return
  }

  if (reqPath === '/index.html') {
    push(res.stream, '/bundle1.js')
    push(res.stream, '/bundle2.js')
    push(res.stream, '/bundle4.js')
  }

  res.stream.respondWithFD(file.fileDescriptor, file.headers)
}

const server = http2.createSecureServer({ cert, key }, handler)

server.listen(3003, () => {
  const { address, port } = server.address()
  console.log(`HTTP/2 with server-push server listening at ${address}:${port}`)
})
