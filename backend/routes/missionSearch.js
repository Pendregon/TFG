const express = require('express');
const router = express.Router();
const missionSearch = require('../services/missionSearch');

router.post('/searchForMission', async function(req, res, next) {
    try {
        res.json(await missionSearch.search(req.body.search));
    } catch (err) {
        console.error(`Error while searching `, err.message);
        next(err);
    }
});

router.get('/getAllMissions', async function(req, res, next) {
    try {
        res.json(await missionSearch.getAllMissions());
    } catch (err) {
        console.error(`Error while searching `, err.message);
        next(err);
    }
});

router.get('/getAllVehicles', async function(req, res, next) {
    try {
        res.json(await missionSearch.getAllVehicles());
    } catch (err) {
        console.error(`Error while searching `, err.message);
        next(err);
    }
});

router.get('/getMissionsByVehicle/:id', async function(req, res, next) {
    try {
        res.json(await missionSearch.getMissionsByVehicleId(req.params.id));
    } catch (err) {
        console.error(`Error while searching `, err.message);
        next(err);
    }
});

router.get('/getMissionsVehicleRecords/:mision_id/:vehicle_id', async function(req, res, next) {
    try {
        res.json(await missionSearch.getMissionsVehicleRecords(req.params.mision_id, req.params.vehicle_id));
    } catch (err) {
        console.error(`Error while searching `, err.message);
        next(err);
    }
});
module.exports = router;