const express = require('express');
const router = express.Router();
const adminUsers = require('../services/adminUsers');
const {authentication} = require('../middlewares/auth');

//view users
router.get('/getAll', authentication, async function(req, res, next) {
    try {
        res.json(await adminUsers.get());
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

router.get('/getRoles', authentication, async function(req, res, next) {
    try {
        res.json(await adminUsers.getRoles());
    } catch (err) {
        console.error(`Error while getting user roles `, err.message);
        next(err);
    }
});

//create
router.post('/', authentication, async function(req, res, next) {
    try {
        res.json(await adminUsers.create(req.body));
    } catch (err) {
        console.error(`Error while creating user`, err.message);
        next(err);
    }
});

//update
router.put('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminUsers.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

//delete
router.delete('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminUsers.remove(req.params.id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

module.exports = router;