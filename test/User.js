const Hapi = require('@hapi/hapi');
const User = require('./models/user');
const bcrypt = require('bcrypt');

jest.mock('./models/user');

describe('User API Tests', () => {
   let server;

   beforeAll(async () => {
       server = Hapi.server({ port: 4000 });
       // Add routes here
   });

   it('should create a new user', async () => {
       User.create.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com' });

       const response = await server.inject({
           method: 'POST',
           url: '/users',
           payload: {
               name: 'John Doe',
               email: 'john@example.com',
               password: 'password123',
           },
       });

       expect(response.statusCode).toBe(201);
       expect(response.result).toHaveProperty('id');
   });
});
