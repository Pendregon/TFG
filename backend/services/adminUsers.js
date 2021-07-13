const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function get(){
    let data = false
    const users = await db.query(
        `SELECT users.id, users.name, users.email, users.password, users.role_id, roles.display_name as role  
        FROM users 
        JOIN roles ON users.role_id=roles.id`
    );
    data = helper.emptyOrRows(users);
    
    const meta = {};

    return {
        data,
        meta
    }
}

async function getRoles(){
    let data = false
    const roles = await db.query(
        `SELECT id, display_name as name  
        FROM roles `
    );
    data = helper.emptyOrRows(roles);
    const meta = {};

    return {
        data,
        meta
    }
}

async function create(user){
    let data = false
    const result = await db.query(
        `INSERT INTO users 
        (name, email, password, role_id) 
        VALUES 
        (?, ?, ?, ?)`, 
        [
            user.name,
            user.email,
            bcrypt.hashSync(user.password, saltRounds),
            user.role_id,
        ]
    );
    let message = 'Error in creating user';
    if (result.affectedRows) {
        message = 'User created successfully';
    }
    const users = await db.query(
        `SELECT users.id, users.name, users.email, users.password, users.role_id, roles.display_name as role  
        FROM users 
        JOIN roles ON users.role_id=roles.id`
    );
    data = helper.emptyOrRows(users);
    return {
        data,
        message
    };
}

async function update(id, user){
    let data = false
    const result = await db.query(
        `UPDATE users 
        SET name=?, email=?, password=?, role_id=?
        WHERE id=?`, 
        [
            user.name,
            user.email,
            bcrypt.hashSync(user.password, saltRounds),
            user.role_id,
            id
        ]
    );
    let message = 'Error in updating user';
    if (result.affectedRows) {
        message = 'User updated successfully';
    }
    const users = await db.query(
        `SELECT users.id, users.name, users.email, users.password, users.role_id, roles.display_name as role  
        FROM users 
        JOIN roles ON users.role_id=roles.id`
    );
    data = helper.emptyOrRows(users);
    return {
        data,
        message
    };
}

async function remove(id){
    let data = false
    const result = await db.query(
        `DELETE FROM users WHERE id=?`, 
        [id]
    );
    let message = 'Error in deleting user';
    if (result.affectedRows) {
        message = 'User deleted successfully';
    }
    const users = await db.query(
        `SELECT users.id, users.name, users.email, users.password, users.role_id, roles.display_name as role  
        FROM users 
        JOIN roles ON users.role_id=roles.id`
    );
    data = helper.emptyOrRows(users);
    return {
        data,
        message
    };
}

async function login(login_data){
    let user = false
    const users = await db.query(
        `SELECT *  
        FROM users WHERE email=?`,
        [
            login_data.email
        ]
    );
    user = helper.emptyOrRows(users)[0];
    let meta = {};
    if(!user || !bcrypt.compareSync(login_data.password, user.password) ){
        return {
            meta: {
                error: 400,
                message: 'Incorrect user or password.'
            }
        }
    }
    const roles = await db.query(
        `SELECT permissions.name as name 
        FROM permission_role 
        JOIN permissions ON permission_role.permission_id=permissions.id 
        WHERE permission_role.role_id=? `,
        [
            user.role_id
        ]
    );
    let permissions = helper.emptyOrRows(roles);
    let token = jwt.sign({data: user}, 'secret', {expiresIn: 60 * 60 * 24 * 30})
    return {
        token: token,
        perms: JSON.stringify(permissions),
        meta
    }
}

async function getCurrentPerms(role_id){
    let data = false
    const roles = await db.query(
        `SELECT permissions.name as name 
        FROM permission_role 
        JOIN permissions ON permission_role.permission_id=permissions.id 
        WHERE permission_role.role_id=? `,
        [
            role_id
        ]
    );
    data = helper.emptyOrRows(roles);
    // const meta = {};

    return {
        is_logged: true,
        perms: JSON.stringify(data)
    }
}

module.exports = {
    get,
    getRoles,
    create,
    update,
    remove,
    login,
    getCurrentPerms
}