import express from 'express'
import multer from 'multer'
import mongoose from "mongoose";
import cors from 'cors';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation
} from "./validations/validations.js";
import { UserController, PostController, CommentsController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import {getAllByTag, getAllPopular} from "./controllers/PostController.js";
import {addCommentToPost} from "./controllers/CommentsController.js";
import {configDotenv} from "dotenv";
import * as fs from "fs";

configDotenv()
//FIXME db connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then( () => console.log('DB ok'))
  .catch( err => console.log('DB Error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if(!fs.existsSync('/uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
//FIXME checkAuth это middleware функция которая проверяет токен если токен есть и все с ним норм то она пропускает сюда
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/posts', PostController.getAll)
app.get('/posts/popular', PostController.getAllPopular)
app.get('/tags/:tag', PostController.getAllByTag)
app.get('/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)

app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.post('/comments/:postId', checkAuth, commentCreateValidation, handleValidationErrors, CommentsController.addCommentToPost)
app.get('/comments/:postId', CommentsController.getAllByPost)
app.get('/comments', CommentsController.getAllComments)

app.listen(process.env.PORT || '4444', (err) => {
  if(err){
    return console.log(err)
  }
  console.log('Listening on port 4444')
})
