import jwt from 'jsonwebtoken'

export const generateToken = userId =>
	jwt.sign(
		{
			userId, 
			role
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '10d'
		}
	)
