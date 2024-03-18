class HajarError extends Error {
  constructor(message, slug, customProperties) {
    super(message);
    this.slug = slug;
    if (customProperties) {
      Object.assign(this, customProperties);
    }
  }
}

module.exports = HajarError;
