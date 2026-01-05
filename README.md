# Cube - Full-Stack Management Platform

Welcome to Cube, a comprehensive full-stack application designed to provide a robust and scalable management solution. This project is built with a modern technology stack, featuring a Java-based backend powered by Spring Boot and a sleek, responsive frontend built with React and Vite.

## Project Structure

The Cube project is organized as a multi-module Maven project for the backend, and a separate Vite project for the frontend. This separation of concerns allows for independent development, testing, and deployment of the frontend and backend components.

### Backend Modules (`/`)

The backend is a set of interconnected Maven modules, each with a specific responsibility:

*   **`cube-server`**: The main application module. It contains the Spring Boot application entry point and orchestrates the other backend modules. This is the runnable part of the backend.
*   **`cube-api`**: Defines the public API interfaces for the services provided by the backend.
*   **`cube-common`**: A library of common utilities, data structures, and helper classes shared across all backend modules.
*   **`cube-system`**: Contains all modules related to system management, such as user authentication, authorization, and other core system functionalities.
    *   `cube-system-api`: Defines the interfaces for the system module.
    *   `cube-system-core`: The implementation of the system module.
*   **`cube-workflow`**: A lightweight, event-driven workflow engine that allows for the creation of complex business processes.

### Frontend Application (`/cube-ui`)

The frontend is a modern single-page application (SPA) built with:

*   **React**: A popular JavaScript library for building user interfaces.
*   **Vite**: A next-generation frontend tooling that provides a faster and leaner development experience.
*   **Material-UI (MUI)**: A comprehensive suite of UI tools to help you ship new features faster.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.

## Getting Started

### Prerequisites

*   Java 17+
*   Maven 3.6+
*   Node.js 18+
*   npm/yarn

### Backend

1.  Navigate to the root directory of the project.
2.  Build the entire project using Maven:
    ```bash
    mvn clean install
    ```
3.  Run the `cube-server` application:
    ```bash
    java -jar cube-server/target/cube-server.jar
    ```

### Frontend

1.  Navigate to the `cube-ui` directory:
    ```bash
    cd cube-ui
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:5173`.

## Contributing

We welcome contributions! Please see the `CONTRIBUTING.md` file for details on how to contribute to the project.