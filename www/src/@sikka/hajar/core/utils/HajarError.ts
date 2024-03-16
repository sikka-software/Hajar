interface CustomProperties {
  [key: string]: any;
}

class HajarError extends Error {
  slug: string;
  customProperties?: CustomProperties;

  constructor(
    message: string,
    slug: string,
    customProperties?: CustomProperties
  ) {
    super(message); // Pass the message parameter to the Error constructor
    this.slug = slug; // Assign the code parameter to a property on the error object
    if (customProperties) {
      Object.assign(this, customProperties);
    }
  }
}

export default HajarError;
