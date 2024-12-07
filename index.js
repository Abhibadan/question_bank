require('dotenv').config();
const path=require('path');
const express=require('express');
const app=express();
const bodyParser = require('body-parser');
require('./connection/mongo.connection');
const registrationRoutes=require('./routes/registrantion.route');
const userRoutes=require('./routes/user.route');
const categoryRoutes=require('./routes/category.route');
const questionRoutes=require('./routes/question.route');
const UserAuth=require('./helpers/UserAuth');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname, 'public')));
 const Router = express.Router();

app.use('/',registrationRoutes);
app.get('/dashboard',(req,res)=>{
    return res.render("home")
})
app.get('/profile',(req,res)=>{
    return res.render("profile")
})
Router.use('/auth',userRoutes);
Router.use('/category',categoryRoutes);
Router.use('/question',questionRoutes);

// Applying middleware to protect routes with JWT token authentication
app.use('/',UserAuth.authenticate,Router)

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Serever is listening at",PORT);
})