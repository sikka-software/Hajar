describe('Testing default export', function () {
  it('should be executed without issues', function () {
    /** for the test to work in CJS and ESM, you should invoke the named
     * default function instead of directly _pkg() */
    chai.expect(_pkg.default())
  })
})
