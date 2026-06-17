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
    });

    test('harus mengembalikan 400 jika request tidak valid', async () => {
        const res = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
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
    });
});

describe('PUT /authentications', () => {
    test('harus mengembalikan 200 dan access token baru', async() => {
        const resLogin = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
                password: 'rahasia123'
            });
        
        const { refreshToken } = resLogin.body.data;

        const res = await request(app)
            .put('/authentications')
            .send({
                refreshToken
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.accessToken).toBeDefined();
    });

    test('harus mengembalikan 400 jika token tidak valid', async () => {
        const res = await request(app)
            .put('/authentications')
            .send({
                refreshToken: 'tidak valid'
            });
        
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
    })
});

describe('DELETE /authentications', () => {
    test('harus mengembalikan 200 jika logout berhasil', async () => {
        const resLogin = await request(app)
            .post('/authentications')
            .send({
                username: 'budifunctional',
                password: 'rahasia123'
            }); 

        const { refreshToken } = resLogin.body.data;

        const res = await request(app)
            .delete('/authentications')
            .send({
                refreshToken
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
    });

    test('harus mengembalikan 400 jika refresh token tidak ditemukan di database', async () => {
        const res = await request(app)
            .delete('/authentications')
            .send({ refreshToken: 'token_palsu' });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
    });
});