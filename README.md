# URL Shortener Milestone Three

**Author:** Evan Morris <br>
**Course:** CS518 - Web Programming <br>
**Semester:** Fall 2026 <br>
**Due Date:** Dec 3, 2026 <br>

## Project Description

The project will consist of a web application that allows users to create shortened URLs (Uniform Resource Locator) from long web addresses. Users will be able to create accounts and manage their shortened URLs through a personal account portal. The application will provide users the ability to generate, view, edit, and delete shortened links.

The primary purpose of the application is to make long and difficult-to-share URLs shorter and easier to distribute while giving users a centralized location to manage their links.

## Technologies Used

| Category           | Technologies                                 |
| ------------------ | -------------------------------------------- |
| **Frontend**       | React, Vite, React Router, Mui               |
| **Backend**        | Express.js, TypeScript, CORS, dotenv, helmet |
| **Database**       | MySQL, Drizzle ORM                           |
| **Authentication** | JWT, bcrypt, Cookie Parser, Google ReCAPTCHA |
| **Email**          | Nodemailer                                   |
| **Infrastructure** | Docker                                       |
| **Development**    | ESLint, Drizzle Kit, tsx                     |

## Installation, Database, and Environment Setup

### Install Docker Desktop

Download and install Docker Desktop for your operating system:

[Docker Desktop](https://www.docker.com/products/docker-desktop/)

After installation, open Docker Desktop and ensure it is running.

Verify the installation:

```bash
docker --version
docker compose version
```

### Clone the Repository

```bash
git clone https://github.com/odu-cs418-webprogramming/fall26-morrisea.git
cd fall26-morrisea/app/
```

### Create Environment Configuration

Create the required `.env` file in `fall26-morrisea/app/` meeting the following criteria:

```bash
# Server
API_URL=
SERVER_PORT=
NODE_ENV=
DATABASE_URL=
FRONTEND_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TTL= # in minutes
JWT_REFRESH_TTL= # in days
SMTP_EMAIL=
SMTP_PASS=
SMTP_VALIDATION_SECRET=
SMTP_VALIDATION_TTL= # in minutes
MFA_TTL= # in minutes

# Client
CLIENT_PORT=
VITE_API_URL=
VITE_REDIRECT_URL=

# Database
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_PORT=

# Adminer
ADMINER_PORT=
```

### Build and Start the Containers

Docker compose will handle running the `npm run dev` comands to bring up each service. Run the following command to build the images and start the services.

```bash
docker compose up --build
```

### Initialize the Database

Apply the Drizzle ORM migrations:

```bash
docker compose exec server npx drizzle-kit migrate
```

## Schema

### Users Table

The `users` table stores account information for registered users. It contains the user's personal identifying information, password hash, email verification status, and account creation timestamp.

| Field               | Type           | Constraints                 | Purpose                                              |
| ------------------- | -------------- | --------------------------- | ---------------------------------------------------- |
| `id`                | `INT`          | Primary Key, Auto Increment | Unique identifier for each user                      |
| `first_name`        | `VARCHAR(255)` | Not Null                    | User's first name                                    |
| `last_name`         | `VARCHAR(255)` | Not Null                    | User's last name                                     |
| `email`             | `VARCHAR(255)` | Not Null, Unique            | User's email address                                 |
| `password_hash`     | `VARCHAR(255)` | Not Null                    | Stores the user's bcrypt-hashed password             |
| `is_email_verified` | `BOOLEAN`      | Not Null, Default `false`   | Indicates whether the user's email has been verified |
| `creation_date`     | `TIMESTAMP`    | Not Null, Default `NOW()`   | Records when the account was created                 |

### Multi-Factor Authentication Table

The `multi_factor` table temporarily stores email-based multi-factor authentication codes and their expiration times.

| Field        | Type           | Constraints                 | Purpose                                      |
| ------------ | -------------- | --------------------------- | -------------------------------------------- |
| `id`         | `INT`          | Primary Key, Auto Increment | Unique identifier for each MFA record        |
| `code`       | `VARCHAR(8)`   | Not Null, Unique            | Temporary MFA verification code              |
| `email`      | `VARCHAR(255)` | Not Null, Unique            | Email address associated with the MFA code   |
| `expires_at` | `TIMESTAMP`    | Not Null                    | Determines when the MFA code becomes invalid |

### URLs Table

The `urls` table stores submitted URLs. Each URL is assigned a unique identifier and a SHA-256 hash to prevent duplicate URL entries. The creation timestamp records when the URL was first added to the database.

| Field           | Type            | Constraints                 | Purpose                                                            |
| --------------- | --------------- | --------------------------- | ------------------------------------------------------------------ |
| `id`            | `INT`           | Primary Key, Auto Increment | Unique identifier for each URL                                     |
| `address`       | `VARCHAR(2048)` | Not Null                    | Stores the original URL address                                    |
| `address_hash`  | `VARCHAR(64)`   | Not Null, Unique            | Stores the SHA-256 hash of the original URL to identify duplicates |
| `creation_date` | `TIMESTAMP`     | Not Null, Default `NOW()`   | Records when the URL was first added                               |

### Saved URLs Table

The `saved_urls` table stores data related between users and URLs, allowing users to save URLs to their accounts. It implements a many-to-many relationship between the `users` and `urls` tables.

| Field           | Type          | Constraints               | Purpose                                         |
| --------------- | ------------- | ------------------------- | ----------------------------------------------- |
| `user_id`       | `INT`         | Not Null, Foreign Key     | References the user who saved the URL           |
| `url_id`        | `INT`         | Not Null, Foreign Key     | References the original URL in the `urls` table |
| `redirect`      | `VARCHAR(16)` | Not Null, Unique          | Stores the unique shortened URL identifier      |
| `creation_date` | `TIMESTAMP`   | Not Null, Default `NOW()` | Records when the URL was saved by the user      |

## Authentication Workflow

### User Registration

1. The user enters their first name, last name, email, and password.
2. The frontend validates the registration form and sends the information to the backend.
3. The backend validates the submitted data.
4. The user's password is hashed using bcrypt.
5. The new user account is inserted into the MySQL database with email verification initially disabled.

### Duplicate-Email Prevention

1. The backend checks whether the submitted email already exists in the database.
2. If the email is already registered, the registration request is rejected and the UI informs the user.
3. If the email is not registered, the account creation process continues to email verification.

### Password Hashing

1. During the registration process and before being inserted into the database, the password is validated against the password policy and then hashed using bcrypt. Passwords are never stored as plaintext.

### Email Verification

1. After registration, the server generates a verification token.
2. A verification link containing the token is sent to the user's email.
3. The user follows the link to verify their email address.
4. The backend validates the token and marks the user's email as verified.
5. The backend redirects the user to the login page and the UI prompts the user to log in.

### Login

1. The user submits their email and password.
2. The backend retrieves the account associated with the email.
3. The submitted password is compared against the stored bcrypt hash.
4. The backend verifies that the user's email has been verified.
5. If the credentials are valid, the authentication process continues to two-factor authentication.

### Email-Based Two-Factor Authentication

1. The server generates a temporary verification code using the crypto library.
2. The code is sent to the user's verified email address.
3. The user enters the code on the verification page.
4. The backend validates the code and its expiration.
5. If the code is valid, the user is authenticated and two JWTs, an access and refresh token, are issued.

### Access to the Protected Page

1. The access token is stored by the frontend authentication context to ensure the access token to stored in react state only.
2. The refresh token is set as an HttpOnly cookie.
3. Requests to protected backend resources include the access token using the authorization bearer header.
4. The backend authentication middleware validates the token.
5. If the token is valid, the user can access protected resources and pages.
6. If the user is not authenticated, they are redirected to the login page.
7. Any time the accesses the website's domain, The auth provider validates the refresh token by the backend and refreshes the access token if expired.

### Logout

1. The user click the logout button.
2. The frontend clears the stored access token from the authentication context.
3. The backend clears the refresh token cookie.
4. The user is no longer authenticated and cannot access protected resources.

## API Endpoints

The backend provides the following endpoints:

| Method   | Endpoint               | Purpose                                                                  |
| -------- | ---------------------- | ------------------------------------------------------------------------ |
| `POST`   | `/register`            | Registers a new user account                                             |
| `POST`   | `/login`               | Validates the user's login credentials                                   |
| `POST`   | `/refresh`             | Refreshes an expired access token using the refresh token                |
| `POST`   | `/logout`              | Logs the user out and clears the authentication session                  |
| `POST`   | `/resend-verification` | Resends the email verification link                                      |
| `POST`   | `/send-mfa`            | Sends a multi-factor authentication code to the user's email             |
| `POST`   | `/verify-mfa`          | Verifies the multi-factor authentication code                            |
| `POST`   | `/links`               | Creates a shortened URL                                                  |
| `GET`    | `/verify-email/`       | Verifies the user's email using the verification token                   |
| `GET`    | `/dashboard`           | Returns the protected dashboard resource for an authenticated user       |
| `GET`    | `/links`               | Retrieves a paginated list of URLs saved by the authenticated user       |
| `GET`    | `/links/:id`           | Retrieves a specific saved URL                                           |
| `GET`    | `/:redirect`           | Redirects visitors to the original URL associated with the shortened URL |
| `PUT`    | `/links/:id`           | Updates a saved URL                                                      |
| `DELETE` | `/links/:id`           | Deletes a specific saved URL                                             |
| `DELETE` | `/links/`              | Deletes multiple saved URLs                                              |

## Search, Filter, and Sort Functionality

Implemented Material UI DataGrid to provide users with the ability to search, filter, and sort saved URLs.

## reCAPTCHA Implementation

Integrated Google reCAPTCHA to help protect authentication forms against automated submissions and bot activity.

## Clickjacking and MIME Sniffing Protection

Implemented Helmet.js to strengthen application security through HTTP security headers. These headers help prevent clickjacking attacks using `X-Frame-Options` and MIME-type sniffing using `X-Content-Type-Options`.

## Known Issues

- The current authentication implementation using JSON Web Tokens is stateless by only needing to verify the token is not expired and remains unmodified. The trade-off and potential issue is when we need to revoke a user's access or alter a user's role. The user would be able to continue to access protected resources until the tokens expire. Token verisoning and storing the versions with user data can fix this but changes authentication to being a more stateful implementation.

- The refresh endpoint is called when the initial mounting occurs of the auth provider component. This is working as intended but I would like to implement a HTTP interceptor that can wrap the requests and responses which handles the token refreshes intuitively. Looking at axios to solve this.

## References

- docker - Documentation, <https://docs.docker.com/>
- vite - Get Started, <https://vite.dev/guide/>
- react - Quick Start, <https://react.dev/learn>
- Kevin Powell -
  Subgrid & Container Queries change how we can create layouts, <https://www.youtube.com/watch?v=Zddz_R1RnfM>
- typescript - Documentation, <https://www.typescriptlang.org/docs/>
- expressjs - Documentation, <https://expressjs.com/>
- npmjs - package documentation, <https://www.npmjs.com/package/>
- ChatGPT - error parsing, <https://chatgpt.com/>
- JWTs - jsonwebtoken, <https://github.com/auth0/node-jsonwebtoken>
- drizzle - Documentation, <https://orm.drizzle.team/docs/overview>
- Material UI - Documentation, <https://mui.com/material-ui/getting-started/>
- Google ReCAPTCHA, <https://www.google.com/recaptcha>
- Render, <https://render.com/>
- Clever Cloud, <https://www.clever.cloud/>
