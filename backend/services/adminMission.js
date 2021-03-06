const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function get(id){
    let data = false
    if(id){
        const mission = await db.query(
            `SELECT *  
            FROM missions 
            WHERE id=?`,
            [id]
        );
        data = helper.emptyOrRows(mission)[0];
    }else{
        const missions = await db.query(
            `SELECT *  
            FROM missions `
        );
        const mission_vehicle = await db.query(
            `SELECT vehicles.name, mission_vehicle.mission_id  
            FROM mission_vehicle JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id `
        );
        mission_vehicle.forEach(element => {
            let mission = missions.find( element2 => element2.id == element.mission_id)
            if(mission.vehicles)
                mission.vehicles += `, ${element.name}`
            else
                mission.vehicles = element.name
        })
        data = helper.emptyOrRows(missions);
    }
    const meta = {};

    return {
        data,
        meta
    }
}

async function getVehicles(id){
    let data = false
    const mission_vehicle = await db.query(
        `SELECT vehicles.id, vehicles.name 
        FROM mission_vehicle 
            JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id 
        WHERE mission_vehicle.mission_id=?`,
        [id]
    );
    data = helper.emptyOrRows(mission_vehicle);
    const meta = {};

    return {
        data,
        meta
    }
}

async function getPossibleVehicles(id){
    let data = false
    const mission_vehicle = await db.query(
        `SELECT id, name 
        FROM vehicles 
        WHERE id NOT IN (
            SELECT vehicle_id
            FROM mission_vehicle
            WHERE mission_id=?
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

async function create(mission){
    let data = false
    const result = await db.query(
        `INSERT INTO missions 
        (name, description, location, start_date, end_date) 
        VALUES 
        (?, ?, ?, ?, ?)`, 
        [
            mission.name,
            mission.description,
            mission.location,
            mission.start_date,
            mission.end_date,
        ]
    );
    let message = 'Error in creating mission';
    if (result.affectedRows) {
        message = 'Mission created successfully';
        const missions = await db.query(
            `SELECT *  
            FROM missions `
        );
        const mission_vehicle = await db.query(
            `SELECT vehicles.name, mission_vehicle.mission_id  
            FROM mission_vehicle JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id `
        );
        mission_vehicle.forEach(element => {
            let mission = missions.find( element2 => element2.id == element.mission_id)
            if(mission.vehicles)
                mission.vehicles += `, ${element.name}`
            else
                mission.vehicles = element.name
            
        })
        data = helper.emptyOrRows(missions);
    }
    return {
        data,
        message
    };
}

async function update(id, mission){
    const result = await db.query(
        `UPDATE missions 
        SET name=?, description=?, location=? ,start_date=?, end_date=?
        WHERE id=?`, 
        [
            mission.name, 
            mission.description,
            mission.location,
            mission.start_date,
            mission.end_date,
            id
        ]
    );
    
    const missions = await db.query(
        `SELECT *  
        FROM missions `
    );
    const mission_vehicle = await db.query(
        `SELECT vehicles.name, mission_vehicle.mission_id  
        FROM mission_vehicle JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id `
    );
    mission_vehicle.forEach(element => {
        let mission = missions.find( element2 => element2.id == element.mission_id)
        if(mission.vehicles)
            mission.vehicles += `, ${element.name}`
        else
            mission.vehicles = element.name
    })
    const data = helper.emptyOrRows(missions);
    let message = 'Error in updating mission';
    if (result.affectedRows) {
        message = 'Mission updated successfully';
    }
    return {
        data,
        message
    }
}

async function assignVehicle(mission_id, vehicle_id){
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
        `SELECT vehicles.id, vehicles.name 
        FROM mission_vehicle 
            JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id 
        WHERE mission_vehicle.mission_id=?`,
        [mission_id]
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
            WHERE records.mission_id=?`,
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
        `DELETE FROM missions WHERE id=?`, 
        [id]
    );
    let message = 'Error in deleting mission';
    if (result.affectedRows) {
        message = 'Mission deleted successfully';
    }
    const missions = await db.query(
        `SELECT *  
        FROM missions `
    );
    const mission_vehicle = await db.query(
        `SELECT vehicles.name, mission_vehicle.mission_id  
        FROM mission_vehicle JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id `
    );
    mission_vehicle.forEach(element => {
        let mission = missions.find( element2 => element2.id == element.mission_id)
        if(mission.vehicles)
            mission.vehicles += `, ${element.name}`
        else
            mission.vehicles = element.name
    })
    const data = helper.emptyOrRows(missions);
    return {
        data, 
        message
    };
}

async function deassignVehicle(mission_id, vehicle_id){
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
        `SELECT vehicles.id, vehicles.name 
        FROM mission_vehicle 
            JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id 
        WHERE mission_vehicle.mission_id=?`,
        [mission_id]
    );

    const data = helper.emptyOrRows(mission_vehicle);
    const meta = {};
    return {
        data,
        meta
    }
}

async function uploadCSV(data){
    await asyncForEach(data.file_data, async (e) => {
        if(e.datetime && e.datetime != ''){
            let sensor_nav = await db.query(
                `INSERT INTO sensor_navigation 
                (boat_time, reset_number, channel, raw_data, latitude, longitude, speed, heading, pitch, roll, true_wind_angle, true_wind_speed, active_wp, active_wp_latitude, active_wp_longitude, wasp_latitude, wasp_longitude) 
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [
                    e.datetime, // boat_time
                    e.reset_number, // reset_number
                    null, // channel
                    JSON.stringify(e), // raw_data
                    e.boat_latitude, // latitude
                    e.boat_longitude, // longitude
                    e.boat_speed, // speed
                    e.heading, // heading
                    e.pitch, // pitch
                    e.roll, // roll
                    e.trueWindAngleDeg, // true_wind_angle
                    e.trueWindSpeedKnots, // true_wind_speed
                    e.activeWP, // active_wp
                    e.activeWP_latitude, // active_wp_latitude
                    e.activeWP_longitude, // active_wp_longitude
                    e.wasp_latitude, // wasp_latitude
                    e.wasp_longitude, // wasp_longitude
                ]
            )
            let record = await db.query(
                `INSERT INTO records 
                (vehicle_id, mission_id, timestamp) 
                VALUES 
                (?, ?, ?)`, 
                [
                    data.vehicle_id, // boat_time
                    data.mission_id, // reset_number
                    e.datetime, // channel
                ]
            )
            await db.query(
                `INSERT INTO record_sensor 
                (record_id, sensor_id, sensor_type) 
                VALUES 
                (?, ?, ?)`, 
                [
                    record.insertId, 
                    sensor_nav.insertId, 
                    "sensor_navigation"
                ]
            )
        }
    })
    return {'message': 'ok'}
}


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = {
    get,
    getVehicles,
    getPossibleVehicles,
    create,
    update,
    assignVehicle,
    remove,
    deassignVehicle,
    uploadCSV
}