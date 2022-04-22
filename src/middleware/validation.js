import {
    loginSchema,
    registerSchema
} from "../utils/validations.js";
export default (req, res, next) => {
    try {
        if (req.url == '/login') {
            const {
                error
            } = loginSchema.validate(req.body)
            if (error) {
                return res.status(403).json({
                    status: 403,
                    message: "Wrong username or password"
                })
            }
        }
        if (req.url == '/register') {
            const {
                error
            } = registerSchema.validate(req.body)
            if (error) {
                return res.status(403).json({
                    status: 403,
                    message: "Wrong username or password"
                })
            }
        }
        return next()
    } catch (error) {
        return next(error.massage)
    }
}