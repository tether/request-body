/**
 * Dependencies.
 */

const parse = require('content-type').parse
const query = require('querystring').parse
const Form = require('multiparty').Form


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
  } else if (type === 'multipart/form-data') {
    (new Form()).parse(req, function(err, fields, files) {
      const obj = {}
      Object.keys(fields).map(key => obj[key] = fields[key][0])
      cb(obj)
    })
  }
}
