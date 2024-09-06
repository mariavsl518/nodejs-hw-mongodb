import createHttpError from 'http-errors'
import path from 'node:path'
import * as fs from 'node:fs'
import swaggerUi from 'swagger-ui-express'

export function swaggerDocs() {
    try {
        const doc = JSON.parse(fs.readFileSync(path.resolve('docs', 'swagger.json'), { encoding: 'utf-8' }))
        return [...swaggerUi.serve, swaggerUi.setup(doc)]
    } catch (error) {
        return (req, res, next) => {
          next(createHttpError(500, 'Can not load swagger docs'));
        };
    }
}
