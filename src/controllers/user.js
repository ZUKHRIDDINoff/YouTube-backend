import path from 'path'
import JWT from 'jsonwebtoken'
import sha256 from 'sha256'



const TOKEN_CHECKER = (req, res) => {
    try {
        let {
            token,
            password
        } = req.body

        // password = JSON.parse(password)
        // token = JSON.parse(token)
        // console.log(password, );
        const check = JWT.verify(token, 'HIDDEN_KEY')
        if (!check.userId) return res.status(403).json({
            status: 403,
            message: "Your token is invalid"
        })

        const {
            userId
        } = check
        const users = req.readFile('users')

        const user = users.find(user => user.userId == userId)

        if (user.password != password) return res.status(403).json({
            status: 403,
            message: "Your old password is invalid"
        })

        if (!user) return res.status(403).json({
            status: 403,
            message: "User not found from database"
        })

        return res.status(200).json({
            status: 200,
            "profileImage": user.profileImage,
            message: 'You registered successfully'
        })
    } catch (error) {
        return null
    }
}




const REGISTER = (req, res) => {
    const image = req.files.img
    let {
        username,
        password
    } = req.body

    const users = req.readFile('users')
    users ? users : []

    if (users.find(user => user.username == username)) {
        return res.status(403).json({
            status: 403,
            num: 1,
            message: 'User already exists'
        })
    }

    image.mv(path.join(process.cwd(), 'src', 'avatars', req.files.img.name))

    const newUser = {
        username,
        userId: users.length ? users.at(-1).userId + 1 : 1,
        password: sha256(password),
        profileImage: req.files.img.name
    }

    users.push(newUser)

    req.writeFile('users', users)

    return res.status(200).json({
        status: 200,
        message: "User successfully registered!",
        password: newUser.password,
        avatar: newUser.profileImage,
        token: JWT.sign({
            "userId": newUser.userId
        }, 'HIDDEN_KEY')
    })
}




const LOGIN = (req, res) => {
    let {
        username,
        password
    } = req.body

    if (!username || !password) return res.status(401).json({
        status: '401',
        message: "Invalid username or password"
    })

    const users = req.readFile('users')

    const user = users.find(user => user.username == username && user.password == sha256(password))

    res.status(200).json({
        status: 200,
        message: "User logged successfully!",
        avatar: user.profileImage,
        password: user.password,
        token: JWT.sign({
            userId: user.userId
        }, 'HIDDEN_KEY')
    })
}




JSON
const PRIVATE_VIDEOS = (req, res) => {
    let {
        token
    } = req.body
    // token = token.split('"')
    // token = token[1]
    // token = JSON.parse(token)
    const users = req.readFile('users')
    const videos = req.readFile('videos')

    const check = JWT.verify(token, 'HIDDEN_KEY')
    let {
        userId
    } = check
    const finder = users.find(user => user.userId == userId)
    if (!finder) return res.status(405).json({
        status: 405,
        message: "Your id not found!"
    })

    const video = videos.filter(el => el.userId == userId)

        !video.length ? res.status(403).json({
            status: 403,
            message: "Videos not found",
        }) : res.status(200).json({
            status: 200,
            message: "Videos found successfully",
            video
        })
}




const CHANGE_VIDEO_NAME = (req, res) => {
    const {
        newTitle,
        videoId
    } = req.body
    const videos = req.readFile('videos')
    const finder = videos.find(el => el.videoId == videoId)

    if (!finder) return res.status(403).json({
        status: 403,
        message: "Video not found"
    })


    finder.videoTitle = newTitle

    req.writeFile('videos', videos)

    return res.status(200).json({
        status: 200,
        message: "Title successfully updated"
    })
}




const DELETE_VIDEO = (req, res) => {
    const {
        videoId
    } = req.body
    const videos = req.readFile('videos')
    const filtered = videos.filter(el => el.videoId != videoId)

    req.writeFile('videos', filtered)

    return res.status(200).json({
        status: 200,
        message: "Video deleted successfully!"
    })
}

const UPLOAD_VIDEO = (req, res) => {
    let {
        videoTitle,
        token,
        profileImage
    } = req.body;
    let {
        name,
        size
    } = req.files.video

    size = +size / (1024 ** 2) | 0
    if (size == 0) size = 0.5
    size += ' MB'
    const userId = JWT.verify(token, 'HIDDEN_KEY').userId

    let videos = req.readFile('videos')
    let users = req.readFile('users')
    let username = users.find(user => user.userId == userId)
    username = username.username

    req.files.video.mv(path.join(process.cwd(), 'src', 'uploads', req.files.video.name))
    let newVideo = {
        videoId: videos.length ? videos.at(-1).videoId + 1 : 1,
        userId,
        username,
        videoNameFile: name,
        videoSize: size,
        videoTitle,
        profileImage,
        date: new Date().toISOString().slice(0, 10) + ' | ' + new Date().toLocaleTimeString([], {
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    videos.push(newVideo)
    req.writeFile('videos', videos)

    res.status(200).json({
        status: 200,
        message: 'Video added successfully!'
    })
}




const GET_USERS = (req, res) => {
    const users = req.readFile('users') || []

    return res.status(200).json({
        users,
        message: "sucess"
    })
}




const GET_VIDEOS = (req, res) => {
    const videos = req.readFile('videos') || []
    return res.status(200).json({
        status: 200,
        videos,
        messages: "sucess"
    })
}


export default {
    TOKEN_CHECKER,
    REGISTER,
    LOGIN,
    PRIVATE_VIDEOS,
    CHANGE_VIDEO_NAME,
    DELETE_VIDEO,
    UPLOAD_VIDEO,
    GET_USERS,
    GET_VIDEOS
}