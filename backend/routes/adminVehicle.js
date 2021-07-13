const express = require('express');
const router = express.Router();
const adminVehicle = require('../services/adminVehicle');
const {authentication} = require('../middlewares/auth');
//view missions
router.get('/getAll', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.get());
    } catch (err) {
        console.error(`Error while getting missions `, err.message);
        next(err);
    }
});

router.get('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.get(req.params.id));
    } catch (err) {
        console.error(`Error while getting mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.get('/:id/missions', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.getMissions(req.params.id));
    } catch (err) {
        console.error(`Error while getting mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.get('/:id/missions/getPossibleMissions', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.getPossibleMissions(req.params.id));
    } catch (err) {
        console.error(`Error while getting mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});


//create
router.post('/', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.create(req.body));
    } catch (err) {
        console.error(`Error while creating mission`, err.message);
        next(err);
    }
});

//update
router.put('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

router.put('/:vehicle_id/missions/:mission_id', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.assignMission(req.params.mission_id, req.params.vehicle_id));
    } catch (err) {
        console.error(`Error while updating mission with id: ${req.params.id}`, err.message);
        next(err);
    }
});

//delete
router.delete('/:id', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.remove(req.params.id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

router.delete('/:vehicle_id/missions/:mission_id', authentication, async function(req, res, next) {
    try {
        res.json(await adminVehicle.deassignMission(req.params.mission_id, req.params.vehicle_id));
    } catch (err) {
        console.error(`Error while deleting programming language`, err.message);
        next(err);
    }
});

module.exports = router;