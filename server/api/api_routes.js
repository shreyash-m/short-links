const express = require('express')
const {signup,login,generate_link,get_all_links,process_link} = require('./api_controller')
const upload = require('../config/fileUploadService')

const routes = express.Router()

routes.post('/signup',signup)
routes.post('/login',login)
routes.get('/get_all_links',get_all_links)
routes.get('/process_link/:id',process_link)
routes.post('/generate_link',upload.single('file'),generate_link)

module.exports = routes