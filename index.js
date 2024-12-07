require('dotenv').config();
const path=require('path');
const express=require('express');
const app=express();
const bodyParser = require('body-parser');
require('./connection/mongo.connection');
const registrationRoutes=require('./routes/registrantion.route');
const userRoutes=require('./routes/user.route');
const UserAuth=require('./helpers/UserAuth');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine",'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.use('/',registrationRoutes);
app.use('/auth',UserAuth.authenticate,userRoutes);

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Serever is listening at",PORT);
})