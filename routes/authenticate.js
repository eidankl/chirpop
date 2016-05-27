/**
 * Created by eidan on 19/05/2016.
 * Authenticate.js will be written as a router,
 * similar to api.js except it will expose a function
 * that will take the passport module and return the router:
 */

var express = require('express');
var router = express.Router();

module.exports = function(passport) {

    //sends successful login state back to angular
    router.get('/success', function (req, res) {
        console.log('*****************Success with user: ' + req.user.username);
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/failure', function (req, res) {
        console.log('Failure with username: ' + + req.user.username);
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

    //log in -call the passport.authenticate Startegy login that we made at passport-init.js
    router.post('/login', passport.authenticate('login', {
        //On Success redirect the client to authentication success
        successRedirect: '/auth/success',
        //On Failure redirect the client to authentication failure
        failureRedirect: '/auth/failure'
    }));

    //Sign Up - call the passport.authenticate Startegy signup that we made at passport-init.js
    router.post('/signup', passport.authenticate('signup', {
        //On Success redirect the client to authentication success
        successRedirect: '/auth/success',//////////////////////HERE IS  MY PROBLAM
        //On Failure redirect the client to authentication failure
        failureRedirect: '/auth/failure'
    }));
    //console.log('********************sign up**********');


    //log out -
    router.get('/signout', function(req, res) {
        console.log('**sign out**********');
        req.logout();
        res.redirect('/');
    });

    //return the router object that express use
    return router;


}







