/**
 * Dependencies.
 */

const typeis = require('type-is')
const stream = require('stream')
const Busboy = require('busboy')
const mimes = {
  'urlencoded': require('request-form'),
  'json': require('request-application'),
  'text': require('request-text'),
  'multipart': multipart
}

/**
 * Decode request body accorsing its content type and return
 * a promise with result.
 *
 *
 * @param {Request} req
 * @param {Object} options
 * @return {Promise}
 * @api public
 */
module.exports = function (req, options = {}) {
  const hasBody = typeis.hasBody(req) && req.headers['content-type']
  const type = typeis(req, ['urlencoded', 'json', 'text', 'multipart'])
  return new Promise((resolve, reject) => {
    if (!hasBody) {
      resolve({})
    } else {
      const body = mimes[type]
      if (body) resolve(body(req, options))
      else throw new Error('Content-type not supported')
    }
  })
}


/**
 * Parse multipart/form-data requests.
 *
 * @param {HttpIncomingMessage} req
 * @param {Object} options
 * @return {Promise}
 * @api private
 */

function multipart (req, options) {
  const result = {}
  return new Promise((resolve, reject) => {
    var form = new Busboy({ headers: req.headers })
    form.on('file', function(fieldname, file, filename, encoding, mimetype) {
      const value = result[fieldname]
      const duplex = new stream.Readable()
      duplex.filename = filename
      duplex.encoding = encoding
      duplex.mimetype = mimetype
      duplex._read = () => {}
      result[fieldname] =  value
        ? [].concat(value, duplex)
        : duplex
      file.on('data', data => duplex.push(data))
      file.on('end', () => duplex.push(null))
    });
    form.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      const value = result[fieldname]
      result[fieldname] = value
        ? [].concat(value, val)
        : val
    });
    form.on('finish', () => resolve(result))
    req.pipe(form)
  })
}


/**
 * Return value of array of values.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Any} value
 * @return {Any|Array}
 * @api private
 */


function add (obj, name, value) {
  const previous = obj[name]
  if (previous) {
    const arr = [].concat(previous)
    arr.push(value)
    return arr
  } else return value
}
