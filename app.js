const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const passportSetup = require('./auth.js')
require("dotenv").config();
const userRouter = require("./routes/userRoute");
//const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
//app.use(cookieParser());


app.use(session({ 		//Usuage
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


//Database connection
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));

//userouter
app.use('/auth', userRouter)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
