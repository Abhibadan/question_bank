require('dotenv').config();
const express=require('express');
const app=express();
const session=require('express-session');
const bodyParser = require('body-parser');
require('./connection/mongo.connection');
const registrationRoutes=require('./routes/registrantion.route');
const {getUser}=require('./controllers/user.controller')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine",'ejs');
// Configure session middleware
app.use(
    session({
      secret: 'your-secret-key', 
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (e.g., 1 day)
      },
    })
  );

app.get('/',getUser)
app.use('/registration',registrationRoutes);

app.listen(3002,()=>{
    console.log("Serever is listening")
})