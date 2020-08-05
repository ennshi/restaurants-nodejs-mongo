const jwt = require('jsonwebtoken');

exports.userAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        return res.status(401).json({message: 'Authorization failed'});
    }
    const decodedToken = decodeToken(authHeader, process.env.JWT_KEY);
    if(!decodedToken) {
        return res.status(401).json({message: 'Authorization failed'});
    }
    req.userId = decodedToken.userId;
    next();
};

exports.adminAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        return res.status(401).json({message: 'Authorization failed'});
    }
    const decodedToken = decodeToken(authHeader, process.env.JWT_KEY_A);
    if(!decodedToken) {
        return res.status(401).json({message: 'Authorization failed'});
    }
    req.adminId = decodedToken.adminId;
    next();
};

const decodeToken = (authHeader, key) => {
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, key);
    } catch (err) {
        console.log(err);
    }
    return decodedToken;
};
