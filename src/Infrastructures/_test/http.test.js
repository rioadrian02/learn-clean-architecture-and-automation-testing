// functional test
import { describe, jest } from '@jest/globals';
import request from 'supertest';
import createServer from '../http/server.js';

const app = createServer();

describe('POST /users', () => {
    test('harus mengembalikan 201 dan data user jika request valid', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                username: 'budifunctional',
                password: 'rahasia123',
                fullname: 'Budi Functional',
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.registeredUser).toBeDefined();
        expect(res.body.data.registeredUser.username).toBe('budifunctional');
    });

    test('harus mengembalikan 400 jika username sudah dipakai', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                username: 'budifunctional',
                password: 'rahasia123',
                fullname: 'Budi Functional',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('Username sudah digunakan');

    });

    test('harus mengembalikan 400 jika request tidak valid', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                username: 'budifunctional',
                password: 'rahasia123',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('REGISTER_USER.MISSING_REQUIRED_PROPERTY');
    });
});

describe('POST /authentications', () => {
    test('harus mengembalikan 201 dan token jika login berhasil', async () => {
        const res = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
                password: 'rahasia123'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
    });

    test('harus mengembalikan 401 jika password salah', async () => {
        const res = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
                password: 'salah'
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('LOGIN_USER.WRONG_PASSWORD');
    });

    test('harus mengembalikan 400 jika request tidak valid', async () => {
        const res = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('LOGIN_USER.MISSING_REQUIRED_PROPERTY');
    });

    test('harus mengembalikan 400 jika tipe data tidak valid', async () => {
        const res = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
                password: 12345
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('LOGIN_USER.WRONG_DATA_TYPE');
    });
});