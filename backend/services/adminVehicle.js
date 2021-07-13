const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function get(id){
    let data = false
    if(id){
        const vehicle = await db.query(
            `SELECT *  
            FROM vehicles 
            WHERE id=?`,
            [id]
        );
        data = helper.emptyOrRows(vehicle)[0];
    }else{
        const vehicles = await db.query(
            `SELECT *  
            FROM vehicles `
        );
        data = helper.emptyOrRows(vehicles);
    }
    const meta = {};

    return {
        data,
        meta
    }
}

async function getMissions(id){
    let data = false
    const mission_vehicle = await db.query(
        `SELECT missions.id, missions.name 
        FROM mission_vehicle 
            JOIN missions ON mission_vehicle.mission_id=missions.id 
        WHERE mission_vehicle.vehicle_id=?`,
        [id]
    );
    data = helper.emptyOrRows(mission_vehicle);
    const meta = {};

    return {
        data,
        meta
    }
}

async function getPossibleMissions(id){
    let data = false
    const mission_vehicle = await db.query(
        `SELECT id, name 
        FROM missions 
        WHERE id NOT IN (
            SELECT mission_id
            FROM mission_vehicle
            WHERE vehicle_id=?
        )`,
        [id]
    );
    data = helper.emptyOrRows(mission_vehicle);
    const meta = {};

    return {
        data,
        meta
    }
}

async function create(vehicle){
    let data = false
    const result = await db.query(
        `INSERT INTO vehicles 
        (name, boat_mark_color, boat_waypoint_color) 
        VALUES 
        (?,?,?)`, 
        [
            vehicle.name,
            vehicle.boat_mark_color,
            vehicle.boat_waypoint_color,
        ]
    );
    let message = 'Error in creating vehicle';
    if (result.affectedRows) {
        message = 'Vehicle created successfully';
        const vehicles = await db.query(
            `SELECT *  
            FROM vehicles `
        );
        data = helper.emptyOrRows(vehicles);
    }
    return {
        data,
        message
    };
}

async function update(id, vehicle){
    const result = await db.query(
        `UPDATE vehicles 
        SET name=?, boat_mark_color=?, boat_waypoint_color=?
        WHERE id=?`, 
        [
            vehicle.name,
            vehicle.boat_mark_color,
            vehicle.boat_waypoint_color,
            id
        ]
    );

    let message = 'Error in updating vehicle';
    if (result.affectedRows) {
        message = 'Vehicle updated successfully';
    }

    const vehicles = await db.query(
        `SELECT *  
        FROM vehicles `
    );
    const data = helper.emptyOrRows(vehicles);

    return {
        data,
        message
    };
}

async function assignMission(mission_id, vehicle_id){
    await db.query(
        `INSERT INTO mission_vehicle 
        (mission_id, vehicle_id) 
        VALUES 
        (?, ?)`, 
        [
            mission_id,
            vehicle_id,
        ]
    );
    const mission_vehicle = await db.query(
        `SELECT missions.id, missions.name 
        FROM mission_vehicle 
            JOIN missions ON mission_vehicle.mission_id=missions.id 
        WHERE mission_vehicle.vehicle_id=?`,
        [vehicle_id]
    );

    const data = helper.emptyOrRows(mission_vehicle);
    const meta = {};
    return {
        data,
        meta
    }
}

async function remove(id){
    let records_sensors = await db.query(
        `SELECT record_sensor.sensor_id, record_sensor.sensor_type  
            FROM record_sensor
                JOIN records
                    ON record_sensor.record_id=records.id
            WHERE records.vehicle_id=?`,
        [id]
    );
    records_sensors.forEach(async function(element){
        await db.query(
            `DELETE FROM ${element.sensor_type} WHERE id=?`, 
            [
                element.sensor_id
            ]
        );
    })
    const result = await db.query(
        `DELETE FROM vehicles WHERE id=?`, 
        [id]
    );
    let message = 'Error in deleting vehicle';
    if (result.affectedRows) {
        message = 'Vehicle deleted successfully';
    }

    const vehicles = await db.query(
        `SELECT *  
        FROM vehicles `
    );
    const data = helper.emptyOrRows(vehicles);

    return {
        data, 
        message
    };
}

async function deassignMission(mission_id, vehicle_id){
    let records_sensors = await db.query(
        `SELECT record_sensor.sensor_id, record_sensor.sensor_type  
            FROM record_sensor
                JOIN records
                    ON record_sensor.record_id=records.id
            WHERE records.mission_id=? and records.vehicle_id`,
        [
            mission_id,
            vehicle_id
        ]
    );
    records_sensors.forEach(async function(element){
        await db.query(
            `DELETE FROM ${element.sensor_type} WHERE id=?`, 
            [
                element.sensor_id
            ]
        );
    })
    const result = await db.query(
        `DELETE FROM mission_vehicle 
        WHERE mission_id=? and vehicle_id=?`, 
        [
            mission_id,
            vehicle_id
        ]
    );
    const mission_vehicle = await db.query(
        `SELECT missions.id, missions.name
        FROM mission_vehicle 
            JOIN missions ON mission_vehicle.mission_id=missions.id 
        WHERE mission_vehicle.vehicle_id=?`,
        [vehicle_id]
    );

    const data = helper.emptyOrRows(mission_vehicle);
    const meta = {};
    return {
        data,
        meta
    }
}

module.exports = {
    get,
    getMissions,
    getPossibleMissions,
    create,
    update,
    assignMission,
    remove,
    deassignMission
}