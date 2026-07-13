# Cube - Enterprise Full-Stack Management Platform

[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.1-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, enterprise-grade full-stack management platform built with Spring Boot 4 and React, featuring advanced security, workflow automation, and comprehensive system management capabilities.

## 🌟 Key Features

- **🔐 Enterprise Security**: Spring Security integration with BCrypt password encryption, JWT authentication, and comprehensive audit logging
- **🔄 Event-Driven Workflow**: Lightweight workflow engine supporting complex business process automation
- **🛡️ Data Protection**: Built-in data masking for sensitive information (passwords, emails, phone numbers)
- **🔒 Configuration Encryption**: Jasypt integration for encrypting sensitive configuration values
- **📊 System Monitoring**: Comprehensive logging with request/response tracking and IP detection
- **🎨 Modern UI**: React-based responsive interface with Material-UI components
- **🏗️ Modular Architecture**: Clean separation of concerns with multi-module Maven structure

## 📁 Project Structure

```
cube/
├── cube-server/          # Main Spring Boot application (entry point)
├── cube-api/             # API layer with controllers and aspects
│   ├── annotation/       # Custom annotations (SysLog, SensitiveField, etc.)
│   ├── aspect/           # AOP aspects (logging, masking)
│   └── config/           # Security, CORS, JWT configuration
├── cube-common/          # Shared utilities and common code
│   ├── entity/           # Common entities (CubeResponse, pagination)
│   ├── enums/            # System-wide enumerations
│   └── utils/            # Utility classes (SensitiveDataMasker, etc.)
├── cube-system/          # System management module
│   ├── cube-system-api/  # System API interfaces
│   └── cube-system-core/ # User, auth, and log implementations
├── cube-workflow/        # Event-driven workflow engine
│   ├── event/            # Event definitions
│   ├── handler/          # Task handlers
│   └── engine/           # Workflow execution engine
└── cube-ui/              # React frontend (Vite + TypeScript)
```

## 🚀 Quick Start

### Prerequisites

- **Java**: 17 or higher
- **Maven**: 3.6+
- **Node.js**: 18+
- **PostgreSQL**: 12+ (or any compatible database)
- **Git**: For version control

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cube.git
cd cube
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE cube;
CREATE USER cube_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cube TO cube_user;
```

### 3. Configuration

#### Set Environment Variables

```bash
# Jasypt encryption password (REQUIRED)
export JASYPT_ENCRYPTOR_PASSWORD="cube-secret-key-2026"
```

#### Configure Database (Optional)

If you haven't encrypted your database credentials yet:

1. Run the encryption tool:
   ```bash
   mvn test -Dtest=JasyptEncryptorTest#encryptDatabaseConfig
   ```

2. Copy the encrypted values to `cube-server/src/main/resources/application-dev.yml`

See [JASYPT_ENCRYPT_GUIDE.md](JASYPT_ENCRYPT_GUIDE.md) for detailed instructions.

### 4. Build and Run Backend

```bash
# Build the entire project
mvn clean install

# Run the application
cd cube-server
mvn spring-boot:run

# Or run the JAR directly
java -jar target/cube-server-0.0.1-SNAPSHOT.jar
```

The backend will start at `http://localhost:8080`

### 5. Build and Run Frontend

```bash
cd cube-ui
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration Guide

### Application Profiles

- `application.yml` - Base configuration
- `application-dev.yml` - Development environment (encrypted database credentials)
- `application-prod.yml` - Production environment (create as needed)

### Security Configuration

The project uses multiple layers of security:

1. **Password Encryption**: BCrypt with strength 10
2. **JWT Authentication**: Stateless token-based auth
3. **Data Masking**: Automatic masking in logs and responses
4. **Configuration Encryption**: Jasypt for sensitive config values

See [SECURITY_USAGE_GUIDE.md](SECURITY_USAGE_GUIDE.md) for comprehensive security documentation.

### Jasypt Encryption

To encrypt any configuration value:

```bash
# Using the test utility
mvn test -Dtest=JasyptEncryptorTest#encryptCustomValue

# Using Maven plugin
mvn jasypt:encrypt-value \
  -Djasypt.encryptor.password="cube-secret-key-2026" \
  -Djasypt.plugin.value="your-secret-value"
```

Use encrypted values in YAML:

```yaml
spring:
  datasource:
    password: ENC(encrypted_value_here)
```

## 🏗️ Architecture Overview

### Backend Technology Stack

- **Framework**: Spring Boot 4.0.1
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA with Hibernate
- **Database**: PostgreSQL (configurable)
- **Encryption**: Jasypt, BCrypt
- **Validation**: Jakarta Validation
- **Logging**: SLF4J with Logback
- **AOP**: AspectJ for cross-cutting concerns

### Frontend Technology Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context/Hooks
- **HTTP Client**: Axios

### Key Design Patterns

- **Layered Architecture**: Clear separation between controller, service, and repository layers
- **AOP**: Cross-cutting concerns (logging, security, data masking)
- **Event-Driven**: Asynchronous workflow processing
- **Builder Pattern**: Complex object construction
- **Strategy Pattern**: Flexible data masking strategies

## 🔐 Security Features

### Password Security

- BCrypt hashing with automatic salting
- Configurable strength (default: 10)
- Never stored or logged in plaintext

### Data Masking

Automatic masking of sensitive data in:
- System logs (file and database)
- API responses
- Error messages

Supported data types:
- Passwords: `******`
- Emails: `u***@example.com`
- Phone numbers: `138****5678`
- Custom patterns via annotations

### Audit Logging

Comprehensive audit trail including:
- User operations
- IP address tracking (supports proxy detection)
- Request/response parameters (masked)
- Execution time and status

## 🔄 Workflow Engine

The built-in workflow engine supports:

- Event-driven task execution
- Asynchronous processing
- Task chaining and dependencies
- Error handling and retry logic
- Request tracking and monitoring

Example workflow:

```java
UserCreateTask → WelcomeEmailTask → ActivationTask → EndTask
```

## 📊 API Documentation

### Authentication Endpoints

```
POST /api/auth/login     # User login
POST /api/auth/register  # User registration
POST /api/auth/logout    # User logout
```

### User Management

```
GET    /api/users        # List all users
GET    /api/users/{id}   # Get user by ID
POST   /api/users        # Create new user
PUT    /api/users/{id}   # Update user
DELETE /api/users/{id}   # Delete user
```

### System Logs

```
GET /api/logs            # Query system logs
```

All responses follow the unified format:

```json
{
  "code": 200,
  "message": "Success",
  "data": { ... }
}
```

## 🧪 Testing

### Run All Tests

```bash
mvn test
```

### Run Specific Test Class

```bash
mvn test -Dtest=JasyptEncryptorTest
```

### Frontend Tests

```bash
cd cube-ui
npm test
```

## 📝 Development Guidelines

### Code Style

- Use Java 17 features (var, pattern matching, records)
- Follow Spring Boot best practices
- Write self-documenting code with clear naming
- Add comprehensive Javadoc for public APIs

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit with meaningful messages
git commit -m "feat: add user profile feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build/tooling changes

## 🐛 Troubleshooting

### Common Issues

**Issue**: Application fails to start with "Failed to decrypt" error
**Solution**: Ensure `JASYPT_ENCRYPTOR_PASSWORD` environment variable is set correctly

**Issue**: Database connection refused
**Solution**: Check PostgreSQL is running and credentials in `application-dev.yml` are correct

**Issue**: Frontend can't connect to backend
**Solution**: Verify CORS configuration in `CorsConfig.java` allows your frontend origin

### Enable Debug Logging

```yaml
logging:
  level:
    com.cube: DEBUG
    org.springframework.security: DEBUG
```

## 📚 Additional Resources

- [Jasypt Encryption Guide](JASYPT_ENCRYPT_GUIDE.md)
- [Security Usage Guide](SECURITY_USAGE_GUIDE.md)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Cube Team** - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React community for the amazing ecosystem
- All contributors who have helped shape this project

## 📞 Support

For support, email support@example.com or create an issue in the GitHub repository.

---

**Built with ❤️ using Spring Boot and React**