const { version } = require("../package.json");

describe("Hajar.src.js", () => {
  it("should get the library's version", () => {
    expect([version + "-beta", version]).toContain(version);
  });
});
