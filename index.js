/**
 * Dependencies.
 */

const typeis = require('type-is')
const FormData = require('BusBoy')
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
    const form = new FormData({
      headers: req.headers
    })
    form.on('file', (name, file, filename) => {
      console.log(name, value)
      result[name] = file
    })
    form.on('field', (name, value) => {
      result[name] = value
    })
    form.on('finish', () => resolve(result))
    form.pipe(req)
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
