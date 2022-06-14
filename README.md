<p align="center">
  <img src="https://xakher-images.s3.ap-southeast-1.amazonaws.com/hajar-logo-toolkit.png" alt="Hajar | حجر" />
</p>

# Hajar | حجر

[![NPM](https://img.shields.io/npm/v/@sikka/hajar.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@sikka/hajar)
[![NPM](https://img.shields.io/npm/dt/@sikka/hajar.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@sikka/hajar)

> Toolkit for creating SaaS applications

<!-- [documentation](https://zakher.gitbook.io/hajar/) -->

# Concept

Most [SaaS](https://en.wikipedia.org/wiki/Software_as_a_service) projects have similar backends that users interact with, such as [CMS](https://en.wikipedia.org/wiki/Content_management_system), Auth, Payments, Billing, and more. This package aims to provides the essential tools to create a full SaaS product.

For the boilerplate, check out [Tayar](https://github.com/sikka-software/tayar.git)

## Install

```bash
npm install --save @sikka/hajar
```

### Index

<table>
  <tr>
    <td valign="top">
      <ul>
        <li><a href="#auth">Auth</a></li>
        <ul>
          <li><a href="#setupFirebase">setupFirebase</a></li>
          <li><a href="#createUser">createUser</a></li>
          <li><a href="#updateUser">updateUser</a></li>
          <li><a href="#deactivateUser">deactivateUser</a></li>
          <li><a href="#deleteUser">deleteUser</a></li>
          <li><a href="#signIn">signIn</a></li>
          <li><a href="#signOut">signOut</a></li>
        </ul>
        <li><a href="#emails">Emails</a></li>
        <ul>
          <li><a href="#setupEmail">setupEmail</a></li>
          <li><a href="#sendEmail">sendEmail</a></li>
        </ul>
        <li><a href="#payments">Payments</a></li>
        <ul>
          <li><a href="#setupWallet">setupWallet</a></li>
          <li><a href="#setupAmazonPayments">setupAmazonPayments</a></li>
          <li><a href="#setupPayPal">setupPayPal</a></li>
          <li><a href="#setupGooglePay">setupGooglePay</a></li>
        </ul>
        <li><a href="#databases">Databases</a></li>
        <ul>
          <li><a href="#setupMongoDB">setupMongoDB</a></li>
        </ul>
        <li><a href="#invoices">Invoices</a></li>
        <ul>
          <li><a href="#createInvoice">createInvoice</a></li>
        </ul>
      </ul>
    </td>
  </tr>
</table>

# Documentation

## **Auth**

All auth functions such create, update, delete, deactivate, sign in, sign out users.

</br>

#### **Setup Firebase**

##### Quickly setup Firebase project

```js
Hajar.Auth.setupFirebase();
```

#### **Create User**

##### Create a new user in firebase

```js
Hajar.Auth.createUser();
```

#### **Update User**

##### Update a current user in firebase

```js
Hajar.Auth.updateUser();
```

#### **Deactivate User**

##### Deactivate a current user

```js
Hajar.Auth.deactivateUser();
```

#### **Remove User**

##### Delete a current user from firebase

```js
Hajar.Auth.removeUser();
```

#### **Sign In User**

##### Sign in a user from the app

```js
Hajar.Auth.signIn();
```

#### **Sign Out User**

##### Sign out a user from the app

```js
Hajar.Auth.signOut();
```

<hr/>

## **Databases**

subtext about the mongodb function

</br>

#### **initialize MongoDB**

##### This will be used to create an invoice with ready a ready template.

```js
Hajar.Database({});
```

<hr/>

## **Emails**

Setup nodemail and send emails to users

</br>

#### **Setup Email**

##### This will be used to create an invoice with ready a ready template.

```js
Hajar.Mail.setupEmail({});
```

#### **Send Email**

##### Send an email to the user for billing, verification, password reset, or other reasons

```js
Hajar.Mail.sendEmail({});
```

<hr/>

## **GraphQL**

subtext about the mongodb function

</br>

#### **CreateModel**

##### To create a graphql model type that will work with MongoDB

```
Hajar.CreateModel({})
```

#### **CreateSchema**

##### To create the final schema of the graphql

```
Hajar.CreateSchema({})
```

<hr/>

## **Payments**

Setup payments methods for one-time and recurring transactions

</br>

#### **Setup Wallet**

##### Quickly setup the user wallet system

```js
Hajar.Payment.Wallet({});
```

#### **Setup Amazon Payment Services**

##### Setup payment methods (Visa, Mastercard, Mada, ApplePay)

```js
Hajar.Payment.Payfort({});
```

#### **Setup PayPal**

##### Setup PayPal payments

```js
Hajar.Payment.Paypal({});
```

#### **Setup GooglePay**

##### Enable GooglePay payments

```js
Hajar.Payment.GooglePay({});
```

</br>
</br>

# Contributing

To contribute, clone this github repository and run the development server

- clone repository

```bash
git clone git@github.com:sikka-software/hajar.git
cd hajar
npm install
```

## TESTING

- Run development server

```bash
git clone git@github.com:sikka-software/hajar.git
cd hajar
npm install
```

## Deployment

```bash
npm run start
```

## Publishing (Admin)

```bash
npm version [major | minor | patch]
npm run build-lib
npm publish --access public
```

## Use Cases

- [Qawaim](https://qawaim.app)
- [OneCard](https://onecard.zone)
- [Worda](https://worda.app)
- [Seera](https://seera.app)
- [Linkat](https://linkat.app)

## License

<!-- https://github.com/react-component/drawer  -->

MIT © [SIKKA SOFTWARE](https://sikka.sa)

<!--start: logo-->
<p align="center">
  <a href="https://sikka.io">
    <img width="44" alt="Sikka" src="https://i.postimg.cc/8cK4tnKQ/sikka-symbol-black.png">
  </a>
</p>
<p align="center">
  <sub>An open source project by <a href="https://sikka.io">Sikka</a></sub>
</p>
<!--end: logo-->
