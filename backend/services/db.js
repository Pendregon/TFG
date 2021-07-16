const mysql = require('mysql2/promise');
const config = require('../config');
let connection = null
async function query(sql, params) {
    if(!connection)
        connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);

    return results;
}

module.exports = {
    query
}