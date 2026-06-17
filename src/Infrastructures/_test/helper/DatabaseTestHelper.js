import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool();

const DatabaseTestHelper = {
    async cleanUsers() {
        await pool.query('DELETE FROM users');
    },
    async cleanAuthentications() {
        await pool.query('DELETE FROM authentications');
    },
    async cleanAll() {
        await pool.query('DELETE FROM users');
        await pool.query('DELETE FROM authentications');
    }
}

export default DatabaseTestHelper;