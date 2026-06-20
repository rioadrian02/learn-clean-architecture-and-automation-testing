import ClientError from "../../../Commons/exceptions/ClientError.js";

const ErrorHandler = (error, req, res, next) => {
    if(error instanceof ClientError) {
        return res.status(error.statusCode).json({
            status: 'fail',
            message: error.message
        });
    }

    if (/^[A-Z_]+\.[A-Z_]+$/.test(error.message)) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }


    console.error(error);
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
}

export default ErrorHandler;