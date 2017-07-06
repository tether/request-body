
/**
 * Test dependencies.
 */

const test = require('tape')
const content = require('..')
const Readable = require('stream').Readable
const server = require('server-test')


test('should parse url encoded stream', assert => {
  assert.plan(1)
  const urlencoded = {
    name: 'olivier',
    city: 'calgary'
  }

  server((req, res) => {
    content(req, data => assert.deepEqual(data, urlencoded))
  }, {
    method: 'POST',
    form: urlencoded
  })
})


test('should parse multipart form data stream', assert => {
  assert.plan(1)
  const formData = {
    name: 'olivier',
    city: 'calgary'
  }
  server((req, res) => {
    content(req, data => assert.deepEqual(data, formData))
  }, {
    method: 'POST',
    formData: formData
  })
})


test('should not do anything for method other than post or put', assert => {
  assert.plan(1)
  server((req, res) => {
    content(req, data => assert.ok(data == null))
  }, {
    form: {}
  })
})
