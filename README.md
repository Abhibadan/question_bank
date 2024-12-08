# Question Bank Dashboard

This project is a web-based dashboard for managing a question bank, accessible only by admin users. The dashboard allows admins to upload questions along with their categories in CSV format, add categories individually, and update their profiles.

## Features

- **Admin Authentication**: Only logged-in admins can access the dashboard. Registration api is also available with 
/register endpoint. But not added in the dashboard,asper requirements
- **CSV Upload**: Upload questions and their categories using a CSV file.
- **Category Management**: Add new categories one by one.
- **Profile Management**: Admins can update their profile information.

## Project Structure

- **Controllers**: Handle the business logic for categories, questions, registration, and user management.
- **Models**: Define the data structure for categories, questions, and users.
- **Routes**: Define the API endpoints for categories, questions, registration, and user management.
- **Views**: EJS templates for rendering the frontend pages.
- **Public**: Static files such as CSS and JavaScript for the frontend.
- **Middlewares**: Custom middleware for file uploads and request validation.
- **Helpers**: Utility functions for user authentication.

## Dependencies

The project uses the following dependencies
- **node version**: 22.11.0
- **bcryptjs**: For hashing passwords.
- **body-parser**: To parse incoming request bodies.
- **csv-parser**: To parse CSV files.
- **dotenv**: To load environment variables from a `.env` file.
- **ejs**: For rendering HTML templates.
- **express**: Web framework for Node.js.
- **express-validator**: For validating and sanitizing user input.
- **jsonwebtoken**: For generating and verifying JSON Web Tokens.
- **mongoose**: For interacting with MongoDB.
- **multer**: For handling file uploads.
- **nodemon**: For automatically restarting the server during development.
- **streamifier**: To convert buffers to streams.

## Default Credential
- **email**: admin@email.com
- **password**: Qwer@1234

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>