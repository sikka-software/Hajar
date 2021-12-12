<p align="center">
  <img src="https://xakher-images.s3.ap-southeast-1.amazonaws.com/hajar-logo.png" alt="Hajar | حجر" />
</p>

# Hajar | حجر

[![NPM](https://img.shields.io/npm/v/@sikka/hajar.svg)](https://www.npmjs.com/package/@sikka/hajar)
[![NPM](https://img.shields.io/npm/dt/@sikka/hajar.svg)](https://www.npmjs.com/package/@sikka/hajar)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Opinionated UI Kit for web apps and websites.



The Thesis of the structure is that each code architecture is that the user is creating items and save them as private or public. The items are editable and they can be categorized in different ways.

Concept
=======

Users collect stones. A single stone is a JSON object that has an \_id and other properties with flexible data. Examples of a stones:

*   Menu from Qawaim
*   Card from OneCard
*   Worda from Worda
*   Tweet from Twitter
*   Image from Instagram
*   GIF from Giphy
*   Pin from Pinterest
*   Post from Facebook
*   etc

  

We will abstract Qawaim and make it connected to a boilerplate that we will use to generate other Apps that have the similar structure as Qawaim but with different items.

Benefits
========

Many SaaS projects have the same foundation and architecture. Putting them in the same boilerplate will eliminate the time it takes to setup the project .They all need the same:

Common Elements
===============

The follow web elements and pages exist in most SaaS projects.

*   Pages
    *   Sign in
    *   Sign Up
    *   Reset Password
    *   New Password
    *   Billing
    *   Checkout
    *   Payment Confirmation
    *   Error Page
*   Billing Page
    *   Add Payment Method
    *   Add Wallet Balance
    *   See Transaction History
*   Account Page
    *   Change Language
    *   Change Currency
    *   Change Profile Info
    *   Change Password
    *   Deactivate Account
*   Wallet Balance System
*   Home Page
    *   List of Stones
    *   Create Stone
    *   Delete Stone
    *   Update Stone
*   Single Stone Page (\[id\].js)

The Hierarchy
=============

  

Users saved objects can be top level only or multileveled. For example:

Qawaim Hierarchy

```plain
Users
- Menus (location, currency, language)
-- Items (info & images)
```

Garagi Hierarchy

```plain
Users
- Garages (location, capacity)
-- Cars (info & images)
--- Documents (ownership, insurance, etc)
```

OneCard Hierarchy

```plain
Users
- OneCards
-- Actions (Download vCard, Profile Page, Central Link, Redirect to Link) 
--- Buttons (To create central links)
--- Inputs (To create surveys)
```

  

Functions & Methods
===================

### CreateInvoice()

This will be used to create an invoice with ready a ready template.

Arguments:

date: date of invoice

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

### SetupPayment()

UI Design
=========

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
git clone git@github.com:sikka-software/hawa.git
cd hawa
npm install
```

## TESTING

- Run development server

```bash
git clone git@github.com:sikka-software/hawa.git
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

## License

<!-- https://github.com/react-component/drawer  -->

MIT © [SIKKA SOFTWARE](https://sikka.sa)
