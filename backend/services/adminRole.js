const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function get(id){
    let data = false
    
    if(id){
        const mission = await db.query(
            `SELECT *  
            FROM roles 
            WHERE id=?`,
            [id]
        );
        data = helper.emptyOrRows(mission)[0];
    }else{
        const roles = await db.query(
            `SELECT *  
            FROM roles `
        );
        data = helper.emptyOrRows(roles);
    }
    const meta = {};

    return {
        data,
        meta
    }
}

async function getPerms(id){
    const perms = await db.query(
        `SELECT permissions.id, permissions.name
        FROM permission_role 
            JOIN permissions ON permission_role.permission_id=permissions.id 
        WHERE permission_role.role_id=?`,
        [id]
    );
    const data = helper.emptyOrRows(perms);
    const meta = {};

    return {
        data,
        meta
    }
}

async function getPossiblePerms(id){
    const perms = await db.query(
        `SELECT id, name 
        FROM permissions 
        WHERE id NOT IN (
            SELECT permission_id
            FROM permission_role
            WHERE role_id=?
        )`,
        [id]
    );
    const data = helper.emptyOrRows(perms);
    const meta = {};

    return {
        data,
        meta
    }
}

async function create(role){
    let data = false
    const result = await db.query(
        `INSERT INTO roles 
        (name, display_name) 
        VALUES 
        (?)`, 
        [
            role.display_name,
        ]
    );
    let message = 'Error in creating role';
    if (result.affectedRows) {
        message = 'Role created successfully';
    }
    const roles = await db.query(
        `SELECT *  
        FROM roles `
    );
    data = helper.emptyOrRows(roles);
    return {
        data,
        message
    };
}

async function update(id, role){
    let data = false
    const result = await db.query(
        `UPDATE roles 
        SET display_name=?
        WHERE id=?`, 
        [
            role.display_name,
            id
        ]
    );
    let message = 'Error in updating role';
    if (result.affectedRows) {
        message = 'Role updated successfully';
    }
    const roles = await db.query(
        `SELECT *  
        FROM roles `
    );
    data = helper.emptyOrRows(roles);
    return {
        data,
        message
    };
}

async function remove(id){
    let data = false
    const result = await db.query(
        `DELETE FROM roles WHERE id=?`, 
        [id]
    );
    let message = 'Error in deleting role';
    if (result.affectedRows) {
        message = 'Role deleted successfully';
    }
    const roles = await db.query(
        `SELECT *  
        FROM roles `
    );
    data = helper.emptyOrRows(roles);
    return {
        data,
        message
    };
}

async function assignPerm(role_id, perm_id){
    await db.query(
        `INSERT INTO permission_role 
        (permission_id, role_id) 
        VALUES 
        (?, ?)`, 
        [
            perm_id,
            role_id,
        ]
    );
    const perms = await db.query(
        `SELECT permissions.id, permissions.name
        FROM permission_role 
            JOIN permissions ON permission_role.permission_id=permissions.id 
        WHERE permission_role.role_id=?`,
        [role_id]
    );
    const data = helper.emptyOrRows(perms);

    const meta = {};
    return {
        data,
        meta
    }
}

async function deassignPerm(role_id, perm_id){
    const result = await db.query(
        `DELETE FROM permission_role 
        WHERE permission_id=? and role_id=?`, 
        [
            perm_id,
            role_id
        ]
    );
    const perms = await db.query(
        `SELECT permissions.id, permissions.name
        FROM permission_role 
            JOIN permissions ON permission_role.permission_id=permissions.id 
        WHERE permission_role.role_id=?`,
        [role_id]
    );
    const data = helper.emptyOrRows(perms);
    const meta = {};
    return {
        data,
        meta
    }
}

module.exports = {
    get,
    getPerms,
    getPossiblePerms,
    create,
    update,
    remove,
    assignPerm,
    deassignPerm
}