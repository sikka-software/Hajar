class CustomError extends Error {
  constructor(message, slug, customProperties) {
    super(message); // Pass the message parameter to the Error constructor
    this.slug = slug; // Assign the code parameter to a property on the error object
    Object.assign(this, customProperties); // Assign any additional properties to the error object
  }
}

export default CustomError;
