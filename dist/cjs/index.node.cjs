'use strict';

var nodemailer = require('nodemailer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var nodemailer__default = /*#__PURE__*/_interopDefaultLegacy(nodemailer);

function setup(params) {
    const listTransport = {};
    if (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            const config = params[i];
            const nameTransporter = config.name ?? '';
            const transporter = nodemailer__default["default"].createTransport({
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

module.exports = Hajar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5janMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cy9lbWFpbC50cyIsIi4uLy4uL3NyYy90cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsibm9kZW1haWxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFnQk0sU0FBVSxLQUFLLENBQUUsTUFBK0IsRUFBQTtJQUNwRCxNQUFNLGFBQWEsR0FBK0IsRUFBRSxDQUFBO0FBQ3BELElBQUEsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQixRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLFlBQUEsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFlBQUEsTUFBTSxlQUFlLEdBQVcsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7QUFDakQsWUFBQSxNQUFNLFdBQVcsR0FBR0EsOEJBQVUsQ0FBQyxlQUFlLENBQUM7Z0JBQzdDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07QUFDckIsZ0JBQUEsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO0FBQ2xCLGlCQUFBO0FBQ0YsYUFBQSxDQUFDLENBQUE7QUFDRixZQUFBLGFBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRyxXQUFXLENBQUM7WUFDN0MsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLE9BQU8sRUFBQTtnQkFDOUQsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbkIsaUJBQUE7QUFBTSxxQkFBQTtBQUNMLG9CQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxlQUFlLENBQUEsc0JBQUEsQ0FBd0IsQ0FBQyxDQUFBO0FBQy9ELGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7QUFDSCxTQUFBO0FBQ0YsS0FBQTtBQUNELElBQUEsT0FBTyxhQUFhLENBQUE7QUFDdEIsQ0FBQztBQUVlLFNBQUEsSUFBSSxDQUFFLFNBQWdFLEVBQUUsTUFBa0MsRUFBQTtJQUN4SCxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEtBQVUsRUFBRSxJQUFTLEVBQUE7QUFDeEQsUUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xCLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixLQUFDLENBQUMsQ0FBQTtBQUNKOztBQ2pEQTs7Ozs7OztBQU9HO0FBZUg7Ozs7OztBQU1FO0FBQ0YsTUFBTSxLQUFLLEdBQUc7SUFDWixJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7Ozs7OyJ9
