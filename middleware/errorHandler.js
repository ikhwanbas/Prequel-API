const _ = require('lodash')
function routeErrorHandler(err, req, res, next) {
  const parsedError = _.toPlainObject(err)
  if (parsedError.code === 'ER_BAD_FIELD_ERROR')
    return res.status(400).send('Bad request, wrong key name')
  else if (parsedError.code === 'ER_DATA_TOO_LONG')
    return res.status(400).send('Bad request, data too long');
  else if (parsedError.code === 'ERR_NOT_FOUND')
    return res.status(401).send('Not found');
  else{
    if(err &&  !isNaN(err) ) {
      return res.status(err).send('Oops, something is wrong here')
    }
    console.error(err)
    return res.status(500).send("Oops, something is wrong here")
  }
    
}

module.exports = routeErrorHandler