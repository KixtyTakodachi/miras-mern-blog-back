import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register =  async (req, res) => {
	try {
		//FIXME Шифрование пароля
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		//FIXME Создание 1 сущности для Монго
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		//FIXME Сохранение сущности в БД
		const user = await doc.save()

		//FIXME Создание токена
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d'
			}
		)

		//FIXME Убираем хэш пароля из ответа
		const {passwordHash, ...userData} = user._doc

		//FIXME Передача ответа
		res.json({
			...userData,
			token
		})
	} catch (e){
		console.log(e)
		res.status(500).json({
			message: 'Не удалось зарегистрироваться'
		})
	}
}

export const login = async (req, res) => {
	try {
		//FIXME Проверка есть ли пользователь вообще
		const user = await UserModel.findOne({ email: req.body.email, })

		if(!user){
			return res.status(400).json({
				message: 'Пользователь не найден'
			})
		}

		//FIXME Проверка совпадают ли пароли
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if(!isValidPass){
			return res.status(400).json({
				message: 'Неверный логин или пароль'
			})
		}

		//FIXME Создание токена
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d'
			}
		)

		//FIXME Убираем хэш пароля из ответа
		const {passwordHash, ...userData} = user._doc

		//FIXME Передача ответа
		res.json({
			...userData,
			token
		})
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Не удалось авторизоваться'
		})
	}
}

export const getMe = async (req, res) => {
	try{
		//FIXME Поиск пользователя по id который мы получили из токена
		const user = await UserModel.findById(req.userId)
		if(!user){
			return res.status(404).json({
				message: 'Пользователь не найден'
			})
		}
		//FIXME Убираем хэш пароля из ответа
		const {passwordHash, ...userData} = user._doc

		//FIXME Передача ответа
		res.json({
			...userData,
		})
	} catch (e) {
		console.log(e)
		res.status(500).json({
			message: 'Нет доступа'
		})
	}
}