function errorHandler(err, req, res, next) {
  // console.log('err handler atas', err.message)

  let status, message, error = []

  if (err.name === 'ValidationError') {
    status = 400
    for (let key in err.errors) {
      error.push(err.errors[key].message)
    }
    
  } else if (err.name === 'CastError') {
    status = 404
    error.push('Data tidak ditemukan.')

  } else if (err.name === 'JsonWebTokenError') {
    status = 401
    error.push('Mohon sign in terlebih dahulu.')

  } else {
    if (err.status) status = err.status
    else status = 500
    error.push(err.message)
  }

  res.status(status).json({ error })
}

module.exports = errorHandler