import CommentsModel from '../models/Comments.js'
import PostModel from '../models/Post.js'

export const getAllByPost = async (req, res) => {
	try {
		const comments = await CommentsModel.find({postId: req.params.postId}).populate('user').exec()

		res.json(comments)
	} catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить комментарии'
		})
	}
}

export const addCommentToPost = async (req, res) => {
	try {
		const doc = new CommentsModel({
			text: req.body.text,
			postId: req.params.postId,
			user: req.userId,
		})

		const comment = await doc.save()

		const post = await PostModel.findOneAndUpdate(
			{
				_id: req.params.postId
			},
			{
				$inc: { commentCount: 1}
			},
			{
				new: true
			}
		)

		const comments = await CommentsModel.find({postId: req.params.postId}).populate('user').exec()

		res.json(comments)

	}	catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось добавить комментарий'
		})
	}
}

export const getAllComments = async (req, res) => {
	try {
		const comments = await CommentsModel.find().sort({createdAt: 'desc'}).populate('user').exec()

		res.json(comments)
	} catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить комментарии'
		})
	}
}