import hajar from "../www/src/@sikka/hajar/index";
describe("Hajar.src.js", () => {
  it("should get the library's version", () => {
    expect(hajar.version).toEqual("1.0.41");
  });
});
