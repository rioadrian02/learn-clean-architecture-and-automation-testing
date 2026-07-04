import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool();

const withTransaction = async( callback ) => {
    const client = await pool.connect();

    try {
        // BEGIN
        await client.query('BEGIN');

        const result = await callback(client);

        await client.query('COMMIT');

        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export default withTransaction;
