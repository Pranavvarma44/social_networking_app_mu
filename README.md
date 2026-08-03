# MU Social

MU Social is a full-stack university social networking platform designed
to help students and faculty connect, communicate, collaborate, and
participate in campus communities. The application combines social
networking features with real-time messaging and collaborative study
groups.

## Features

-   Secure user registration and login using JWT authentication
-   Student and faculty user roles
-   User profiles with follow and unfollow functionality
-   User search and personalized classmate suggestions
-   Social feed with posts, media uploads, likes, and comments
-   Real-time one-to-one messaging using Socket.IO
-   Online presence and typing indicators
-   Message sent, delivered, and read status
-   Study group creation, joining, and leaving
-   Real-time study group chat
-   Group member visibility and member management
-   Events and opportunities sections
-   Responsive dark-themed user interface

## Tech Stack

### Frontend

-   React.js
-   TypeScript
-   Tailwind CSS
-   Axios
-   Lucide React
-   Socket.IO Client

### Backend

-   Node.js
-   Express.js
-   Socket.IO
-   JWT Authentication
-   REST APIs

### Database

-   MongoDB
-   Mongoose

### Tools & Services

-   Git & GitHub
-   Postman
-   MongoDB Atlas
-   Render
-   Brevo Email API

## Project Structure

``` text
MU-Social/
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── PostsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── StudyGroupsPage.tsx
│   │   │   ├── GroupPage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   └── OpportunitiesPage.tsx
│   │   ├── components/
│   │   ├── api.ts
│   │   └── socket.ts
│   └── package.json
│
└── backend-express/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js
    └── package.json
```

> The exact folder names may differ depending on your repository
> structure.

## Installation

### 1. Clone the repository

``` bash
git clone https://github.com/Pranavvarma44/social_networking_app_mu.git

```

### 2. Install backend dependencies

``` bash
cd backend-express
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the backend directory:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
```

Never commit the `.env` file or expose API keys and database credentials
publicly.

### 4. Start the backend

``` bash
npm start
```

If your project uses a development script:

``` bash
npm run dev
```

### 5. Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

### 6. Configure the frontend

Create the appropriate frontend environment file and configure the
backend URL:

``` env
VITE_API_URL=http://localhost:5000
```

For production, replace it with your deployed backend URL.

### 7. Start the frontend

``` bash
npm run dev
```

## API Overview

The backend contains REST endpoints for the major application modules:

``` text
/api/auth
/api/users
/api/posts
/api/messages
/api/conversations
/api/study-groups
/api/group-messages
/api/opportunities
```

Protected routes require a JWT in the authorization header:

``` text
Authorization: Bearer <token>
```

## Real-Time Messaging

Socket.IO is used for real-time communication. The messaging system
supports direct messages and study-group conversations, along with
features such as online-user tracking, typing indicators, and message
status updates.

Authenticated socket connections send the JWT when establishing the
connection.

## Study Groups

Users can create and discover study groups, join or leave groups, view
group members, and participate in real-time group conversations. Group
functionality is integrated with the existing authentication and user
system.

## Authentication

After successful authentication, the backend issues a JWT that the
frontend stores and uses for protected API requests and authenticated
Socket.IO connections.

Passwords and authentication credentials should always be handled
securely, and production secrets should only be stored in environment
variables.

## Deployment

The backend can be deployed on Render and connected to MongoDB Atlas.
When deploying, configure all required environment variables in the
hosting platform rather than committing them to the repository.

Example production frontend configuration:

``` env
VITE_API_URL=https://your-backend-domain.com
```

## Future Improvements

-   Improved notification system
-   Group administrator and moderation controls
-   Event creation and registration
-   Advanced user recommendations
-   Profile and post media management
-   Improved mobile responsiveness
-   Automated testing
-   Enhanced security and validation

## Author

**Pranav Rudraraju**

GitHub: `Pranavvarma44`

## License

This project is intended for educational and portfolio purposes.
