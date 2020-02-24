const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport Requirement
require('./config/passport')(passport);
//DB Config
const db = require('./config/keys').MongoURI;

//Connect with Mongo
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology: true})
    .then(()=>console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//EJS

app.use(expressLayout);
app.set('view engine', 'ejs');

//body Parsers
app.use(express.urlencoded({extended:false}));

//Middleware
//Express Session
app.use(session({
    secret: 'fahimsSerect',
    resave: true,
    saveUninitialized: true
}));
//initializeSessionBy using Passport
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());
//Global variable
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//PORT activate
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Start on ${PORT}`));