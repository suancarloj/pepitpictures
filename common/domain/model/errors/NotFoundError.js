class NotFoundError extends Error {
  constructor(message) {
    super(message || 'Not Found Error');

    this.name = 'NotFoundError';

    return this;
  }
}

module.exports = NotFoundError;

