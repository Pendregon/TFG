const env = process.env;

const config = {
    db: { /* don't expose password or any sensitive info, done only for demo */
        host: env.DB_HOST || 'tfg.cj3lzrzgxvol.eu-west-3.rds.amazonaws.com',
        user: env.DB_USER || 'admin',
        password: env.DB_PASSWORD || '4AE?j=D<yk&zbU7Q&?&UF}=A:4_r4]F;',
        database: env.DB_NAME || 'tfg',
    },
    listPerPage: env.LIST_PER_PAGE || 20,
};


module.exports = config;