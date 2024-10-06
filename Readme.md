<h1>Networth Tracker API</h1>

<h2>Overview</h2>
<p>The <strong>Networth Tracker API</strong> is a RESTful service that enables users to register, log in, and track their financial details. It leverages <strong>Hapi.js</strong> as the backend framework, <strong>Sequelize</strong> as the ORM for database management, and <strong>JWT</strong> for authentication. Additional features include API documentation with <strong>Swagger</strong> and caching/rate-limiting with <strong>Redis</strong>.</p>

<hr>

<h2>Features</h2>
<ul>
    <li><strong>User Authentication:</strong> Users can register and log in.</li>
    <li><strong>JWT Token-based Authentication:</strong> Issue and validate JWT tokens securely.</li>
    <li><strong>Rate Limiting:</strong> Prevent abuse by limiting requests per user.</li>
    <li><strong>Redis Integration:</strong> Manage session caching and rate limiting.</li>
    <li><strong>API Documentation:</strong> Auto-generated documentation using Swagger.</li>
</ul>

<hr>

<h2>Technologies Used</h2>
<ul>
    <li><strong>Hapi.js:</strong> Backend framework for building scalable APIs.</li>
    <li><strong>Sequelize:</strong> ORM for database interactions.</li>
    <li><strong>JWT (JSON Web Token):</strong> Secure authentication via tokens.</li>
    <li><strong>Redis:</strong> Caching and rate-limiting tool.</li>
    <li><strong>Swagger:</strong> Auto-generates API documentation.</li>
</ul>

<hr>

<h2>Requirements</h2>
<ul>
    <li><strong>Node.js</strong> (>= 14.x.x)</li>
    <li><strong>MySQL:</strong> For persistent storage.</li>
    <li><strong>Redis:</strong> For caching and rate-limiting.</li>
    <li><strong>npm:</strong> Node package manager.</li>
</ul>

<hr>

<h2>Installation</h2>

<h3>1. Clone the Repository</h3>
<pre><code>
git clone https://github.com/your-username/networth-tracker.git
cd networth-tracker
</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>
npm install
</code></pre>

<h3>3. Create <code>.env</code> File</h3>
<p>Create a <code>.env</code> file in the project’s root directory with the following configuration:</p>
<pre><code>
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=networth_tracker
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
</code></pre>

<h3>4. Configure MySQL</h3>
<p>Ensure MySQL is installed and running. Create the database:</p>
<pre><code>
CREATE DATABASE networth_tracker;
</code></pre>

<h3>5. Start Redis</h3>
<p>Ensure Redis is running. Start Redis with:</p>
<pre><code>
redis-server
</code></pre>

<h3>6. Start the Server</h3>
<p>Start the server using:</p>
<pre><code>
npm start
</code></pre>
<p>If successful, you should see:</p>
<pre><code>
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
Server running on http://localhost:3000
</code></pre>

<hr>

<h2>API Documentation</h2>
<p>You can access the Swagger-generated API documentation at:</p>
<pre><code>http://localhost:3000/documentation</code></pre>

<hr>

<h2>Example API Routes</h2>
<ul>
    <li><strong>POST</strong> <code>/v1/users/register</code>: Register a new user.</li>
    <li><strong>POST</strong> <code>/v1/users/login</code>: User login and token generation.</li>
    <li><strong>GET</strong> <code>/v1/users/validate-token</code>: Validate JWT token.</li>
</ul>

<hr>

<h2>Redis Integration</h2>
<p>Redis is used for caching sessions and managing rate limiting via the <code>ioredis</code> package. Redis configuration is managed in <code>server.js</code>:</p>
<pre><code>
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});
</code></pre>

<h3>Rate Limiting</h3>
<p>Using <code>hapi-rate-limitor</code>, the app restricts users to 5 requests per minute by default:</p>
<pre><code>
await server.register({
    plugin: rateLimiter,
    options: {
        enabled: true,
        max: 5,
        duration: 60 * 1000, // 1 minute
        userLimitAttribute: 'rateLimit'
    },
});
</code></pre>

<hr>

<h2>Security</h2>
<ul>
    <li><strong>JWT Authentication:</strong> Secure API endpoints with JWT tokens.</li>
    <li><strong>Token Validation:</strong> Use <code>/v1/users/validate-token</code> to verify tokens.</li>
    <li><strong>Environment Variables:</strong> Keep sensitive information (like JWT secrets) in your <code>.env</code> file.</li>
</ul>

<hr>

<h2>Troubleshooting</h2>

<h3>Common Issues</h3>
<ul>
    <li><strong>MySQL Connection Issues:</strong> Double-check MySQL is installed and your <code>.env</code> credentials are correct.</li>
    <li><strong>Redis Connection Refused:</strong> Ensure Redis is installed and running.</li>
    <li><strong>Swagger Docs Not Showing APIs:</strong> Verify that routes are registered with the proper tags.</li>
</ul>

<hr>

<h2>Logs</h2>
<p>Server logs provide useful insights and error details for easier debugging.</p>

<hr>

<h2>License</h2>
<p>This project is licensed under the <strong>MIT License</strong>. See the <a href="LICENSE">LICENSE</a> file for more details.</p>
