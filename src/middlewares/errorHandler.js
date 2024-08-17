import {isHttpError} from "http-errors";

export async function errorHandler(error, req, res, next) {

    if (isHttpError(error) === true) {
        console.log(error);
        return res.status(error.status).send({
        status: error.status,
        message: "Something went wrong",
        data: error.message,
        });

    }
    res.status(500).send({ status: 500, message: 'Internal Server Error' });
}
