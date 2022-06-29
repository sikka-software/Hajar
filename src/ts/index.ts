/**
 * My module description. Please update with your module data.
 *
 * @remarks
 * This module runs perfectly in node.js and browsers
 *
 * @packageDocumentation
 */

// export { helloWorld, Response } from './hello-world'
// export default function sayHello (): void { console.log('hello') }

import { setup, send } from './email'

declare global {
  let _config: any
  let _auth: any
  let _provider: any
}

/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
const Hajar = {
  Mail: { setupEmail: setup, sendEmail: send }
}

export default Hajar
