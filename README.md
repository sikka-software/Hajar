<p align="center">
  <img src="https://xakher-images.s3.ap-southeast-1.amazonaws.com/hajar-logo.png" alt="Hajar | حجر" />
</p>

# Hajar | حجر

[![NPM](https://img.shields.io/npm/v/@sikka/hajar.svg?style=flat&colorA=000000&colorB=1082c3)](https://www.npmjs.com/package/@sikka/hajar)
[![NPM@beta](https://img.shields.io/npm/v/@sikka/hajar/beta.svg?style=flat&colorA=000000&colorB=ea7637)](https://www.npmjs.com/package/@sikka/hajar)
[![Hajar CI - @latest](https://github.com/sikka-software/Hajar/actions/workflows/hajar-main.yml/badge.svg)](https://github.com/sikka-software/Hawa/actions/workflows/hajar-main.yml)
[![Hajar CI - @beta](https://github.com/sikka-software/Hajar/actions/workflows/hajar-beta.yml/badge.svg)](https://github.com/sikka-software/Hajar/actions/workflows/hajar-beta.yml)

> Javascript/Typescript engine Saas/Paas applications

## Install

**Note:** `@beta` only points to pre-releases.
Use `@latest` for the latest stable release.

```bash
npm install @sikka/hajar
```

[documentation](https://zakher.gitbook.io/hajar/)

# Benefits

Many SaaS projects have the same foundation and architecture. Using a dynamic external library like Hajar will make it easier and faster to complete the internal functions of your SaaS project.

# Table of content

<!-- TABLE OF CONTENTS -->

<ol>
<li><a  href="#overview">Overview</a></li>
<li><a  href="#getting-started">Getting Started</a>
<ul>
<li><a  href="#prerequisite">Prerequisite</a></li>
<li><a  href="#install">Installation</a></li>
</ul>
</li>
<li>
<a  href="#usage">Usage</a>
<ul>
<li><a  href="#directory-structure">Directory Structure</a></li>
<li><a  href="#theme-preview">Theme Preview</a></li>
</ul>
</li>
<li>
<a  href="#main-features">Main Features</a>
<ul>
<li><a  href="#theme-features">Database Connections</a></li>
<li><a  href="#theme-components">Authentication</a></li>
<li><a  href="#theme-components">Emails</a></li>
<li><a  href="#theme-components">Storage</a></li>
<li><a  href="#theme-components">Invoices</a></li>
</ul>
</li>
<li><a  href="#support">Support</a></li>
<li><a  href="#contributing">Contributing</a></li>
<li><a  href="#credits">Credits</a></li>
<li><a  href="#license">License</a></li>
</ol>

<br>

## Install

```bash

npm install --save @sikka/hajar

```

## Usage

```jsx
//example coming soon inshallah
```

# Main Features

### Invoices

| <div style="width:220px">Function</div> | Discription                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| [CreateInvoice]()                       | This component is responsible for displaying Youtube videos that the developer preselects.  |
| [placeholder]()                         | Fixed banner is the area in charge of displaying a banner that is fixated on the home page. |

<!--
This will be used to create an invoice with ready a ready template.

Arguments:

```
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
``` -->
<!--
### SendEmail()

Send an email to the user for billing, verification, password reset, or other reasons

Arguments:

template: \["verification", "password-reset", "billing"\]

### CreateModel()

```plain
CreateModel({
name: 'Menu',
public: false,

})
```

To create a graphql model type that will work with MongoDB

### CreateSchema()

To create the final schema of the graphql

### CreateUser()

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

### SetupPayment() -->

## Support

The team is always here to help you. Happen to face an issue? Want to report a bug? You can submit one here on Github using the [Issue Tracker](https://github.com/sikka-software/hajar/issues/new).

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

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
# Coming soon inshallah
```

## License

<!-- https://github.com/react-component/drawer  -->

MIT © [SIKKA SOFTWARE](https://sikka.sa)
