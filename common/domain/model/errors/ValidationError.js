class ValidationError extends Error {
  constructor(message, code, details) {
    super(message || 'Validation Error');

    this.name = 'ValidationError';
    this.code = code;
    this.details = details;

    return this;
  }
}

module.exports = ValidationError;
