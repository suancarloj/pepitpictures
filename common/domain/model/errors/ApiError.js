const InternalServerError = require('./InternalServerError');

class ApiError extends InternalServerError {
  constructor(message, error) {
    super(message || 'API error', error);

    this.name = 'ApiError';

    return this;
  }
}

module.exports = ApiError;
