// authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../../modles/user');

// Define the middleware function correctly
const userAuth = async (req, res, next) => {
   
    try {
        const cookies = req.cookies;
        if (!cookies) {
            return res.status(401).send('Please login again');
        }

        const { authToken } = cookies;
        if (!authToken) {
            return res.status(401).send('Please login again');
        }

        const message = jwt.verify(authToken, "krishna");
        const { _id } = message;
        if (!_id) {
            return res.status(404).send('User Not Found');
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send('User Not Found');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).send('Unauthorized');
    }
};

module.exports = { userAuth };
