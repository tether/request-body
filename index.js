/**
 * Dependencies.
 */

const typeis = require('type-is')
const Form = require('multiparty').Form
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
  const form = new Form()
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        const obj = map(fields)
        obj.files = files
        resolve(obj)
      }
    })
  })
}


/**
 * Create object from a form data fields.
 *
 * @param {Object}fields
 * @return {Object}
 * @api private
 */

function map (fields) {
  const obj = {}
  if (fields) Object.keys(fields).map(key => {
    const value = fields[key]
    obj[key] = value.length > 1
      ? value
      : value[0]
  })
  return obj
}
