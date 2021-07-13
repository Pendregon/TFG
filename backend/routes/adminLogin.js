const express = require('express');
const router = express.Router();
const adminUsers = require('../services/adminUsers');
const {authentication} = require('../middlewares/auth');

router.post('/login', async function(req, res, next) {
    try {
        let response = await adminUsers.login(req.body);
        if(response.meta.error){
            res.status(response.meta.error).send(response.meta.message);
        }else{
            res.json(response);
        }
    } catch (err) {
        console.error(`Error while login `, err.message);
        next(err);
    }
});

router.get('/getPerms', authentication, async function(req, res, next) {
    try {
        res.json(await adminUsers.getCurrentPerms(req.user.role_id));
    } catch (err) {
        console.error(`Error while login `, err.message);
        next(err);
    }
});

router.get('/getPerms', async function(req, res, next) {
    try {
        res.json({
            is_logged: false,
            perms: []
        });
    } catch (err) {
        console.error(`Error while login `, err.message);
        next(err);
    }
});

module.exports = router;