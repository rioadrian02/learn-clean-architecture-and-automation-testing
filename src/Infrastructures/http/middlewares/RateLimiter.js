import rateLimit from 'express-rate-limit';

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'fail',
        message: 'Terlalu banyak request, silahkan coba lagi dalam 15 menit'
    }
});

const loginLimitter = rateLimit({
    windowMs: 15 * 60 * 1000, //dalam milidetik
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'fail',
        message: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit'
    }
});

export { globalLimiter, loginLimitter };