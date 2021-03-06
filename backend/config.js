const env = process.env;

const config = {
    db: { /* don't expose password or any sensitive info, done only for demo */
        host: env.DB_HOST || '127.0.0.1',
        user: env.DB_USER || 'administrador',
        password: env.DB_PASSWORD || 'JamonSerrano1*',
        database: env.DB_NAME || 'tfg',
    },
    listPerPage: env.LIST_PER_PAGE || 20,
};


module.exports = config;