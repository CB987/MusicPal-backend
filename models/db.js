// ============================================
// Database Connection
const pgp = require('pg-promise')({
<<<<<<< HEAD
    query: e => {      
        console.log('QUERY: ', e.query);
        if (e.params) {
            console.log('PARAMS:', e.params);
        }       
=======
    query: e => {
        console.log('QUERY: ', e.query);
        if (e.params) {
            console.log('PARAMS:', e.params);
        }
>>>>>>> 5f2d7a5ba4446a6a74c59c45f8de8dfef69d808c
    }
});
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
// ============================================

module.exports = db;