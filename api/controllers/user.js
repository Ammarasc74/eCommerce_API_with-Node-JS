const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require( 'jsonwebtoken');

const User = require('../models/user');

exports.user_get_all = (req, res, next) =>{
    User.find()
    .select("email  password _id")
    .exec()
    .then( docs  => {
        const response = {
            count: docs.length,
            users: docs.map( doc =>{
                return {
                    email: doc.email,
                    password: doc.password,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/user/users' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

exports.user_signup = (req, res, next) => {
    User
    .find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: "mail exists"
            });
        }else {
        bcrypt.hash(req.body.password,10,function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                massage: "User Created"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                        });
                    });
                }
            }); 
        }
    })
}

exports.user_login = (req, res, next) =>{
    console.log("iam in");
    User
    .find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    _id: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: "Auth succecfull",
                    token: token
                });
            }
            return res.status(401).json({
                message: "Auth failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

exports.user_delete_user =  (req, res, next) => {
    User.remove({ _id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
}