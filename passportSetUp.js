const passport = require("passport");
const { User } = require("./models/userModel");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const localStrategy =require('passport-local').Strategy
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/cb",
      passReqToCallback: false,
    },
    (accessToken, refreshToken, profile, done) => {
      if (!profile.email) {
        return done(new Error("email not provided by google"));
      }
      const findOrCreateUser = async () => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          } else {
            const newUser = new User({
              email: profile.email,
              googleId: profile.id,
              authenticationMethod: "google",
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (err) {
          return done(err, null);
        }
      };

      findOrCreateUser();
    }
  )
);

passport.use(new localStrategy(
  {
    usernameField: "email",
},
async (email, password, done)=>{
  try{
    const user = await User.findOne({email: email})
    if(!user){
      return done(null,false,{message: 'Incorrect email'})
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
      return done(null,false,{message: 'Incorrect password'})
    }
    return done(null,user)
  }catch(err){
    return done(err)
  }
}))