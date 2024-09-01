import responseHandler from '../handlers/response.handler.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const ValidateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return responseHandler.unauthenticate(res, "NO AUTHENTICATION");
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                return next( error );
            }

            req.user = decoded;
            next();
        });
    } catch( error ) {
        next( error )
    }
};

const ValidateForgotPassword = async (req, res, next) => {
    try {
        const { email, newpassword, otp } = req.body;

        if ( !newpassword || newpassword.trim().length === 0 ) {
            return responseHandler.badRequest(res, "NEW PASSWORD IS NULL");
        } else if ( !email || email.trim().length === 0 ) {
            return responseHandler.badRequest(res, "EMAIL IS NULL");
        } else if (!otp || otp.length < 6) {
            return responseHandler.badRequest(res, "OTP IS NOT VALID");
        }

        next();
    } catch (error) {
        next( error );
    }
};



export default {
    ValidateToken,
    ValidateForgotPassword
}