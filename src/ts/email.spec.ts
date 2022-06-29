describe('testing function setupEmail() sendEmail() with .spec.ts file', function () {
    const input = {
        HAJAR_MAIL_PARAMETERS: [
            {
                name: "myBillingName",
                host: "box.qawaim.app",
                port: 587,
                secure: false,
                user: "billing@qawaim.app",
                pass: "3=3ZzEZtum"
            }]
    };
    describe(`setupEmail(${input}) sendEmail()`, function () {
        it(`should return "setupEmail sendEmail ${input}!"`, function () {
            const ret = _pkg.Mail.setupEmail(input)
            const data = {
                from: "zied@sikka.io",
                to: "zied@sikka.io",
                subject: "test",
                text: "test"
            }
            const ret2 = _pkg.Mail.sendEmail(ret['myBillingName'], data)
            chai.expect(ret).to.equal(`setupEmail ${input}!`)
            chai.expect(ret2).to.equal(`sendEmail ${ret['myBillingName']}!`)
           
        })
    })
})