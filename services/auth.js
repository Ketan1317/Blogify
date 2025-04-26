const JWT = require("jsonwebtoken");
const Secret = "@okok&ketan##1317$123";

function createToken(user){
    const payload = {
        _id:user._id,
        username:user.username,
        email:user.email,
        role:user.role,
        url:user.imageUrl
    }
    const token = JWT.sign(payload,Secret);
    return token;
}

function verifyToken(token){
    const payload = JWT.verify(token,Secret);
    return payload;
}

module.exports = {createToken,verifyToken};