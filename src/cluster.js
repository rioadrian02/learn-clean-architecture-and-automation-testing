import cluster from 'cluster';
import os from 'os';
import logger from './Infrastructures/logger/index.js';

const totalCPUs = os.cpus().length;

if(cluster.isPrimary) {
    // Ini adalah master process
    logger.info(`Master process berjalan`, {
        pid: process.pid,
        totalCPUs
    });

    // Buat satu worker untuk setiap core CPU
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    // Kalau ada worker yang mati, buat worker baru untuk menggantikannya
    cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} mati`, {code, signal});
        logger.info(`Membuat worker baru sebagai pengganti...`);
        cluster.fork();
    });
} else {
    // Ini adalah worker process — jalankan server seperti biasa
    const { default: createServer } = await import('./Infrastructures/http/server.js');
    const { default: logger } = await import('./Infrastructures/logger/index.js');

    const app = createServer();
    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, () => {
        logger.info(`Worker ${process.pid} berjalan di port ${PORT}`);
    });

    // Graceful shutdown untuk setiap worker
    const gracefulShutdown = (signal) => {
        logger.info(`Worker ${process.pid} menerima ${signal}, shutdown...`);

        server.close(() => {
            logger.info(`Worker ${process.pid} berhasil ditutup`);
            process.exit(0);
        });

        setTimeout(() => {
            logger.error(`Worker ${process.pid} timeout, memaksa keluar`);
            process.exit(1);
        }, 30000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Tangkap error yang tidak tertangani
    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled Promise Rejection', { reason });
    });

    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception', {
            message: error.message,
            stack: error.stack
        });

        process.exit(1);
    })
}