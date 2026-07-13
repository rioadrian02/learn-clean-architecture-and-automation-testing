import 'dotenv/config';
import createServer from './Infrastructures/http/server.js';
import logger from './Infrastructures/logger/index.js';

const app = createServer();
const PORT  =  process.env.PORT || 3000;

// simpan instance server ke dalam variabel supaya bisa kita tutup saat shutdown
const server = app.listen(PORT, () => {
    logger.info(`Server berjalan di http://localhost:${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
    });
});

// fungsi graceful shutdown
const gracefulShutdown = (signal) => {
    logger.info(`Menerima sinyal ${signal}, memulai graceful shutdown`);

    // langkah 1, hentikan server dari menerima request baru, tapi request yang sedang berjalan tetap lanjut
    server.close((error) => {
        if(error) {
            logger.error('Error saat menutup server', { error: error.message});
            process.exit(1);
        }

        // langkah 2, semua request selesai, server sudah tertutup
        logger.info('Server berhasil ditutup dengan baik');

        // langkah 3, keluar dari proses dengan kode 0 (sukses)
        process.exit(0);
    });

    // langkah 4, paksa keluar kalau dalam 30s belum selesai juga request nya(misal stuck).
    setTimeout(() => {
        logger.error('Graceful shutdown timeout - memaksa keluar');
        process.exit(1);
    }, 30000);
}

// Tangkap sinyal shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // ctrl + c
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); //Docker / PM2

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