var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var jsonParser = bodyParser.json();

var User = require('./models/user.js');

var Message = require('./models/message.js');

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

app.get('/users/:userId', function(req, res) {
    User.findById(req.params.userId, function(err, users) {
        console.log(users);
        if (users == null) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
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
    if (Object.prototype.toString.call(req.body.username) != '[object String]') {
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
    if (!req.body.username) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    if (Object.prototype.toString.call(req.body.username) != '[object String]') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }
    //first arg --> obj
    User.find({
        _id: req.params.userId
    }, function(err, users) {
        if (err) {
            return res.status(422).json({
                message: 'Missing field: username'
            });
        }
        if (users.length === 0) {
            User.create({
                _id: req.params.userId,
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
                res.status(200).json({});
            });
        }

    });
});
app.delete('/users/:userId', jsonParser, function(req, res) {
    User.findOneAndRemove({
        _id: req.params.userId
    }, function(err, users) {
        if (!users) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        if (err) {
            return res.status(404).json({
                message: 'Missing field: User not found'
            });
        }
        return res.status(200).json({})
    });
});


// MESSAGES

app.get('/messages', function(req, res) {
    if (req.query.from && !req.query.to) {
        Message.find({
            from: req.query.from
        })
            .populate('from')
            .populate('to')
            .exec(function(err, messages) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                res.status(200).json(messages);
            });
    }

    if (req.query.to && !req.query.from) {
        Message.find({
            to: req.query.to
        })
            .populate('from')
            .populate('to')
            .exec(function(err, messages) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                res.status(200).json(messages);
            });
    }

    if (req.query.to && req.query.from) {
        Message.find({
            to: req.query.to,
            from: req.query.from
        })
            .populate('from')
            .populate('to')
            .exec(function(err, messages) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                res.status(200).json(messages);
            });
    }

    Message.find()
        .populate('from')
        .populate('to')
        .exec(function(err, messages) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }

            console.log('res.body: ', req.query);
            res.status(200).json(messages);
        });

});

app.get('/messages/:messageId', function(req, res) {
    Message.find({_id: req.params.messageId})
    .populate('_id')
    .exec(function(err, messages){
        if(messages.length == 0){
            return  res.status(404).json({
                message : 'Message not found'
            });
        }

        messages.forEach(function(message) {
        res.status(200).json(message);

    });
});

    // if (req.body._id) {
    //     Message.findById({
    //         messageId: req.body._id
    //     })
    //         .populate('text')
    //         .populate('from')
    //         .populate('to')
    //         .exec(function(err, messages) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Internal Server Error'
    //                 });
    //             }
    //             res.status(200).json(messages);
    //         });
    // }

    // if (req.query.to && !req.query.from) {
    //     Message.find({
    //         to: req.query.to
    //     })
    //         .populate('from')
    //         .populate('to')
    //         .exec(function(err, messages) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Internal Server Error'
    //                 });
    //             }
    //             res.status(200).json(messages);
    //         });
    // }

    // if (req.query.to && req.query.from) {
    //     Message.find({
    //         to: req.query.to,
    //         from: req.query.from
    //     })
    //         .populate('from')
    //         .populate('to')
    //         .exec(function(err, messages) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Internal Server Error'
    //                 });
    //             }
    //             res.status(200).json(messages);
    //         });
    // }

    // Message.find()
    //     .populate('from')
    //     .populate('to')
    //     .exec(function(err, messages) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Internal Server Error'
    //             });
    //         }

    //         console.log('res.body: ', req.query);
    //         res.status(200).json(messages);
    //     });

});

app.post('/messages', jsonParser, function(req, res) {
 User.find(req.body.from, function(err, users) {
    console.log('req.body.from', req.body.from);
    console.log('users :', users);
    if (users.length == 0) {
        res.status(422).json({message: 'Incorrect field value: from'});
    } else {
        res.status(200).json(console.log(users));
    }

 });

// console.log(req.body);
        // Message.find({
        //     from: req.body.from,
        //     to: req.body.to
        // }, function(req, messages) {
        //         if (messages.length == 0) {
        //             return res.status(422).json({
        //                 message: 'Incorrect field value: from'
        //             });
        //     }
        //     else {

        //     }
        // });


 //2should reject messages without text
      if (!req.body.text) {
        return res.status(422).json({message: 'Missing field: text'})

      }

       if (Object.prototype.toString.call(req.body.text) != '[object String]') {
            return res.status(422).json({
                message: 'Incorrect field type: text'
            });
        }
        if (Object.prototype.toString.call(req.body.to) != '[object String]') {
            return res.status(422).json({
                message: 'Incorrect field type: to'
            });
        }
        if (Object.prototype.toString.call(req.body.from) != '[object String]') {
            return res.status(422).json({
                message: 'Incorrect field type: from'
            });
        }
 //1should allow adding a message
        Message.create({
                to: req.body.to,
                from: req.body.from,
                text: req.body.text
            }).then(function(message) {
                res.location('/messages/' + message._id);
                res.status(201).json({});
            }).catch(function(err) {
                if (err) {
                    return res.status(422).json({
                        message: 'Missing field: text'
                    });
                }
            });

});
        // console.log(req.body);
        // Message.find({
        //     from: req.body.from,
        //     to: req.body.to
        // }, function(req, messages) {
        //         if (messages.length == 0) {
        //             return res.status(422).json({
        //                 message: 'Incorrect field value: from'
        //             });
        //     }
        //     else {

        //     }
        // });

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
    }

    exports.app = app; exports.runServer = runServer;
