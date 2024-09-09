const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());
app.use( (req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control','no-cache');
    next();
});
const productRoutes = require('./routes/product');
const Login = require('./routes/Login')
const Me = require('./routes/ME')
const Signup = require('./routes/Signup')
const Profile = require('./routes/Profile');
app.use('/signUp',Signup)

app.use('/me',Me)
app.use('/products', productRoutes);
app.use('/profile', Profile);

app.use('/login',Login)
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(3007,  () => {
    console.log('Server is running on http://0.0.0.0:3007');
});
