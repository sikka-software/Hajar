# @sikka/hajar - v1.0.6

My module description. Please update with your module data.

**`remarks`**
This module runs perfectly in node.js and browsers

## Table of contents

### Variables

- [default](API.md#default)

## Variables

### default

• `Const` **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Mail` | { `sendEmail`: (`transport`: `Transporter`<`SentMessageInfo`\>, `message`: `any`) => `void` = send; `setupEmail`: (`params`: `HajarMailParameters`) => `nodemailer.Transporter`<`SMTPTransport.SentMessageInfo`\>[] = setup } |
| `Mail.sendEmail` | (`transport`: `Transporter`<`SentMessageInfo`\>, `message`: `any`) => `void` |
| `Mail.setupEmail` | (`params`: `HajarMailParameters`) => `nodemailer.Transporter`<`SMTPTransport.SentMessageInfo`\>[] |

#### Defined in

[index.ts:28](https://github.com/sikka-software/Hajar/blob/5dceef5/src/ts/index.ts#L28)
