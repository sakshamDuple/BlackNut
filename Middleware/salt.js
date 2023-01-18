const bcrypt = require('bcrypt')

exports.hashPassword = async (plaintextPassword) =>    {
    return bcrypt.hash(plaintextPassword, 10)
        .then(hash => {
            console.log("hash",hash)
            // Store hash in the database
            return hash
        })
        .catch(err => {
            console.log(err)
        })
}

exports.hashCompare = async (passwordFromLogin, passwordFromId) => {
    return bcrypt.compare(passwordFromLogin, passwordFromId)
        .then(bool => {
            return bool
        })
        .catch(err => {
            console.log(err)
        })
}