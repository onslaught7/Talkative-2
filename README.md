# Talkative-2

Talkative-2 is a project designed for communication supporting direct messaging, group chats and file sharing
Leveraged JWT for user authentication and session management. Enabled real-time communication between users and groups using Socket.IO. Leveraged Zustand for global state management. This README will guide you through the steps to set up and run the project on your local system.

## Features

- Real-time chat
- Creating channels (group chat)
- JWT authentication
- Image and file sharing
- End-to-end encryption
- Google OAuth2.O

To run this project, you need to have MongoDB installed and running on your local system. Follow these steps to set up MongoDB:

1. **Download and Install MongoDB:**
    - Go to the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and download the MongoDB Community Server for your operating system.
    - Follow the installation instructions for your operating system.

2. **Start MongoDB:**
    - After installation, start the MongoDB server. You can do this by running the following command in your terminal:
      ```bash
      mongod
      ```

3. **Configure the Project to Use Your Local MongoDB:**
    - Mentioned in the below steps in Installation

Now, when you run the server, it will connect to your local MongoDB instance.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/onslaught7/Talkative-2.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Talkative-2
    ```
3. Install the dependencies and run client:
    ```bash
    cd client
    npm install
    ```
    Create a `.env` file with `VITE_SERVER_URL="http://localhost:3000"`

    ```bash
    npm run dev
    ```
3. Install the dependencies and run server: (open up another terminal)
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file with:
    ```
    PORT=3000
    JWT_KEY="Your_STRING_KEY
    ORIGIN="http://localhost:5173"
    DATABASE_URL="YOUR_DATABASE_URI"
    ```

    ```bash
    npm run dev
    ```

## Usage
Open your web browser and navigate to `http://localhost:5173`
create an account with email and password (account_1)

Open another web browser and navigate to `http://localhost:5173` 
create another account and add account_1 as contacts

## Contact

If you want to contact me, you can reach me at [krutibashmohapatra7@gmail.com].
## Setting up MongoDB

