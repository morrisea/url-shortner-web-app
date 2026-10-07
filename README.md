# URL Shortener Milestone One

**Author:** Evan Morris <br>
**Course:** CS518 - Web Programming <br>
**Semester:** Fall 2026
**Due Date:** Oct 8, 2026 <br>

## Project Description

The project will consist of a web application that allows users to create shortened URLs (Uniform Resource Locator) from long web addresses. Users will be able to create accounts and manage their shortened URLs through a personal account portal. The application will provide users the ability to generate, view, edit, and delete shortened links.

The primary purpose of the application is to make long and difficult-to-share URLs shorter and easier to distribute while giving users a centralized location to manage their links.

## Technologies Used

| Category           | Technologies                         |
| ------------------ | ------------------------------------ |
| **Frontend**       | React, Vite, React Router            |
| **Backend**        | Express.js, TypeScript, CORS, dotenv |
| **Database**       | MySQL, Drizzle ORM                   |
| **Authentication** | JWT, bcrypt, Cookie Parser           |
| **Email**          | Nodemailer                           |
| **Infrastructure** | Docker                               |
| **Development**    | ESLint, Nodemon, Drizzle Kit, tsx    |

## Installation, Database, and Environment Setup

### Install Docker Desktop

Download and install Docker Desktop for your operating system:

[Docker Desktop](https://www.docker.com/products/docker-desktop/)

After installation, open Docker Desktop and make sure it is running.

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
API_URL=

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

```bash
docker compose up --build
```

### Initialize the Database

Apply the Drizzle ORM migrations:

```bash
docker compose exec server npx drizzle-kit migrate
```

## Authentication Workflow

## API Endpoints

## Known Issues

## References
