const express = require('express');
const router = express.Router();
const adminRoles = require('../services/adminRole');
const {authentication} = require('../middlewares/auth');

//view users
router.get('/getAll', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.get());
    } catch (err) {
        console.error(`Error while getting roles `, err.message);
        next(err);
    }
});

router.get('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.get(req.params.id));
    } catch (err) {
        console.error(`Error while getting roles with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.get('/:id/perms', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.getPerms(req.params.id));
    } catch (err) {
        console.error(`Error while getting perms with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.get('/:id/getPossiblePerms', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.getPossiblePerms(req.params.id));
    } catch (err) {
        console.error(`Error while getting perm with id: ${req.params.id}`, err.message);
        next(err);
    }
});

//create
router.post('/', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.create(req.body));
    } catch (err) {
        console.error(`Error while creating user`, err.message);
        next(err);
    }
});

//update
router.put('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

//delete
router.delete('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.remove(req.params.id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

router.put('/:role_id/perm/:perm_id', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.assignPerm(req.params.role_id, req.params.perm_id));
    } catch (err) {
        console.error(`Error while updating perm with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.delete('/:role_id/perm/:perm_id', authentication, async function(req, res, next) {
    try {
        res.json(await adminRoles.deassignPerm(req.params.role_id, req.params.perm_id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

module.exports = router;