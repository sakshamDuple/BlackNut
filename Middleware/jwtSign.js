const jwt = require("jsonwebtoken")

exports.generateAccessToken = (user) => { 
    console.log(user,process.env.ACCESS_TOKEN_KEY,{expiresIn: '60m' })
    return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {expiresIn: '60m' }) 
}