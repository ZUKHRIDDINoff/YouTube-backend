import { Router } from "express";
import  controller  from '../controllers/user.js'
import validation from "../middleware/validation.js";
const router = Router()

router.post('/register',validation,controller.REGISTER)
router.post('/tokenChecker',controller.TOKEN_CHECKER)
router.post('/login',validation,controller.LOGIN)
router.post('/privateVideos',controller.PRIVATE_VIDEOS)
router.put('/changeVideoName',controller.CHANGE_VIDEO_NAME)
router.delete('/deleteVideo',controller.DELETE_VIDEO)
router.post('/uploadVideo',controller.UPLOAD_VIDEO)
router.get('/users',controller.GET_USERS)
router.get('/videos',controller.GET_VIDEOS)

export default router