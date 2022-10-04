import Hajar from '../src';

// Replace with actual tests
describe('Hajar.src.js', () => {

  it('should get the library\'s version', () => {
    expect(Hajar.version).toEqual('1.0.13');
  });

  it('should get the library\'s name', () => {
    const name = Hajar._name;
    expect(name).toEqual('Hajar');
  });
});