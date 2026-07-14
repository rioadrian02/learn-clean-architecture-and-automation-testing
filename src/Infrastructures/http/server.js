import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/users.js';
import authenticationRoutes from './routes/authentications.js';
import ErrorHandler from './middlewares/ErrorHandler.js';
import { globalLimiter } from './middlewares/RateLimiter.js';
import apiDocsMiddleware from './middlewares/ApiDocs.js';

const createServer = () => {
    const app = express();

    // using helmet
    app.use(helmet());

    // using cors
    app.use(cors());    

    // global limiter
    app.use(globalLimiter);

    app.use(express.json());

     // Dokumentasi API — hanya tampil di development
    if (process.env.NODE_ENV !== 'production') {
        app.use('/docs', apiDocsMiddleware);
    }

    // user routes
    app.use('/users', userRoutes);

    // auth routes
    app.use('/authentications', authenticationRoutes);

    // error handler
    app.use(ErrorHandler);

    return app;
}

export default createServer;