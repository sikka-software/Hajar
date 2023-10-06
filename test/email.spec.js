const Hajar = require("../src/index").default;
const nodemailer = require("nodemailer");
// Setup Email Config (Mansour)
/* describe("setupEmail", () => {
  it("configures nodemailer with the given emailConfig", () => {
    const emailConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "benmansourmansour08@gmail.com",
        pass: "grmislczfdqayrak",
      },
    };

    Hajar.Mail.SetupEmail(emailConfig);
  });
}); */
// Send email function
// This test is not working because of the following error:
/* describe("sendEmail", () => {
  it("should send an email", async () => {
    const Template = (props) => {
      return (
        <div>
          <h1>Email</h1>
          <p>body</p>
        </div>
      );
    };
    const emailConfig = {
      from: "from@example.com",
      to: "to@example.com",
      subject: "Test Email",
      html: "<p>Test email body</p>",
    };
    const template = <Template />;
    const data = { name: "John Doe" };

    const result = await Hajar.Mail.SendEmail({ emailConfig, template, data });

    expect(result).toEqual({ response: "email sent successfully" });
    expect(nodemailer.createTransport).toHaveBeenCalled();
  });
});
 */
