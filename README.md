# Full-Stack React To-Do Dashboard (Frontend)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

Welcome to the frontend of my To-Do Dashboard application! This repository contains the complete user-facing client, built with React. It provides a clean, responsive, and intuitive interface for users to securely manage their tasks.

---

### 🚀 Live Demo

The application is fully deployed and stable. You can test the live version here:

**➡️ [https://to-do-full-stack-tudm.vercel.app](https://to-do-full-stack-tudm.vercel.app)**

---

### 🏛️ Project Architecture

This is the frontend client within a complete full-stack architecture. It is decoupled from the backend, communicating via a RESTful API. This separation of concerns is a modern web development best practice.

*   **This Frontend (Client)**: Built with React and deployed on **Vercel**.
*   **Backend API**: **https://github.com/Harshithk951/todo-backend.git**

`[React Frontend on Vercel] <--- HTTPS Requests ---> [Node/Express API on Render] <--- SSL Connection ---> [MySQL Database on Aiven]`

---

### ✨ Core Features

*   **Secure User Authentication**: Full registration and login flow using JWT (JSON Web Tokens). User sessions are securely managed, and the UI dynamically adapts based on login status.
*   **Protected Routes**: The main dashboard is a protected route, accessible only after a successful login, ensuring user data privacy.
*   **Dynamic To-Do Management**: A full CRUD (Create, Read, Update, Delete) interface allows authenticated users to manage their personal to-do lists in real-time.
*   **Responsive Design**: The UI is designed to be functional and visually appealing across all devices, from mobile phones to desktops.
*   **Environment-Driven Configuration**: The API URL is loaded from environment variables (`REACT_APP_API_URL`), meaning no hardcoded secrets and seamless transition between local development and production.

---

### 🛠️ Detailed Tech Stack

| Category              | Technology / Library                                       | Purpose                                                      |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **Core Framework**    | **React**                                                  | Building the component-based user interface.                 |
| **Routing**           | **React Router DOM**                                       | For client-side routing and enabling navigation between views. |
| **State Management**  | **React Hooks (`useState`, `useEffect`)**                  | Managing component state and side effects (like API calls).  |
| **API Communication** | **Fetch API**                                              | Making asynchronous HTTP requests to the backend API endpoints. |
| **Styling**           | **[e.g., Custom CSS Modules / Material-UI / Tailwind CSS]**  | _(Describe your styling approach here)_                       |
| **Linting**           | **ESLint**                                                 | Enforcing code quality and catching errors during development. |
| **Deployment**        | **Vercel**                                                 | Continuous deployment platform for the frontend.             |
| **Version Control**   | **Git & GitHub**                                           | Source code management and collaboration.                    |

---

### ⚙️ Local Setup and Installation

To run this project on your local machine:

1.  **Clone the Repository:**
    ```sh
    git clone https://github.com/Harshithk951/To-Do-Full-Stack.git
    cd To-Do-Full-Stack
    ```
2.  **Install Dependencies:**
    ```sh
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project and add the following line. This is crucial for connecting the frontend to your local backend server.
    ```
    REACT_APP_API_URL=http://localhost:3001
    ```
4.  **Run the Application:**
    This will start the React development server, usually on `http://localhost:3000`.
    ```sh
    npm start
    ```
    *Note: For the application to be fully functional, the [backend server](https://github.com/Harshithk951/todo-backend.git) must also be running locally.*
