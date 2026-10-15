# CareerConnect — Job & Internship Portal

CareerConnect is a full-stack web application designed to connect job seekers with job and internship opportunities. It provides a platform to explore opportunities, submit applications, and manage recruitment activities through dedicated dashboards.

## Features

- **Job Listings:** Browse available jobs and internships.
- **Job Search:** Search and filter opportunities using relevant criteria.
- **Job Details:** View information about individual opportunities.
- **Application Management:** Submit and manage job applications.
- **User Authentication:** Backend authentication and role-based access configuration.
- **Recruiter Dashboard:** Manage recruitment activities.
- **Student Dashboard:** Access student-focused application features.
- **REST APIs:** Spring Boot backend endpoints for application functionality.

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- Maven
- MySQL

### Frontend
- React
- JavaScript
- Vite
- HTML
- CSS

## Project Structure

```text
career_connct/
├── careerconnect/             # Spring Boot backend
│   ├── src/
│   └── pom.xml
├── careerconnect-frontend/    # React frontend
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Java Development Kit (JDK)
- Maven, or use the included Maven Wrapper
- Node.js and npm
- MySQL Server

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd career_connct
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's actual URL.

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd careerconnect
```

Configure your MySQL connection using local environment variables or a local configuration file. Never commit database passwords or other secrets to GitHub.

Ensure the configured database exists before starting the application.

Run the backend:

```bash
.\mvnw.cmd spring-boot:run
```

The backend will start on the port configured in `application.properties`.

### 3. Configure and Run the Frontend

Open another terminal from the repository root:

```bash
cd careerconnect-frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

Ensure the frontend API configuration points to the running backend.

## API Testing

Backend REST APIs can be tested using Postman. Swagger UI can also be added or used if configured in the application.

## Current Status

CareerConnect is under active development. Features and configuration may evolve as the project grows.

## Future Improvements

- Complete and strengthen authentication and authorization.
- Improve job application workflows.
- Add resume upload and management.
- Add pagination and advanced filtering to job listings.
- Containerize the application using Docker.
- Deploy the frontend and backend.

## Author

Developed as a full-stack learning and portfolio project.
