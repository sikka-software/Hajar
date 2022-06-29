describe('testing env variables', function () {
  it('should print PATH', function () {
    console.log(process.env.PATH)
    chai.expect(process.env.PATH).to.not.equal(undefined)
  })
})
