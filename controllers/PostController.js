import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try{
		const posts = await PostModel.find().populate('user').exec()

		res.json(posts)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить статьи'
		})
	}
}

export const getAllPopular = async (req, res) => {
	try{
		const posts = await PostModel.find().sort({viewsCount: 'desc'}).populate('user').exec()

		res.json(posts)
	} catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить статьи'
		})
	}
}

export const getAllByTag = async(req, res) => {
	try {
		const posts = await PostModel.find({tags: {$in: req.params.tag}}).populate('user').exec()

		res.json(posts)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить статьи'
		})
	}
}

export const getOne = async (req, res) => {
	try{
		const postId = req.params.id

		const doc = await PostModel.findOneAndUpdate(
			{
				_id: postId
			},
			{
				$inc: { viewsCount: 1 }
			},
			{
				new: true
			}
		).populate('user')

		if(!doc){
			return res.status(404).json({
				message: 'Статья не найдена'
			})
		}

		return res.json(doc)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить статьи'
		})
	}
}

export const remove = async (req, res) => {
	try{
		const postId = req.params.id

		const doc = await PostModel.findOneAndDelete({
			_id: postId
		})

		if(!doc){
			return res.status(404).json({
				message: 'Статья не найдена'
			})
		}

		return res.json({
			success: true
		})
	} catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось удалить статью'
		})
	}
}

export const create = async (req, res) => {
	try{
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(/, ?/g),
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось создать статью'
		})
	}
}

export const update = async (req, res) => {
	try{
		const postId = req.params.id

		await PostModel.updateOne(
			{
				_id: postId
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags.split(/, ?/g),
			}
		)

		res.json({
			success: true
		})
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось обновить статью'
		})
	}
}

export const getLastTags = async(req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = posts.map(item => item.tags).flat().slice(0, 5)

		res.json(tags)
	} catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось получить тэги'
		})
	}
}