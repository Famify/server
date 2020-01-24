function errorHandler(err, req, res, next) {
  console.log(err.message)

  let status, message, error = []

  if (err.name === 'ValidationError') {
    status = 400
    for (let key in err.errors) {
      error.push(err.errors[key].message)
    }
  } else if (err.name === 'CastError') {
    status = 404
    error.push('data not found')
  } else if (err.message.name === 'JsonWebTokenError') {
    status = 400
    error.push('login first')
  } else {
    if (err.status) status = err.status
    else status = 500
    error.push(err)
  }

  res.status(status).json({ error })

}

module.exports = errorHandler