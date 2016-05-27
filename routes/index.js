/**
 * Created by eidan on 20/05/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: "Chirp"});
});

module.exports = router;