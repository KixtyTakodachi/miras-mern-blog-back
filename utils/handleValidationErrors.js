import {validationResult} from "express-validator";
//FIXME Валидация введенных данных
export default (req, res, next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json(errors.array())
	}

	next()
}

