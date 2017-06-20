
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


function urlencoded () {
  const stream = new Readable
  stream._read = () => {}
  stream.push('name=olivier&city=calgary')
  setTimeout(() => stream.push(null), 300)
}


function multipart () {

}
