Networth Tracker API
Overview
The Networth Tracker API is designed to allow users to register, log in, and track their financial details. It uses Hapi.js as the backend framework, Sequelize as the ORM for database management, and JWT for authentication. Swagger is used for API documentation and Redis for caching/rate-limiting.

Features
User Authentication: Register and log in users.
JWT Token-based Authentication: Issue and validate JWT tokens.
Rate Limiting: Limit requests per user to prevent abuse.
Redis Integration: Cache user sessions and manage rate limiting.
API Documentation: Swagger is used to document the available endpoints.
Technologies Used
Hapi.js: Backend framework for building APIs.
Sequelize: ORM for managing database connections and queries.
JWT: JSON Web Token for secure authentication.
Redis: Used for rate limiting and caching.
Swagger: Auto-generated API documentation.
Requirements
Node.js: >= 14.x.x
MySQL: For database storage.
Redis: For caching and rate-limiting.
npm: Node package manager.
Installation
1. Clone the repository
bash
git clone https://github.com/your-username/networth-tracker.git
cd networth-tracker
2. Install Dependencies
bash
npm install
3. Create .env File
You need to create a .env file in the root directory with the following configuration:

.env:
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=networth_tracker
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
4. Configure MySQL
Ensure that MySQL is installed and running on your machine. Create a new database named networth_tracker:

mysql:
CREATE DATABASE networth_tracker;
5. Start Redis
Ensure Redis is running on your machine. You can start Redis with:

bash:
redis-server
6. Start the Server
Run the following command to start the server:

bash:
npm start
If everything is set up correctly, you should see:

shell:
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
Server running on http://localhost:3000
API Documentation
Swagger API documentation is available at http://localhost:3000/documentation.

Example API Routes
POST /v1/users/register: Register a new user.
POST /v1/users/login: User login and token generation.
GET /v1/users/validate-token: Validate the JWT token.
Redis Integration
Redis is used to handle caching and rate limiting. The ioredis package is used to connect and manage Redis within the application.

Redis Configuration
Redis is configured in the application using ioredis. If Redis is not already running on localhost:6379, you can modify this in your .env file or Redis instance in your server.js:

javascript:
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});
Rate Limiting
The app uses hapi-rate-limitor for rate limiting. By default, each user is allowed to make 5 requests per minute. You can customize these settings in the rate limiter configuration within server.js:

javascript:
await server.register({
    plugin: rateLimiter,
    options: {
        enabled: true,
        max: 5,
        duration: 60 * 1000, // Rate limit reset duration
        userLimitAttribute: 'rateLimit'
    },
});
Security
JWT is used to secure the API endpoints. After successful login, the client receives a token that is used to authenticate subsequent requests.

Token Validation: Token is validated via the /v1/users/validate-token endpoint.
Environment Variables: Keep your .env file private, especially the JWT secret.
Troubleshooting
Common Issues
MySQL Connection Issues: Make sure MySQL is installed and the database connection details in your .env file are correct.
Redis Connection Refused: Ensure Redis is installed and running. You can start Redis with redis-server.
Swagger Docs Not Showing APIs: Ensure routes are correctly registered with proper tags. Routes without tags won’t appear in Swagger.
Logs
The server logs useful information to the console. Errors will be displayed with details to help you debug issues.

License
This project is licensed under the MIT License - see the LICENSE file for details.