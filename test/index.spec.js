/* import { version as _version } from "../www/src/@sikka/hajar/index";
 */
import { version } from "../package.json";
describe("Hajar.src.js", () => {
  it("should get the library's version", () => {
    expect(["1.1.66-beta", "1.1.66"]).toContain(version);
  });
});
