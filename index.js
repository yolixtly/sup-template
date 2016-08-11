var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var jsonParser = bodyParser.json();

var User = require('./models/user.js');
// Add your API endpoints here

app.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(users);
    });
});

//
app.get('/users/:userId', function(req, res) {
    User.findById(req.params.userId, function(err, users) {
        console.log(users);
        if (users == null) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        // User.find(req.params.userId)
        //     if (users._id == req.params.userId) {
        //         return res.status(404).json({message: 'User not found'})
        //     }
        res.json(users);
    });
});

app.post('/users', jsonParser, function(req, res) {
        if (!req.body.username) {
            return res.status(422).json({
                message: 'Missing field: username'
            });

        }
        // THIS : would not let the 'should allow adding a user' pass
        if(Object.prototype.toString.call(req.body.username) != '[object String]'){
            return res.status(422).json({
                message: 'Incorrect field type: username'
            });
        }

    User.create({
        username: req.body.username
    }).then(function(user) {
        res.location('/users/' + user._id);
        res.status(201).json({});
    }).catch(function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    });
});

app.put('/users/:userId', jsonParser, function(req, res) {
   if (!req.body.username){
        return res.status(422).json({
                message: 'Missing field: username'
            });
   }

   if(Object.prototype.toString.call(req.body.username) != '[object String]'){
            return res.status(422).json({
                message: 'Incorrect field type: username'
            });
        }
        //first arg --> obj
    User.find({
        _id : req.params.userId
    }, function(err, users) {
        if (err) {
            return res.status(422).json({
                message: 'Missing field: username'
            });
        }
        if (users.length === 0) {
            User.create({
                _id : req.params.userId,
                username: req.body.username
            }, function(err, user) {
               return res.json({});
            });
        } else {
             User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username
    }, function(err, users) {
        if (err) {
            return res.status(400).json({
                message: 'error'
            });
        }

        // console.log(res.body);
        res.status(200).json({});
    });
        }

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