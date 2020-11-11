const _ = require('lodash')


function routeErrorHandler(err, req, res, next) {
  const errorCodes = [_.toPlainObject(err).code, err, err.message] 

  if (errorCodes.some((err) => err  === 'ERR_INVALID_FORMAT'))
    return res.status(406).send('Not acceptable, wrong input format')

  if (errorCodes.some((err) => err  === 'ERR_BAD_FIELD_ERROR'))
    return res.status(400).send('Bad request, wrong key name')

  else if (errorCodes.some((err) => err  === 'ERR_DATA_TOO_LONG'))
    return res.status(400).send('Bad request, data too long');

  else if (errorCodes.some((err) => err  === 'ERR_NOT_FOUND'))
    return res.status(401).send('Error, data not found');

   
    // else, if err is available and it's a number, send error status
  else if (100 <= err <= 599) ) {
      return res.status(err).send('Oops, something is wrong here')
    }
  else {
        console.error(err)
    return res.status(500).send("Oops, something is wrong here")
  }
    
}

module.exports = routeErrorHandler