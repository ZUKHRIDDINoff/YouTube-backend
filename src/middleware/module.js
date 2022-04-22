import path from 'path'
import fs from 'fs'

export default ({ databasePath }) => {
    try {
        return (req, res, next) => {
            req.readFile = function (fileName) {
                const jsonData = fs.readFileSync(path.join(databasePath, fileName + '.json'), 'UTF-8')
                return JSON.parse(jsonData) || []
            }
            req.writeFile = function (fileName, data) {
                fs.writeFileSync(path.join(databasePath, fileName + '.json'), JSON.stringify(data, null, 4))
            }
            
            return next()
        }
    } catch (error) {
        return next(500,error.massage)
    }
}