const createHttpError = require('http-errors');

const errorMiddware = {
    notFoundHandler: (_, __, next) => {
        const err = new createHttpError.NotFound()
        next(err)
    },

    errorHandler: (err, _, res, _next) => {
        res.status(err?.statusCode || new createHttpError.InternalServerError().status)
        res.json({
            error: {
                message: err.message,
                status: err.status,
            },
        })
    },
}

module.exports = errorMiddware