﻿var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');

var express = require('express');
var router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.method == 'GET')
        return next();

    if (req.isAuthenticated())
        return next();

    return res.redirect('/#login');
}

router.use('/', isAuthenticated);


router.route('/')
    .post(function (req, res) {

        console.log('Received Poke Message: ' + req.body.message);
        console.log('Received Poke createdBy: ' + req.body.createdBy);

        var chat = new Chat();
        chat.message = req.body.message;
        chat.createdBy = req.body.createdBy;
        chat.createdAt = req.body.createdAt;
        chat.save(function (err, chat) {
            if (err) {
                console.log('post error: ' + err);
                return res.send(500, err);
            }
            return res.json(chat);
        });
    })

    .get(function (req, res) {
        Chat.find(function (err, chats) {
            if (err)
                return res.send(500, err);
            Chat.populate(chats, { path: 'createdBy' }, function (err, chats) {
                return res.send(chats);
            });            
        });
    });

router.route('/:id')
    .put(function (req, res) {
        Chat.findById(req.params.id, function (err, chat) {
            if (err)
                return res.send(err);

            chat.message = req.body.text;
            chat.createdBy = req.body.createdBy;
            chat.createdAt = req.body.createdAt;

            chat.save(function (err, chat) {
                if (err)
                    res.send(err);
                return res.json(chat);
            });

        });
    })
    .get(function (req, res) {
        Chat.findById(req.params.id, function (err, chat) {
            if (err)
                return res.send(err);
            return res.json(chat);
        });
    })
    .delete(function (req, res) {
        Chat.remove({ id: req.params.id }, function (err) {
            if (err)
                return res.send(err);
            return res.json("Deleted!");
        });
    })
    ;

module.exports = router;