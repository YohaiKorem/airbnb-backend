# rentRoam Backend
live app: https://rentroam2.onrender.com/#/stay
## Introduction

This is the backend component of the **rentRoam** project, an Airbnb clone. The backend is designed to support robust and scalable web services, featuring middleware for authentication and geospatial queries.

## Key Features

- **Authentication Middleware:** Ensures secure access to the application, handling user authentication and authorization. Utilizes JWT tokens for secure and efficient user authentication. The `requireAuth` middleware checks for valid login tokens and grants access accordingly.
- **Geospatial Queries:** Supports location-based services and functionalities, crucial for a rental platform like Airbnb.
- **Scalability:** Designed for scalability to handle growing user traffic and data.

## Detailed Authentication Functionality

- **User Authentication (`requireAuth`):** Verifies users through JWT tokens. If no valid token is found, the request is denied with an authentication error.
- **Ownership Verification (`requireOwnership`):** Ensures users can only modify resources they own (e.g., their stays or orders). Checks the entity type and matches the user ID with the resource owner.
- **Admin Privileges (`requireAdmin`):** Restricts certain actions to users with admin roles. Validates admin status through tokens and logs any unauthorized admin action attempts.

## Technologies Used

- Node.js
- Express.js
- MongoDB (for geospatial queries)
- Typescript.

## Setup and Installation

Ensure you have Node.js and MongoDB installed on your system.

Clone the repository:

```bash
git clone https://github.com/YohaiKorem/rentRoam-backend.git
```

Navigate to the project directory:

```bash
cd rentRoam-backend
```

Install dependencies:

```bash
npm install
```

## Building the dist folder

to build the dist folder from the ts use the following command (note that this removes the previous dist folder using rimraf with the prebuild command):

```bash
npm run build
```

## Running the dev Server

To start the dev server, use the following command:

```bash
npm run dev
```

## Runnig with nodemon with production environment variables:

```bash
npm run ds
```

## Contributing

Contributions are welcome to enhance the backend functionalities of rentRoam. Here's how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.

---

For more details and updates, visit the [rentRoam Backend GitHub repository](https://github.com/YohaiKorem/rentRoam-backend).
