const express = require("express");
const passport = require('passport')
const {
    homepage,
    signUp_post,
    login,
    dashboard
} = require("../controllers/userController");
const route = express.Router();


route.get("/home",homepage)
route.post("/signup", signUp_post);
route.get("/login", login);

route.get("/google",passport.authenticate('google', {
    scope: ['email', 'profile']
}))

route.get('/google/cb', passport.authenticate('google',{
    successRedirect:'/auth/dashboard',
        failureRedirect: '/auth/login',
    //res.send(req.user)
}))
route.get("/dashboard",dashboard)

module.exports = route