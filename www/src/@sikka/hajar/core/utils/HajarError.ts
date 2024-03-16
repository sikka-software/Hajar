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
    super(message);
    this.slug = slug;
    if (customProperties) {
      Object.assign(this, customProperties);
    }
  }
}

export default HajarError;
