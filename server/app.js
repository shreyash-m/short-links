const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const path = require('path')
const routes = require('./api/api_routes')
const auth = require('./middleware/auth')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))
app.use(auth)
app.use('/api/v1',routes)

app.listen(process.env.PORT,() =>{
    console.log(`Server started at ${process.env.PORT}`);
})