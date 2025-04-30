# Talkative-2

Talkative-2 is a project designed for real-time communication with support for direct messaging, group chats, and file sharing.

Built using:
- JWT for authentication and session management
- Socket.IO for real-time communication
- Zustand for global state management
- MongoDB for data persistence
- Docker for containerized development

---

## 🚀 Features

- Real-time personal & group chat
- Channel (group) creation
- Image and file sharing
- JWT-based user authentication
- Token-based session management
- Message encryption

---

Two ways to clone and run the repo:

## 🐳 Run with Docker (Recommended)

This is the easiest way to get started without installing MongoDB or Node manually.

### 🛠 Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [GNU Make](https://www.gnu.org/software/make/) installed (`make` command)

### Steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/onslaught7/Talkative-2.git
    cd Talkative-2
    ```

2. Create an `.env` file in the `/server` directory:
    ```env
    PORT=3000
    JWT_KEY=Your_Secret_JWT_Key
    ORIGIN=http://localhost
    DATABASE_URL=mongodb://mongo:27017/talkative
    ```

3. Create an `.env` file in the `/client` directory:
    ```env
    VITE_SERVER_URL=http://localhost:3000
    ```

4. Run the app using Docker:
    ```bash
    make compose-up-build
    ```

5. To stop containers:
    ```bash
    make compose-down
    ```

6. To just build images without running:
    ```bash
    make compose-build
    ```

7. Open your browser and visit:
    - Frontend: [http://localhost:80](http://localhost)
    - Backend API: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Manual Installation (Without Docker)

> If you prefer to run it locally with Node.js and MongoDB installed:

### Install & Run Client:
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