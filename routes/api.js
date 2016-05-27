/**
 * Created by eidan on 19/05/2016.
 */

var express = require('express');
var router = express.Router();


//import mongoose and Post model
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

//Our Own Middleware - we want to allow anyone to read posts,
//but modifying and creating new posts is exclusively for registered users
//next mean next middleware in line between me and the request handler

//Used for routes that must be authenitacated
function isAuthenticated(req, res, next){
    //if user is authenticated in the session, call the next() request handler

    //allow all the get request methods
    if(req.method === "GET"){
        //continue to the next middleware request handler
        return next();
    }
    if(!req.isAuthenticated()){
        //user not authenticated, redirect to login page
        console.log("user is not authenticated");
        return res.redirect('/#login');
    }
    //user authenticated continue to next middleware or handler
    return next();
};

//register the authentication middleware
router.use('/posts', isAuthenticated);


/*Start api for all  posts*/
router.route('/posts')

    //return all posts
    .get(function(req, res) {
        //find() return all the posts from db
        Post.find(function (err, posts) {
            if (err) {
                return res.send(500, err);
            }
            //send back collection from data base
            console.log("All the posts at db:\n" + posts);
            return res.send(posts);
        });
    })
    //Create a new posts
    .post(function(req,res) {
        //create a new post
        var post = new Post();
        //set the text and username to the post
        post.text = req.body.text;
       // debugger;
        post.username = req.body.created_by;
        //save the new post to db
        //When the callback is executed we know that the post has been saved
        //and we can respond successfully with the saved post body back to the client:
        post.save(function (err, post) {
            if (err) {
                return res.send(500, err);
            }
            //return the post object that created
            console.log("The new post is:\n" + post);
            return res.json(post);
        });
    });
/*End api for all  posts*/

/*Start api for a specific post*/
router.route('/posts/:id')

    //get (returns) a specific post with ID by using params.id
    .get(function (req, res) {
        console.log("GET -- get specific post with ID: " + req.params.id);
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            }
            //return the post object that with the specific id
            res.json(post);
        })
    })

    //update specific post with ID by using params
    //modify the the existing document with the data provided in the request body and save it
    .put(function (req, res) {
        console.log("PUT -- modify specific post with ID: " + req.params.id);
        //find the specific post
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            }
            //connect the text and username to the post
            post.username = req.body.created_by;
            post.text = req.body.text;
            //save the new post to the db
            post.save(function (err, post) {
                if (err) {
                    res.send(err);
                }
                ///return the post object that updated
                res.json(post);
            });
        });
    })

    //delete specific post with ID by using params
    .delete(function (req, res) {
        console.log("DELETE -- delete specific post with ID: " + req.params.id);
        Post.remove({_id: req.params.id}, function (err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

/*End api for a specific post*/


//Export The Router Module
module.exports = router;





