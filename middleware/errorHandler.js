const _ = require('lodash')


function routeErrorHandler(err, req, res, next) {
  const errorCodes = [_.toPlainObject(err).code, err, err.message]

  if (errorCodes.some((err) => err === 'ERR_INVALID_FORMAT'))
    return res.status(406).send('Error: not acceptable, wrong input format')

  if (errorCodes.some((err) => err === 'ERR_BAD_FIELD_ERROR'))
    return res.status(400).send('Error: bad request, wrong key name')

  if (errorCodes.some((err) => err === 'ERR_DATA_TOO_LONG'))
    return res.status(400).send('Error: bad request, data too long');

  if (errorCodes.some((err) => err === 'ERR_NOT_FOUND'))
    return res.status(401).send('Error: data not found');

  if (errorCodes.some((err) => err === 'ER_DUP_ENTRY'))
    return res.status(409).send('Error: duplicate entry');

  // else, if err is available and it's a number, send error status:
  if (100 <= err <= 599) {
    return res.status(err).send('Oops, something is wrong here')
  }

  else {
    console.error(err)
    res.locals.error = err
    const status = err.status || 500;
    res.status(status).send('Error');
  }

}

module.exports = routeErrorHandler