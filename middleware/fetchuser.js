const { json } = require('express/lib/response');
var jwt = require('jsonwebtoken');
const JWT_Secret = 'thsi@isavrey$sceret';

const fetchuser = (req, res, next) => {

    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "token is not valid"});
    }

    try {
        const data = jwt.verify(token, JWT_Secret);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "Internal server error"});
    }

    
}


module.exports = fetchuser;