# @sikka/hajar - v1.0.7

My module description. Please update with your module data.

**`remarks`**
This module runs perfectly in node.js and browsers

## Table of contents

### Interfaces

- [HAJAR\_LIST\_TRANSPORT\_ARRAY](interfaces/HAJAR_LIST_TRANSPORT_ARRAY.md)

### Variables

- [default](API.md#default)

## Variables

### default

• `Const` **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Mail` | { `sendEmail`: (`transport`: `Transporter`<`SentMessageInfo`\>, `params`: `Options`) => `void` = send; `setupEmail`: (`params`: `HAJAR_MAIL_PARAMETERS`[]) => [`HAJAR_LIST_TRANSPORT_ARRAY`](interfaces/HAJAR_LIST_TRANSPORT_ARRAY.md) = setup } |
| `Mail.sendEmail` | (`transport`: `Transporter`<`SentMessageInfo`\>, `params`: `Options`) => `void` |
| `Mail.setupEmail` | (`params`: `HAJAR_MAIL_PARAMETERS`[]) => [`HAJAR_LIST_TRANSPORT_ARRAY`](interfaces/HAJAR_LIST_TRANSPORT_ARRAY.md) |

#### Defined in

[index.ts:30](https://github.com/sikka-software/Hajar/blob/b0fc5ec/src/ts/index.ts#L30)
