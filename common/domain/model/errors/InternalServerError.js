class InternalServerError extends Error {
  constructor(message, error) {
    super(message || 'Internal Server Error');

    this.name = 'InternalServerError';
    this.original = error;

    return this;
  }
}

module.exports = InternalServerError;
