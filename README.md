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


# Functions & Methods

### CreateInvoice

This will be used to create an invoice with ready a ready template.

Arguments:

backend_url: ""
invoice_id: ""
invoice_lang: ""
invoice_company: {
logo: "URL TO LOGO"
name: "Sikka Software Est",
address: "Ash Shati Ash Sharqi, Dammam. Eastern Region, Saudi Arabia",
phone: "",
email: "contact@qawaim.app"
}
invoice_customer:{
full_name: "",
full_address: "", //address_line_1 + " " + address_line_2 + " " + city + " " + zip_code + " " + state + "," + country
email: ""
}
products: [
{
product_name: "PRODUCT NAME",
product_price: 00.00
}
]
invoice_date: "01/11/2020"
invoice_currency: "SAR"
return: "base64" // default: create file in the root app in folder invoice and return boolean true or false

### SendEmail

Send an email to the user for billing, verification, password reset, or other reasons

Arguments:

template: \["verification", "password-reset", "billing"\]

### CreateModel

```plain
CreateModel({
name: 'Menu',
public: false,

})
```

To create a graphql model type that will work with MongoDB

### CreateSchema

To create the final schema of the graphql

### CreateUser

Quickly create a user in Firebase

### \[BETA\] CreateUserWallet()

Quickly setup the user wallet system

### SetupEmail()

Quickly setup the nodemailer transporter email

### SetupMongoDB()

Quickly setup the mongoDB

arguments:

username: The MongoDB username

password: The mongoDB user password

URL: the url to connect to the database

### SetupFirebase()

```plain
SetupFirebase({
appId: 23912093812098

})
```

Quickly setup Firebase project

arguments

### SetupPayment()

# UI Design

All UI elements in this boilerplate will be components that we can rearrange differently to create different layouts. This way we can design and add new components with the same [Hawa | هواء](https://app.clickup.com/613523/v/dc/jq4k-1524/jq4k-22685) UI kit.

## Install

```bash

npm install --save @sikka/hawa

```

## Usage

```jsx
//example coming soon inshallah
```

## Contributing

To contribute, clone this github repository and run the development server

- clone repository

```bash
git clone git@github.com:sikka-software/hajar.git
cd hawa
npm install
```

## TESTING

- Run development server

```bash
git clone git@github.com:sikka-software/hajar.git
cd hawa
npm install
npm run storybook
```

- Edit **Hawa/src/stories/Hawa.stories.js\_** file

- Add your custom testing component in **Hawa.stories.js** file

- Or you can preview without running development server. [See Preview](https://sikka-software.github.io/Hawa/storybook-static/)

```jsx
//example coming soon inshallah
```

## Deployment

```bash
npm run build-storybook
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
