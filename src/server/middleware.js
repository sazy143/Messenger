const jwt = require('jsonwebtoken');
const secret = 'secret';

const withAuth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    
    if(!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                console.log('valid');
                req.username = decoded.username;
                next();
            }
        });
    }
}

module.exports = withAuth;