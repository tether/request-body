
/**
 * Test dependencies.
 */

const test = require('tape')
const content = require('..')
const Readable = require('stream').Readable
const server = require('server-test')
const request = require('supertest')
const http = require('http')

test('should parse url encoded stream', assert => {
  assert.plan(1)
  const urlencoded = {
    name: 'olivier',
    city: 'calgary'
  }

  const server = http.createServer((req, res) => {
    content(req).then(data => {
      assert.deepEqual(data, urlencoded)
    })
  })

  request(server.listen())
    .post('/')
    .type('form')
    .send(urlencoded)
    .end(() => {
      console.log('done')
    })
})

//
// test('should parse multipart form data stream', assert => {
//   assert.plan(1)
//   const formData = {
//     name: 'olivier',
//     city: 'calgary'
//   }
//   server((req, res) => {
//     content(req).then(data => assert.deepEqual(data, formData))
//   }, {
//     method: 'POST',
//     formData: formData
//   })
// })
//
//
// test('should not do anything for method other than post or put', assert => {
//   assert.plan(1)
//   server((req, res) => {
//     content(req).then(data => assert.deepEqual(data, {}))
//   }, {
//     form: {}
//   })
// })
//
//
// test('should not do anything if Content-type does not exist', assert => {
//   assert.plan(1)
//   server((req, res) => {
//     res.removeHeader('Content-type')
//     content(req).then(data => assert.deepEqual(data, {}))
//   }, {
//     form: {}
//   })
// })
