const express = require('express');
const router = express.Router();
const adminMission = require('../services/adminMission');
const {authentication} = require('../middlewares/auth');

//view missions
router.get('/getAll', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.get());
    } catch (err) {
        console.error(`Error while getting missions `, err.message);
        next(err);
    }
});

router.get('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.get(req.params.id));
    } catch (err) {
        console.error(`Error while getting mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.get('/:id/vehicles', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.getVehicles(req.params.id));
    } catch (err) {
        console.error(`Error while getting mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.get('/:id/vehicles/getPossibleVehicles', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.getPossibleVehicles(req.params.id));
    } catch (err) {
        console.error(`Error while getting mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});


//create
router.post('/', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.create(req.body));
    } catch (err) {
        console.error(`Error while creating mission`, err.message);
        next(err);
    }
});

//update
router.put('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.put('/:mission_id/vehicles/:vehicle_id', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.assignVehicle(req.params.mission_id, req.params.vehicle_id));
    } catch (err) {
        console.error(`Error while updating mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

//delete
router.delete('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.remove(req.params.id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

router.delete('/:mission_id/vehicles/:vehicle_id', authentication, async function(req, res, next) {
    try {
        res.json(await adminMission.deassignVehicle(req.params.mission_id, req.params.vehicle_id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

module.exports = router;