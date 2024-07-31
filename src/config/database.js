import mysql2 from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()
const pool = mysql2.createPool({
    host: process.env.LOCAL_HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
}).promise();

( async() => {
    try {
        const connection = await pool.getConnection()
        console.log( "CONNECTED" )
        connection.release()
    } catch (error) {
        console.log( "ERROR : ", error )
    }
})();


export default pool