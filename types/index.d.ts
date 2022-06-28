/**
 * My module description. Please update with your module data.
 *
 * @remarks
 * This module runs perfectly in node.js and browsers
 *
 * @packageDocumentation
 */
import { setup, send } from './email';
declare global {
    let _config: any;
    let _auth: any;
    let _provider: any;
}
declare const Hajar: {
    Mail: {
        setupEmail: typeof setup;
        sendEmail: typeof send;
    };
};
export default Hajar;
//# sourceMappingURL=index.d.ts.map