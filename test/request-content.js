
/**
 * Test dependencies.
 */

const test = require('tape')
const content = require('..')
const Readable = require('stream').Readable
const http = require('http')
const request = require('request')
const net = require('net')


test('should parse url encoded stream', assert => {
  assert.plan(1)
  const urlencoded = {
    name: 'olivier',
    city: 'calgary'
  }
  server({
    form: urlencoded
  }, (data) => {
    assert.deepEqual(data, urlencoded)
  })
})


test('should parse multipart form data stream', assert => {
  assert.plan(1)
  const formData = {
    name: 'olivier',
    city: 'calgary'
  }
  server({
    formData: formData
  }, (data) => {
    assert.deepEqual(data, formData)
  })
})


function server (data, cb) {
  const server = http.createServer((req, res) => {
    content(req, cb)
    res.end()
  }).listen(() => {
    const port = server.address().port
    const sock = net.connect(port)
    request.post(`http://localhost:${port}`, data, () => {
      sock.end();
      server.close();
    })
  })
}
