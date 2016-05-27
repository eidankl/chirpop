/**
 * Created by eidan on 16/05/2016.
 * creates the middleware authentication handlers to the Passport specification
 * and exports it as a module
 */

//add mongoose and grab the Users schema
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions

    //serialization handler
    //Serialize into a session we need to provide the key username
    passport.serializeUser(function(user, done) {
        console.log('serializing user:', user._id);
        //return the user name - tell passport which id to use for user
        return done(null, user._id);
    });

    //return a User given a key
    //Deserialize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            console.log('deserialize user:', user);
            if(err){
                return done(err, false);
            }
            if(!user){
                return done('user not found', false);
            }
            //we found the user object with this user name so provide it back to passport
            return done(null, user);
        });
    });

    /*Start Login API*/
    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        //the call back will provide us either with and error err or the user
        function(req, username, password, done) {
            //check if user name already exist
            //findOne()  finds the first element that matches the query.
            User.findOne({username: username}, function(err,user){
                // In case of any error, return using the done method
                if(err){
                    return done(err, false);
                }
                // Username does not exist, log the error and redirect back
                if(!user){
                    console.log('User Not Found with username: ' + username);
                    return done('User Not Found with username: ' + username, false);
                }
                // User exists but wrong password, log the error
                if(!isValidPassword(user, password)){
                    //wrong password
                    console.log('Invalid Password for user: ' + username);
                    return done('Incorrect password for username: ' + username, false); // redirect back to login page
                }
                //successfully login - User and password both match, return user from done method
                return done(null, user);
            });
        }
    ));
    /*End Login API*/




    /*Start Sign Up API*/
    passport.use('signup', new LocalStrategy({
            passReqToCallback  : true // allows us to pass back the entire request to the callback
        },
        //the callback
        function(req, username, password, done) {
            // find a username object in mongo with provided username
            User.findOne({username: username}, function (err, user) {
                //// In case of any error, return using the done method
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err, false);
                }
                //check if the user already exist
                if (user) {
                    //this user already exist
                    console.log('User already exists with username: ' + username);
                    return done('User already exists with username:' + username, false);
                }

                // if there is no user, create the new user
                var user = new User();
                // set the user's local credentials
                user.username = username;
                user.password = createHash(password);
                // save the user
                user.save(function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    console.log("user name " + username + " sign in Successfully");
                    //return done(null,user)--> null mean that don't have an error
                    //debugger;
                    return done(null, user);
                });

            });
        })
    );
    /*End Sign Up API*/


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};








