var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var jsonParser = bodyParser.json();

var User = require('./models/user.js');
// Add your API endpoints here

app.get('/users', function(req, res){
    User.find(function(err, users){
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(users);
    });
});

//
app.get('/users/:userId', function(req, res){
    User.findById(function(err, users){
        if (err) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(users);
    });
});

app.post('/users', jsonParser, function(req, res){
    User.create({
       username: req.body.username
    }, function(err, users) {
        if(!req.body.username){
            return res.status(422).json({
                message: 'Missing field: username'
            });

        }
        if(typeof(req.body.username) != String){
            return res.status(422).json({
                message: 'Incorrect field type: username'
            });

        }
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
         // console.log('req.header: ', req.headers);
        // res.location("Location", res.users._id);
        res.status(201).json(users);
    });
});

var runServer = function(callback) {
    var databaseUri = process.env.DATABASE_URI || global.databaseUri || 'mongodb://localhost/sup';
    mongoose.connect(databaseUri).then(function() {
        var port = process.env.PORT || 8080;
        var server = app.listen(port, function() {
            console.log('Listening on localhost:' + port);
            if (callback) {
                callback(server);
            }
        });
    });
};

if (require.main === module) {
    runServer();
};

exports.app = app;
exports.runServer = runServer;



