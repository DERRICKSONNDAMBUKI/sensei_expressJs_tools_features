const hash = require('pbkdf2-password')()
const path = require('path')

const auth = (req, res) => {
    res.send("This is Auth!");
  }

module.exports = auth