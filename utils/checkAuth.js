import jwt from 'jsonwebtoken'

export default (req, res, next) => {
	//FIXME Получение токена
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	//FIXME Проверка есть ли токен
	if(token){
		try{
			//FIXME Декодирование токена
			const decoded = jwt.verify(token, 'secret123')
			//FIXME Прикрепляем id к запросу чтобы мы могли получить id в дальнейших функциях
			req.userId = decoded._id
			next()
		} catch (e) {
			//FIXME Если токен гавно
			return res.status(403).json({
				message: 'Нет доступа'
			})
		}
	} else {
		//FIXME Если нет токена
		return res.status(403).json({
			message: 'Нет доступа'
		})
	}
}