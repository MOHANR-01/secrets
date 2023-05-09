require('dotenv').config() ;
const ejs = require("ejs") ;
const express = require("express") ;
const bodyParser = require("body-parser") ;
const mongoose = require("mongoose") ;
const encrypt = require("mongoose-encryption") ;

const app =  express() ;

app.set('view engine', 'ejs') ;

app.use(express.static("public")) ;
app.use(bodyParser.urlencoded({extended: true})) ;


//CONNECTING TO THE DATABASE:
const url = "mongodb://127.0.0.1:27017/usersDB" ;
mongoose.connect(url, {useNewUrlParser: true} ) ;

//CREATING SCHEMA TO THE USER:
const userSchema = new mongoose.Schema({
    email: String ,
    password: String
}) ;


//ENCRYPTION:
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]}) ;


//CREATING THE MODEL TO THE USER SCHEMA:
const User = mongoose.model("User", userSchema) ;



//GET REQUESTS
app.get('/', (req, res) => res.render("home")) ;

app.get('/register', (req, res) => res.render("register")) ;

app.get('/login', (req, res) => res.render("login")) ;


//POST REQUESTS
app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username ,
        password: req.body.password 
    }) ;
    newUser.save()
            .then( () => res.render("secrets"))
            .catch( err => console.log(err) ) ;
}) ;

app.post('/login', (req, res) => {
    const username = req.body.username ;
    const password = req.body.password ;
    User.findOne({email: username})
        .then( foundUser => {
            if (foundUser) 
            {
                if (foundUser.password === password)
                {
                    res.render("secrets")
                }
            }
        })
        .catch( err => console.log(err) ) ;
}) ;






//CREATING THE SERVER:
app.listen(3000, () => console.log("Server Started on port 3000.") ) ;