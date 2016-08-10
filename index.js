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
        };
        res.json(users);
    });
});

//
app.get('/users/:userId', function(req, res){
    User.findById(req.params.userId,function(err, users){
        if (err) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
    User.find(req.params.userId)
        if (users._id == req.params.userId) {
            return res.status(404).json({message: 'User not found'})
        }
        res.json(users);
    });
});

app.post('/users', jsonParser, function(req, res){
    User.create({
       username: req.body.username
    }, function(err, user) {
        if(!req.body.username){
            return res.status(422).json({
                message: 'Missing field: username'
            });

        }
        if(typeof req.body.username != String){
            return res.status(422).json({
                message: 'Incorrect field type: username'
            });
        }
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.location('/users/'+user._id);
        res.status(201).json({});
    });
});

app.put('/users/:userId', jsonParser, function(req,res){
    // if (req.params._id) {
    //     User.create({
    //         username: req.body.username
    //     }, function(err,users) {
    //         if(!req.body.username){
    //             return res.status(422).json({
    //                 message: 'Missing field: username'
    //             })
    //         }
    //     });
    // res.status(200).json(users);
    // }

    User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username
    }, function(err, users){
        if (err) {
            return res.status(400).json({ message: 'error'})
        }

        //console.log(res.body);
        res.status(200).json(users);
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



