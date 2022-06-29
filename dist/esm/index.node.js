import nodemailer from 'nodemailer';

function setup(params) {
    const listTransport = {};
    if (params.HAJAR_MAIL_PARAMETERS.length > 0) {
        for (let i = 0; i < params.HAJAR_MAIL_PARAMETERS.length; i++) {
            const config = params.HAJAR_MAIL_PARAMETERS[i];
            const nameTransporter = config.name ?? '';
            const transporter = nodemailer.createTransport(config);
            listTransport[nameTransporter] = transporter;
            listTransport[nameTransporter].verify(function (error, success) {
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
function send(transport, message) {
    if (transport.transporter.name.length !== 0) {
        transport.sendMail(message, (error, info) => {
            console.log(error);
            console.log(info);
        });
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2VtYWlsLnRzIiwiLi4vLi4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9NLFNBQVUsS0FBSyxDQUFFLE1BQTJCLEVBQUE7SUFDaEQsTUFBTSxhQUFhLEdBQVEsRUFBRSxDQUFBO0FBRTdCLElBQUEsSUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMzQyxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxZQUFBLE1BQU0sZUFBZSxHQUFXLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO1lBQ2pELE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdEQsWUFBQSxhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBQzVDLGFBQWEsQ0FBQyxlQUFlLENBQTJELENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLE9BQU8sRUFBQTtnQkFDdkgsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbkIsaUJBQUE7QUFBTSxxQkFBQTtBQUNMLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxlQUFlLENBQUEsc0JBQUEsQ0FBd0IsQ0FBQyxDQUFBO0FBQy9ELGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7QUFDSCxTQUFBO0FBQ0YsS0FBQTtBQUNELElBQUEsT0FBTyxhQUFhLENBQUE7QUFDdEIsQ0FBQztBQUVlLFNBQUEsSUFBSSxDQUFFLFNBQWdFLEVBQUUsT0FBWSxFQUFBO0lBQ2xHLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMzQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQVUsRUFBRSxJQUFTLEtBQUk7QUFDcEQsWUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xCLFlBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixTQUFDLENBQUMsQ0FBQTtBQUNILEtBQUE7QUFDSDs7QUNuQ0E7Ozs7Ozs7QUFPRztBQWFIOzs7Ozs7QUFNRTtBQUNGLE1BQU0sS0FBSyxHQUFHO0lBQ1osSUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFOzs7OzsifQ==
