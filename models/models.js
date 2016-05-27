/**
 * Created by eidan on 16/05/2016.
 * use mongoose as our Object Data Mapper that will allow us to specify a schema for our Post and User objects
 */

var mongoose = require('mongoose');

/*Start User Schema - contains a username and password of type String and a created_at property of type Date*/
var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});
/*End User Schema*/

/*Start Post Schema - represent our 'Cheeps' entries when a user 'Cheeps' a message*/
var postSchema = new mongoose.Schema({
    text: String,
    //username field which references a User document in the Users collection
    username: String,
    created_at: {type: Date, default: Date.now}
});
/*End Post Schema*/

//Declare a model called User which has schema userSchema
mongoose.model("User", userSchema);
//Declare a model called Post which has schema postSchema
mongoose.model("Post", postSchema);