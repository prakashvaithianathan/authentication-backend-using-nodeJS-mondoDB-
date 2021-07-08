//for server setup
const express = require('express')
const app = express();
app.use(express.json())

//for path directory
const path =require('path');

//for encrypting password
const dotenv = require('dotenv')
dotenv.config({path:'config/config.env'})

//for sending data from frontend to backend
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

//for connnecting database
const mongoDB = require('./config/database');
mongoDB();

//for routing
const routes = require('./routes')
app.use('/',routes)

//for ejs files
const ejs = require('ejs')
app.set('view engine','ejs')



app.use(express.static('styles'))
app.use(express.static('check'))
app.use(express.static('images'))
app.use(express.static('fonts'))


app.get('/',(req, res)=>{
    res.send('this is home route')
})

app.listen(5000,()=>{
    console.log('server has been started');
})