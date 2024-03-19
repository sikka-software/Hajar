/* import { version as _version } from "../www/src/@sikka/hajar/index";
 */
import { version } from "../package.json";
describe("Hajar.src.js", () => {
  it("should get the library's version", () => {
    expect(version).toEqual("1.1.63-beta");
  });
});
