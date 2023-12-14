This is a application that built under [Next.js](https://nextjs.org/).
Below is a comprehensive guide to help you get started, understand the features and functions, and utilize the available APIs.

## Getting Started

To launch the development server, use the following command after restoring all required packages:

```bash
npm run dev
```
Visit http://localhost:3000 in your browser to view the landing page. 
Make sure to update the settings in the .env file with your own configurations.

## Features and Functions Demonstration

The application boasts the following features:

- User Authentication:
  - [X] Creditail accounts login or OAuth login with Google.
  - [X] User registration.
  - [X] Email verification for creditail accounts.

- Authorization and Security:
  - [X] Authentication and authorization for the administrator page.
  - [X] Basic HTML form data validation.
  - [X] Password and profile editing capabilities.

- User Dashboard:
  - [X] User statistics and a dashboard with paging.
  - [X] Seamless integration with the database.

## API Documentation (Swagger Doc: /admin/api-doc)
- api/mail/send: API for sending emails.
- api/mail/verify: Verify if a user account is valid or not.
- api/user/sign-up: API for user account registration.
- api/user/admin/read: Read user profile data.
- api/user/admin/reset-password: API for resetting passwords.
- api/user/admin/update: API for updating user profiles.
- api/user/admin/statistics:  API for retrieving user statistics information.

> Please login to grant the permission to see the swagger page.

![Swagger](https://raw.githubusercontent.com/tocalai/nextjs-auth/main/.github/swagger.png)
