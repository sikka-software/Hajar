const hajar = require("../www/src/@sikka/hajar/index");

const pkg = require("../package.json");
describe("Hajar.src.js", () => {
  it("should get the library's version", () => {
    expect(hajar.version).toEqual(pkg.version);
  });
});
