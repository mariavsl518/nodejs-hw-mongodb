export async function errorHandler(error, req, res, next) {

    console.error(error);
    res.status(500).send({
        status: 500,
        message: "Something went wrong",
        data: error.message,
    });
}
