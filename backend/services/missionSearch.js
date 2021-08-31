const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function search(text){
    let data = false
    let missions = await db.query(
        `SELECT id, name, description, location, start_date, end_date, is_public 
        FROM missions 
        WHERE name LIKE '%${text}%'`
    );
    data = helper.emptyOrRows(missions);
    await asyncForEach(data, async (mission) => {
        mission.vehicles = await db.query(
            `SELECT vehicles.id, vehicles.name, vehicles.image, vehicles.boat_mark_color, vehicles.boat_waypoint_color 
            FROM mission_vehicle 
            JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id
            WHERE mission_id=?`,
            [
                mission.id
            ]
        );
        await asyncForEach(mission.vehicles, async (vehicle) => {
            vehicle.records = [ ... await db.query(
                `SELECT record_sensor.sensor_id, record_sensor.sensor_type, timestampDIFF(SECOND,'001-01-01 00:00:00', records.timestamp) as timestamp, records.timestamp as date
                FROM records 
                JOIN record_sensor ON records.id=record_sensor.record_id
                WHERE records.mission_id=? AND records.vehicle_id=?`,
                [
                    mission.id,
                    vehicle.id
                ]
            )];
            vehicle.waypoints = await db.query(
                `SELECT *
                FROM waypoints 
                WHERE mission_id=? AND vehicle_id=? 
                ORDER BY sequence ASC`,
                [
                    mission.id,
                    vehicle.id
                ]
            );
            await asyncForEach(vehicle.records, async (record, index) => {
                let aux = await db.query(
                    `SELECT * 
                    FROM ${record.sensor_type} 
                    WHERE id=?`,
                    [
                        record.sensor_id
                    ]
                );
                aux[0].timestamp = record.timestamp
                aux[0].date = record.date
                vehicle.records[index] = aux[0]
            })
        })
    })
    const meta = {};

    return {
        missions,
        meta
    }
}

async function getAllMissions(){
    let data = false
    let missions = await db.query(
        `SELECT id, name, description, location, start_date, end_date, is_public 
        FROM missions `
    );
    data = helper.emptyOrRows(missions);
    await asyncForEach(data, async (mission) => {
        mission.vehicles = await db.query(
            `SELECT vehicles.id, vehicles.name, vehicles.image, vehicles.boat_mark_color, vehicles.boat_waypoint_color 
            FROM mission_vehicle 
            JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id
            WHERE mission_id=?`,
            [
                mission.id
            ]
        );
        await asyncForEach(mission.vehicles, async (vehicle) => {
            vehicle.records = [ ... await db.query(
                `SELECT record_sensor.sensor_id, record_sensor.sensor_type, timestampDIFF(SECOND,'001-01-01 00:00:00', records.timestamp) as timestamp, records.timestamp as date
                FROM records 
                JOIN record_sensor ON records.id=record_sensor.record_id
                WHERE records.mission_id=? AND records.vehicle_id=?`,
                [
                    mission.id,
                    vehicle.id
                ]
            )];
            vehicle.waypoints = await db.query(
                `SELECT *
                FROM waypoints 
                WHERE mission_id=? AND vehicle_id=? 
                ORDER BY sequence ASC`,
                [
                    mission.id,
                    vehicle.id
                ]
            );
            await asyncForEach(vehicle.records, async (record, index) => {
                let aux = await db.query(
                    `SELECT * 
                    FROM ${record.sensor_type} 
                    WHERE id=?`,
                    [
                        record.sensor_id
                    ]
                );
                aux[0].timestamp = record.timestamp
                aux[0].date = record.date
                vehicle.records[index] = aux[0]
            })
        })
    })
    const meta = {};
    return {
        missions,
        meta
    }
}

async function getAllVehicles(){
    let data = false
    let vehicles = await db.query(
        `SELECT * 
        FROM vehicles `
        );
    data = helper.emptyOrRows(vehicles);
    
    const meta = {};
    return {
        vehicles,
        meta
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
    
async function getMissionsByVehicleId(vehicle_id){
    let data = false
    let missions = await db.query(
        `SELECT missions.id, missions.name, missions.description, missions.location,  timestampDIFF(SECOND,'001-01-01 00:00:00', missions.start_date) as start_date,  timestampDIFF(SECOND,'001-01-01 00:00:00', missions.end_date) as end_date, missions.is_public 
        FROM mission_vehicle 
        JOIN missions ON mission_vehicle.mission_id=missions.id
        WHERE mission_vehicle.vehicle_id=?
        `,
        [
            vehicle_id
        ]
    );
    data = helper.emptyOrRows(missions);
    await asyncForEach(data, async (mission) => {
        mission.vehicles = await db.query(
            `SELECT vehicles.id, vehicles.name, vehicles.image, vehicles.boat_mark_color, vehicles.boat_waypoint_color 
            FROM mission_vehicle 
            JOIN vehicles ON mission_vehicle.vehicle_id=vehicles.id
            WHERE mission_id=?`,
            [
                mission.id
            ]
        );
        await asyncForEach(mission.vehicles, async (vehicle) => {
            vehicle.records = [ ... await db.query(
                `SELECT record_sensor.sensor_id, record_sensor.sensor_type, timestampDIFF(SECOND,'001-01-01 00:00:00', records.timestamp) as timestamp, records.timestamp as date
                FROM records 
                JOIN record_sensor ON records.id=record_sensor.record_id
                WHERE records.mission_id=? AND records.vehicle_id=?`,
                [
                    mission.id,
                    vehicle.id
                ]
            )];
            await asyncForEach(vehicle.records, async (record, index) => {
                let aux = await db.query(
                    `SELECT * 
                    FROM ${record.sensor_type} 
                    WHERE id=?`,
                    [
                        record.sensor_id
                    ]
                );
                aux[0].timestamp = record.timestamp
                aux[0].date = record.date
                vehicle.records[index] = aux[0]
            })
        })
    })
    const meta = {};
    return {
        missions,
        meta
    }
}

module.exports = {
    search,
    getAllMissions,
    getAllVehicles,
    getMissionsByVehicleId
}