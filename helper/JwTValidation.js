const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const validateToken = (request, h) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return h.response({ error: 'Unauthorized' }).code(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        return h.continue;
    } catch (error) {
        return h.response({ error: 'Invalid token' }).code(401);
    }
};

module.exports = { validateToken, generateToken }