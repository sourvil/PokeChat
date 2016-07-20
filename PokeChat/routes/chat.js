var express = require('express');
var router = express.Router();

router.route('/')
    .post(function (req, res) {
        res.send({ message: 'TODO: a new chat in mongo' });
    })
    .get(function (req, res) {
        res.send({message: 'TODO: return all chat in mongo'});
    });

router.route('/:id')
    .put(function (req, res) {
        res.send({ message: 'TODO: update a chat and save it to mongo ' + req.params.id });
    })
    .get(function (req, res) {
        res.send({ message: 'TODO: get a specific chat from mongo ' + req.params.id });
    })
    .delete(function (req, res) {
        res.send({message: 'TODO: delete a specific chat from mongo ' + req.params.id});
    })
    ;

module.exports = router;