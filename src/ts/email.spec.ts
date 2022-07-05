import Hajar, { HAJAR_LIST_TRANSPORT_ARRAY } from './index'

describe('testing function setupEmail() sendEmail() with .spec.ts file', function () {
  it('setupEmail sendEmail!"', async function () {
    const input = [
      {
        name: 'myBillingName',
        host: 'box.qawaim.app',
        port: 587,
        secure: false,
        user: 'billing@qawaim.app',
        pass: '3=3ZzEZtum'
      }]
    this.timeout(0)
    const ret: HAJAR_LIST_TRANSPORT_ARRAY = Hajar.Mail.SetupEmail(input)
    chai.expect(Object.keys(ret)).to.have.lengthOf.above(0)
    const data = {
      from: 'billing@qawaim.app',
      to: 'zied@sikka.io',
      subject: 'test',
      text: 'test'
    }
    const isSend: boolean = await Hajar.Mail.SendEmail(ret.myBillingName, data)
    chai.expect(isSend).to.be.true
  })
})
