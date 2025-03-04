# Video Streaming Application

This is a video streaming application built with Node.js, Express, MongoDB, and other modern web technologies.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
- [License](#license)

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Cloudinary
- Multer
- Prettier

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Clone the repository:

     ```sh
     git clone https://github.com/your-username/video-streaming-application.git
     cd video-streaming-application
     ```

2. Install the dependencies:

     ```sh
     npm install
     ```

### Running the Application

1. Start the MongoDB server if it's not already running.

2. Run the application:

     ```sh
     npm run dev
     ```

     The server will start on the port specified in the `.env` file (default is 5000).

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=anyPort
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=<your_access_token_secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

## API Endpoints

### User Routes

#### Register User

- **URL:** `/api/v1/user/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**

    ```json
    {
        "fullname": "John Doe",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "password": "password123"
    }
    ```

- **Request Files:**
    - `avatar`: Image file (required)
    - `coverImage`: Image file (required)

- **Response:**

    ```json
    {
        "statusCode": 200,
        "message": "User Registered Successfully",
        "data": {
            "fullname": "John Doe",
            "username": "johndoe",
            "email": "johndoe@example.com",
            "avatar": "<avatar_url>",
            "coverImage": "<cover_image_url>"
        }
    }
    ```

#### Login User

- **URL:** `/api/v1/user/login`
- **Method:** `POST`
- **Description:** Logs in a user.
- **Request Body:**

    ```json
    {
        "username": "johndoe",
        "password": "password123"
    }
    ```

- **Response:**

    ```json
    {
        "statusCode": 200,
        "message": "User logged in Successfully",
        "data": {
            "user": {
                "fullname": "John Doe",
                "username": "johndoe",
                "email": "johndoe@example.com"
            },
            "accessToken": "<access_token>",
            "refreshToken": "<refresh_token>"
        }
    }
    ```

#### Logout User

- **URL:** `/api/v1/user/logout`
- **Method:** `POST`
- **Description:** Logs out a user.
- **Headers:**

    ```json
    {
        "Authorization": "Bearer <access_token>"
    }
    ```

- **Response:**

    ```json
    {
        "statusCode": 200,
        "message": "User Logged Out",
        "data": {}
    }
    ```

#### Refresh Token

- **URL:** `/api/v1/user/refresh-token`
- **Method:** `POST`
- **Description:** Refreshes the access token.
- **Request Body:**

    ```json
    {
        "refreshToken": "<refresh_token>"
    }
    ```

- **Response:**

    ```json
    {
        "statusCode": 200,
        "message": "Access token refreshed Successfully",
        "data": {
            "accessToken": "<new_access_token>",
            "refreshToken": "<new_refresh_token>"
        }
    }
    ```

## License

This project is licensed under the ISC License.