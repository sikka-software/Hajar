import nodemailer from 'nodemailer';

function setup(params) {
    const listTransport = {};
    if (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            const config = params[i];
            const nameTransporter = config.name ?? '';
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: config.user,
                    pass: config.pass
                }
            });
            listTransport[nameTransporter] = transporter;
            (listTransport[nameTransporter]).verify(function (error, success) {
                if (error != null) {
                    console.log(error);
                }
                else {
                    console.log(`Server ${nameTransporter} is ready to send mail`);
                }
            });
        }
    }
    return listTransport;
}
function send(transport, params) {
    transport.sendMail(params, function (error, info) {
        console.log(error);
        console.log(info);
    });
}

/**
 * My module description. Please update with your module data.
 *
 * @remarks
 * This module runs perfectly in node.js and browsers
 *
 * @packageDocumentation
 */
/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
const Hajar = {
    Mail: { setupEmail: setup, sendEmail: send }
};

export { Hajar as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2VtYWlsLnRzIiwiLi4vLi4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdCTSxTQUFVLEtBQUssQ0FBRSxNQUErQixFQUFBO0lBQ3BELE1BQU0sYUFBYSxHQUErQixFQUFFLENBQUE7QUFDcEQsSUFBQSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JCLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEMsWUFBQSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDeEIsWUFBQSxNQUFNLGVBQWUsR0FBVyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNqRCxZQUFBLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUM7Z0JBQzdDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07QUFDckIsZ0JBQUEsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO0FBQ2xCLGlCQUFBO0FBQ0YsYUFBQSxDQUFDLENBQUE7QUFDRixZQUFBLGFBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRyxXQUFXLENBQUM7WUFDN0MsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLE9BQU8sRUFBQTtnQkFDOUQsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbkIsaUJBQUE7QUFBTSxxQkFBQTtBQUNMLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxlQUFlLENBQUEsc0JBQUEsQ0FBd0IsQ0FBQyxDQUFBO0FBQy9ELGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7QUFDSCxTQUFBO0FBQ0YsS0FBQTtBQUNELElBQUEsT0FBTyxhQUFhLENBQUE7QUFDdEIsQ0FBQztBQUVlLFNBQUEsSUFBSSxDQUFFLFNBQWdFLEVBQUUsTUFBa0MsRUFBQTtJQUN4SCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQVUsRUFBRSxJQUFTLEVBQUE7QUFDeEQsUUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xCLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixLQUFDLENBQUMsQ0FBQTtBQUNKOztBQ2pEQTs7Ozs7OztBQU9HO0FBZUg7Ozs7OztBQU1FO0FBQ0YsTUFBTSxLQUFLLEdBQUc7SUFDWixJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7Ozs7OyJ9
