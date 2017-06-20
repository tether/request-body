/**
 * Dependencies.
 */

const parse = require('content-type').parse
const query = require('querystring').parse

/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function (req, cb) {
  const type = parse(req).type
  if (type === 'application/x-www-form-urlencoded') {
    let list = []
    req.on('data', (chunk) => list.push(chunk))
    req.on('end', () => {
      const buffer = Buffer.concat(list)
      cb(query(buffer.toString()))
    })
  }

  //multipart/form-data
}
