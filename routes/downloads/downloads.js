const route = require('express').Router()

//controllers
const { download, files } = require('../../controllers/downloads')

route.get('/',download)
route.get('files/:file(*)',files)

module.exports = route