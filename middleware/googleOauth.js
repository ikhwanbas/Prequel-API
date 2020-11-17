var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.serializeUser(function (user, done) {
    return done(null, user);
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '516244174897-tqbj9qhkomvlij837fat694s7mb24ljv.apps.googleusercontent.com',
    clientSecret: 'tThXCOEo51I35Al9K28G3f6k',
    callbackURL: "http://ec2-3-1-218-225.ap-southeast-1.compute.amazonaws.com/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        // use the profile info (mainly profile id) to check if the user is registered in database
        return done(null, profile);
    }
));

module.exports = passport;