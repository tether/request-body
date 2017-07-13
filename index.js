/**
 * Dependencies.
 */

const parse = require('content-type').parse
const query = require('querystring').parse
const Form = require('multiparty').Form


/**
 * Allowed method for request Content-type
 * @type {Array}
 */

const allowed = ['POST', 'PUT']


/**
 * Decode HTTP request data.
 *
 * @param {IncomingHttpResponse} req
 * @param {Function} cb
 * @api public
 */

module.exports = function (req, cb) {
  if (!~allowed.indexOf(req.method)) return cb()
  try {
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
        if (fields) Object.keys(fields).map(key => obj[key] = fields[key][0])
        cb(obj)
      })
    }
  } catch (e) {
    cb({})
  }
}
