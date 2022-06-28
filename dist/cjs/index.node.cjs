'use strict';

var nodemailer = require('nodemailer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var nodemailer__default = /*#__PURE__*/_interopDefaultLegacy(nodemailer);

function setup(params) {
    const listTransport = {};
    if (params.HAJAR_MAIL_PARAMETERS.length > 0) {
        for (let i = 0; i < params.HAJAR_MAIL_PARAMETERS.length; i++) {
            const config = params.HAJAR_MAIL_PARAMETERS[i];
            const nameTransporter = config.name ?? '';
            const transporter = nodemailer__default["default"].createTransport(config);
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

module.exports = Hajar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5janMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cy9lbWFpbC50cyIsIi4uLy4uL3NyYy90cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsibm9kZW1haWxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFPTSxTQUFVLEtBQUssQ0FBRSxNQUEyQixFQUFBO0lBQ2hELE1BQU0sYUFBYSxHQUFRLEVBQUUsQ0FBQTtBQUU3QixJQUFBLElBQUksTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDM0MsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUMsWUFBQSxNQUFNLGVBQWUsR0FBVyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUNqRCxNQUFNLFdBQVcsR0FBR0EsOEJBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdEQsWUFBQSxhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBQzVDLGFBQWEsQ0FBQyxlQUFlLENBQTJELENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLE9BQU8sRUFBQTtnQkFDdkgsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbkIsaUJBQUE7QUFBTSxxQkFBQTtBQUNMLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxlQUFlLENBQUEsc0JBQUEsQ0FBd0IsQ0FBQyxDQUFBO0FBQy9ELGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7QUFDSCxTQUFBO0FBQ0YsS0FBQTtBQUNELElBQUEsT0FBTyxhQUFhLENBQUE7QUFDdEIsQ0FBQztBQUVlLFNBQUEsSUFBSSxDQUFFLFNBQWdFLEVBQUUsT0FBWSxFQUFBO0lBQ2xHLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMzQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQVUsRUFBRSxJQUFTLEtBQUk7QUFDcEQsWUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xCLFlBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixTQUFDLENBQUMsQ0FBQTtBQUNILEtBQUE7QUFDSDs7QUNuQ0E7Ozs7Ozs7QUFPRztBQWFIOzs7Ozs7QUFNRTtBQUNGLE1BQU0sS0FBSyxHQUFHO0lBQ1osSUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFOzs7OzsifQ==
