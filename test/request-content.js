
/**
 * Test dependencies.
 */

const test = require('tape')
const content = require('..')
const Readable = require('stream').Readable


test('should parse url encoded stream', assert => {
  assert.plan(1)
  const req = urlencoded()
  content(req, data => {
    assert.deepEqual(data, {
      name: 'olivier',
      city: 'calgary'
    })
  })
})

test('should parse multipart form data stream', assert => {
  assert.plan(1)
  const req = multipart()
  content(req, data => {
    assert.deepEqual(data, {
      name: 'olivier',
      city: 'calgary'
    })
  })
})



function urlencoded () {
  const stream = new Readable
  stream.headers = {}
  stream.headers['content-type'] = 'application/x-www-form-urlencoded'
  stream._read = () => {}
  stream.push('name=olivier&city=calgary')
  setTimeout(() => stream.push(null), 300)
  return stream
}


function multipart () {
  const stream = new Readable
  stream.headers = {}
  stream.headers['content-type'] = 'application/x-www-form-urlencoded'
  stream._read = () => {}
  stream.push(`
----------------------------775505419069973009346433
Content-Disposition: form-data; name="name"

olivier
----------------------------775505419069973009346433
Content-Disposition: form-data; name="city"

calgary
----------------------------775505419069973009346433--
  `)
  setTimeout(() => stream.push(null), 300)
  return stream
}
