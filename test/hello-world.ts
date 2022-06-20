describe('testing function helloWorld() with ts file in the test directory', function () {
  const inputs = ['Alice', 'Bob']
  for (const input of inputs) {
    describe(`helloWorld(${input})`, function () {
      it(`should return "Hello ${input}!"`, function () {
        const ret = _pkg.helloWorld(input)
        chai.expect(ret).to.equal(`Hello ${input}!`)
      })
      it('should print \'node\' in node and \'browser\' in a browser', function () {
        if (IS_BROWSER) {
          console.log('browser')
        } else {
          console.log('node')
        }
        chai.expect(true)
      })
    })
  }
})
