# URL Shortener Website
**Author:** Evan Morris <br>
**Course:** CS518 - Web Programming <br>
**Due Date:** Sept 3, 2026 <br>


## Project Description
The project will consist of a web application that allows users to create shortened URLs (Uniform Resource Locator) from long web addresses. Users will be able to create accounts and manage their shortened URLs through a personal account portal. The application will provide users the ability to generate, view, edit, and delete shortened links.

The primary purpose of the application is to make long and difficult-to-share URLs shorter and easier to distribute while giving users a centralized location to manage their links.


## Problem or Need
Long URLs can be difficult to share and display. They can also take up unnecessary space in every form of communication where website links are present.

This web application will provide a convenient way for users to convert long URLs into shorter, more manageable links. With the account management portal, users will also be able to manage the URLs they have created rather than losing access to previously shortened links if the link happens to be deleted locally.

## Target Users
The application is intended for targeted users which include:

* **Students** – Can create shorter links for sharing websites in their course work.
* **Faculty/Staff** - Can create and embed shortened links into course's content and student correspondence. 
* **Small-business owners** – Can create easy-to-share links for websites and promotional material.
* **Event organizers** – Can create short links for event registration pages.
* **General internet users** – Can shorten long URLs for easier sharing through messages, emails, etc.

## Core Features
The application will include the following core features:

1. **Secure User Registration and Login** <br>
Users will be able to create an account and securely log in to access their personal URL management portal.
2. **URL Shortening** <br>
Users will be able to enter a long URL and generate a unique shortened URL that redirects to the original address.
3. **URL Management Dashboard** <br>
Registered users will be able to view a list of their shortened URLs and see information such as the original URL, shortened URL, and creation date.
4. **Edit and Delete URLs** <br>
Users will be able to modify or remove shortened URLs associated with their account.
5. **Email noficiations** <br>
Users will be able to share selected shortened URLs via email notifications.


## Preliminary Database Entities
The application will potentially use the following database entities:

* **Users** – Stores account information such as user ID, username, email, and authentication information.
* **URLs** – Stores the original URLs, shortened URL hashes, and creation dates.
* **URL_Access_Events** – Stores information about visits to shortened URLs, such as the time of access.
* **User_Sessions** – Stores information related to user activity.


## Preliminary Pages or User Interfaces
The application is expected to include, but not limited to, the following pages:

* Home Page
* Registration Page
* User URL Dashboard Page
* User Profile Management Page
* URL Shortener Page
* URL Management Page 
* URL Redirect Endpoint


## Expected Challenges
An expected challenge will be implementing user authentication. The application will need to properly, and securely handle user registration, login, password hashes, sessions, etc.

Another challenge I expect when creating the core functionality of the URL shortener is preventing possible collisions when shortening each URL. They must be unique in order to redirct properly so ensuring proper database checks and resolutions are in place that remain performant with anticipated traffic.
