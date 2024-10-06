const Hapi = require('@hapi/hapi');
require('dotenv').config()
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const bcrypt = require('bcrypt');
const Joi = require('joi'); // for validation
const User = require('./models/User'); // Sequelize model for users
const { connectDB } = require('./config/database'); // Sequelize DB setup
const { validateToken, generateToken } = require('./helper/JwTValidation');
const rateLimiter = require('hapi-rate-limitor');
const Redis = require('ioredis');
const redis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            validate: {
                failAction: 'log' // Logs the validation errors
            }
        }
    });

    // Global rate limiter setup
    await server.register({
        plugin: rateLimiter,
        options: {
            enabled: true,
            max: 30,               // Allow 30 requests
            duration: 60 * 1000,   // Every minute
            userLimitAttribute: 'rateLimit',
            redis // Pass the redis client instance
        },
    });
    
    // Swagger documentation setup
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Networth Tracker API Documentation',
                    version: '1.0.0'
                },
                basePath: '/v1', // Specify your API base path here
                tags: [
                    { name: 'users', description: 'User related endpoints' },
                    // Add other tags as necessary
                ],
            }
        }
        
    ]);

    // User registration route
    server.route({
        method: 'POST',
        path: '/v1/users/register',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).required(),
                })
            },
            handler: async (request, h) => {
                const { name, email, password } = request.payload;
    
                try {
                    const existingUser = await User.findOne({ where: { email } });
                    if (existingUser) {
                        return h.response({ error: 'Email already registered' }).code(400);
                    }
    
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await User.create({ name, email, password: hashedPassword });
    
                    // Cache the user data in Redis
                    await redis.set(`user:${user.id}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
    
                    const token = generateToken(user);
                    return h.response({ user, token }).code(201);
                } catch (error) {
                    console.error(error);
                    return h.response({ error: 'Unable to create user' }).code(500);
                }
            },
            tags: ['api', 'users'],
        }
    });
    
    // Login route
    server.route({
        method: 'POST',
        path: '/v1/users/login',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).required(),
                })
            },
            handler: async (request, h) => {
                const { email, password } = request.payload;
    
                try {
                    // Check Redis cache first
                    const cachedUser = await redis.get(`user:${email}`);
                    let user;
    
                    if (cachedUser) {
                        user = JSON.parse(cachedUser);
                    } else {
                        // If not found in cache, look in the database
                        user = await User.findOne({ where: { email } });
                        if (!user) {
                            return h.response({ error: 'Invalid email or password' }).code(401);
                        }
                        // Cache the user data for future requests
                        await redis.set(`user:${user.id}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
                    }
    
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return h.response({ error: 'Invalid email or password' }).code(401);
                    }
    
                    const token = generateToken(user);
                    return h.response({ message: 'Login successful', token }).code(200);
                } catch (error) {
                    console.error(error);
                    return h.response({ error: 'Login failed' }).code(500);
                }
            },
            tags: ['api', 'users'],
        }
    });
    
    // Token validation route using Redis
    server.route({
        method: 'GET',
        path: '/v1/users/validate-token',
        options: {
            handler: async (request, h) => {
                    try {
                        const token = request.headers.authorization.split(' ')[1];
                        const sessionData = await redis.get(`session:${token}`);

                        if (!sessionData) {
                            return h.response({ message: 'Invalid or expired token' }).code(401);
                        }

                        return h.response({ message: 'Token is valid!' }).code(200);
                    } catch (error) {
                        console.error(error);
                        return h.response({ error: 'Token validation failed' }).code(500);
                    }
            },
            tags: ['api', 'users'],
        }
    });

    // Connect to the database
    await connectDB();

    // Start the server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
